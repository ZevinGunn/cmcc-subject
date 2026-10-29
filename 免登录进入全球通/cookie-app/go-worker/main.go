package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Config struct {
	BindAddr    string
	NodeAPIBase string
	AdminKey    string
	WorkerKey   string
	Concurrency int
	RateLimit   time.Duration
	Timeout     time.Duration
}

type TaskRequest struct {
	AccountIDs []string `json:"accountIds"`
}

type TaskResult struct {
	ID        string `json:"id"`
	OK        bool   `json:"ok"`
	Message   string `json:"message,omitempty"`
	ErrorCode string `json:"errorCode,omitempty"`
	Status    int    `json:"status,omitempty"`
}

type BatchData struct {
	Total   int          `json:"total"`
	Success int          `json:"success"`
	Failed  int          `json:"failed"`
	Results []TaskResult `json:"results"`
}

type BatchResp struct {
	OK      bool      `json:"ok"`
	Data    BatchData `json:"data,omitempty"`
	Message string    `json:"message,omitempty"`
}

type AccountsListResp struct {
	OK      bool   `json:"ok"`
	Message string `json:"message,omitempty"`
	Data    struct {
		Accounts []AccountSummary `json:"accounts"`
	} `json:"data"`
}

type AccountSummary struct {
	ID        string `json:"id"`
	HasCookie bool   `json:"hasCookie"`
}

type BasicResp struct {
	OK        bool   `json:"ok"`
	Message   string `json:"message,omitempty"`
	ErrorCode string `json:"errorCode,omitempty"`
}

type APIClient struct {
	BaseURL   string
	AdminKey  string
	Client    *http.Client
	RateLimit *time.Ticker
}

func loadConfig() Config {
	bind := strings.TrimSpace(getEnv("WORKER_BIND", "127.0.0.1:9011"))
	base := strings.TrimSpace(getEnv("NODE_API_BASE", "http://127.0.0.1:8002"))
	if strings.HasSuffix(base, "/") {
		base = strings.TrimRight(base, "/")
	}
	concurrency := parseIntEnv("WORKER_CONCURRENCY", 4, 1, 20)
	rateMs := parseIntEnv("WORKER_RATE_LIMIT_MS", 0, 0, 60000)
	timeoutMs := parseIntEnv("WORKER_TIMEOUT_MS", 15000, 2000, 60000)
	return Config{
		BindAddr:    bind,
		NodeAPIBase: base,
		AdminKey:    strings.TrimSpace(os.Getenv("ADMIN_KEY")),
		WorkerKey:   strings.TrimSpace(os.Getenv("WORKER_KEY")),
		Concurrency: concurrency,
		RateLimit:   time.Duration(rateMs) * time.Millisecond,
		Timeout:     time.Duration(timeoutMs) * time.Millisecond,
	}
}

func parseIntEnv(name string, def int, min int, max int) int {
	raw := strings.TrimSpace(os.Getenv(name))
	if raw == "" {
		return def
	}
	n, err := strconv.Atoi(raw)
	if err != nil {
		return def
	}
	if n < min {
		return min
	}
	if n > max {
		return max
	}
	return n
}

func getEnv(name string, def string) string {
	if v := strings.TrimSpace(os.Getenv(name)); v != "" {
		return v
	}
	return def
}

func main() {
	cfg := loadConfig()
	client := &APIClient{
		BaseURL:  cfg.NodeAPIBase,
		AdminKey: cfg.AdminKey,
		Client: &http.Client{
			Timeout: cfg.Timeout,
		},
	}
	if cfg.RateLimit > 0 {
		client.RateLimit = time.NewTicker(cfg.RateLimit)
	}
	defer func() {
		if client.RateLimit != nil {
			client.RateLimit.Stop()
		}
	}()

	mux := http.NewServeMux()
	mux.HandleFunc("/health", withCORS(withKey(cfg, healthHandler)))
	mux.HandleFunc("/worker/refresh-cookies", withCORS(withKey(cfg, refreshCookiesHandler(client, cfg))))
	mux.HandleFunc("/worker/refresh-tokens", withCORS(withKey(cfg, refreshTokensHandler(client, cfg))))
	mux.HandleFunc("/worker/refresh-cookies-then-tokens", withCORS(withKey(cfg, refreshCookiesThenTokensHandler(client, cfg))))

	server := &http.Server{
		Addr:    cfg.BindAddr,
		Handler: mux,
	}
	log.Printf("Go worker listening on %s", cfg.BindAddr)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("server error: %v", err)
	}
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Worker-Key")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

func withKey(cfg Config, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if cfg.WorkerKey == "" {
			next(w, r)
			return
		}
		key := strings.TrimSpace(r.Header.Get("X-Worker-Key"))
		if key != cfg.WorkerKey {
			writeJSON(w, http.StatusForbidden, BatchResp{
				OK:      false,
				Message: "Forbidden",
			})
			return
		}
		next(w, r)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"ok": true,
		"data": map[string]any{
			"status": "ok",
		},
	})
}

func refreshCookiesHandler(client *APIClient, cfg Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		req, err := parseTaskRequest(r)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, BatchResp{OK: false, Message: err.Error()})
			return
		}
		ids, err := listAccountIDs(client, req.AccountIDs, true)
		if err != nil {
			writeJSON(w, http.StatusBadGateway, BatchResp{OK: false, Message: err.Error()})
			return
		}
		results := runPool(ids, cfg.Concurrency, func(id string) TaskResult {
			return refreshCookieForID(client, id)
		})
		writeJSON(w, http.StatusOK, BatchResp{OK: true, Data: summarize(results)})
	}
}

func refreshTokensHandler(client *APIClient, cfg Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		req, err := parseTaskRequest(r)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, BatchResp{OK: false, Message: err.Error()})
			return
		}
		ids, err := listAccountIDs(client, req.AccountIDs, true)
		if err != nil {
			writeJSON(w, http.StatusBadGateway, BatchResp{OK: false, Message: err.Error()})
			return
		}
		results := runPool(ids, cfg.Concurrency, func(id string) TaskResult {
			return refreshTokenForID(client, id)
		})
		writeJSON(w, http.StatusOK, BatchResp{OK: true, Data: summarize(results)})
	}
}

func refreshCookiesThenTokensHandler(client *APIClient, cfg Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		req, err := parseTaskRequest(r)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, BatchResp{OK: false, Message: err.Error()})
			return
		}
		ids, err := listAccountIDs(client, req.AccountIDs, true)
		if err != nil {
			writeJSON(w, http.StatusBadGateway, BatchResp{OK: false, Message: err.Error()})
			return
		}
		runPool(ids, cfg.Concurrency, func(id string) TaskResult {
			return refreshCookieForID(client, id)
		})
		ids, err = listAccountIDs(client, req.AccountIDs, true)
		if err != nil {
			writeJSON(w, http.StatusBadGateway, BatchResp{OK: false, Message: err.Error()})
			return
		}
		results := runPool(ids, cfg.Concurrency, func(id string) TaskResult {
			return refreshTokenForID(client, id)
		})
		writeJSON(w, http.StatusOK, BatchResp{OK: true, Data: summarize(results)})
	}
}

func parseTaskRequest(r *http.Request) (TaskRequest, error) {
	if r.Body == nil {
		return TaskRequest{}, nil
	}
	defer r.Body.Close()
	decoder := json.NewDecoder(r.Body)
	var req TaskRequest
	if err := decoder.Decode(&req); err != nil && !errors.Is(err, context.Canceled) {
		return TaskRequest{}, errors.New("invalid json body")
	}
	return req, nil
}

func listAccountIDs(client *APIClient, ids []string, onlyHasCookie bool) ([]string, error) {
	list, err := client.ListAccounts()
	if err != nil {
		return nil, err
	}
	filter := map[string]struct{}{}
	if len(ids) > 0 {
		for _, id := range ids {
			id = strings.TrimSpace(id)
			if id != "" {
				filter[id] = struct{}{}
			}
		}
	}
	out := make([]string, 0, len(list))
	for _, acc := range list {
		if onlyHasCookie && !acc.HasCookie {
			continue
		}
		if len(filter) > 0 {
			if _, ok := filter[acc.ID]; !ok {
				continue
			}
		}
		out = append(out, acc.ID)
	}
	return out, nil
}

func (c *APIClient) waitRateLimit(ctx context.Context) error {
	if c.RateLimit == nil {
		return nil
	}
	select {
	case <-c.RateLimit.C:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func (c *APIClient) ListAccounts() ([]AccountSummary, error) {
	ctx := context.Background()
	if err := c.waitRateLimit(ctx); err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.BaseURL+"/api/accounts", nil)
	if err != nil {
		return nil, err
	}
	if c.AdminKey != "" {
		req.Header.Set("X-Admin-Key", c.AdminKey)
	}
	resp, err := c.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var decoded AccountsListResp
	if err := json.NewDecoder(resp.Body).Decode(&decoded); err != nil {
		return nil, err
	}
	if !decoded.OK {
		if decoded.Message == "" {
			decoded.Message = "list accounts failed"
		}
		return nil, errors.New(decoded.Message)
	}
	return decoded.Data.Accounts, nil
}

func refreshCookieForID(client *APIClient, id string) TaskResult {
	_, status, resp, err := client.PostJSON("/api/accounts/"+id+"/refresh", map[string]any{})
	if err != nil {
		return TaskResult{ID: id, OK: false, Message: err.Error()}
	}
	if !resp.OK {
		return TaskResult{
			ID:        id,
			OK:        false,
			Message:   resp.Message,
			ErrorCode: resp.ErrorCode,
			Status:    status,
		}
	}
	return TaskResult{ID: id, OK: true}
}

func refreshTokenForID(client *APIClient, id string) TaskResult {
	_, status, resp, err := client.PostJSON("/api/accounts/"+id+"/qqt/token", map[string]any{})
	if err != nil {
		return TaskResult{ID: id, OK: false, Message: err.Error()}
	}
	if !resp.OK {
		return TaskResult{
			ID:        id,
			OK:        false,
			Message:   resp.Message,
			ErrorCode: resp.ErrorCode,
			Status:    status,
		}
	}
	return TaskResult{ID: id, OK: true}
}

func (c *APIClient) PostJSON(path string, payload any) ([]byte, int, BasicResp, error) {
	ctx := context.Background()
	if err := c.waitRateLimit(ctx); err != nil {
		return nil, 0, BasicResp{}, err
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return nil, 0, BasicResp{}, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.BaseURL+path, bytes.NewReader(body))
	if err != nil {
		return nil, 0, BasicResp{}, err
	}
	req.Header.Set("Content-Type", "application/json")
	if c.AdminKey != "" {
		req.Header.Set("X-Admin-Key", c.AdminKey)
	}
	resp, err := c.Client.Do(req)
	if err != nil {
		return nil, 0, BasicResp{}, err
	}
	defer resp.Body.Close()
	var decoded BasicResp
	if err := json.NewDecoder(resp.Body).Decode(&decoded); err != nil {
		return nil, resp.StatusCode, BasicResp{}, err
	}
	return nil, resp.StatusCode, decoded, nil
}

func runPool(items []string, concurrency int, fn func(string) TaskResult) []TaskResult {
	if len(items) == 0 {
		return []TaskResult{}
	}
	if concurrency <= 0 {
		concurrency = 1
	}
	if concurrency > len(items) {
		concurrency = len(items)
	}
	results := make([]TaskResult, len(items))
	indexCh := make(chan int)
	var wg sync.WaitGroup
	for i := 0; i < concurrency; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for idx := range indexCh {
				results[idx] = fn(items[idx])
			}
		}()
	}
	for idx := range items {
		indexCh <- idx
	}
	close(indexCh)
	wg.Wait()
	return results
}

func summarize(results []TaskResult) BatchData {
	success := 0
	for _, r := range results {
		if r.OK {
			success++
		}
	}
	return BatchData{
		Total:   len(results),
		Success: success,
		Failed:  len(results) - success,
		Results: results,
	}
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(true)
	_ = enc.Encode(payload)
}
