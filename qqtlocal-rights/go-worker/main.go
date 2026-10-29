package main

import (
	"encoding/json"
	"fmt"
	"io"
	"math"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

const (
	REFERER_PAGE          = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html"
	XINGDONG_REFERER_PAGE = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdractivity.html?sspId=75442"
	INFO_URL              = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/member/func/queryVipLevel.do"
	CLAIM_URL             = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/normal/initNormalNewQy?mcyp"
	XINGDONG_CLAIM_URL    = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/member/func/initQyStatus.do"
	WED_RECHARGE_URL      = "https://wx.10086.cn/hlwyxhdhub/api/wedrecharge/drawPrize"
	WED_RECHARGE_REFERER  = "https://wx.10086.cn/hlwyxhdhub/act-wedrecharge/1024101716"
	WED_RECHARGE_UA       = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/wkwebview leadeon/12.0.9/CMCCIT"
)

type Config struct {
	CookiesText            string    `json:"cookies_text"`
	Accounts               []Account `json:"accounts"`
	RunMode                string    `json:"run_mode"`
	MaxWorkers             int       `json:"max_workers"`
	JitterMs               int       `json:"jitter_ms"`
	PollTimes              int       `json:"poll_times"`
	PollIntervalMs         int       `json:"poll_interval_ms"`
	StartDelayMs           int       `json:"start_delay_ms"`
	IsRandom               string    `json:"is_random"`
	Source                 string    `json:"source"`
	ReceivePhone           string    `json:"receive_phone"`
	ChannelCode            string    `json:"channel_code"`
	ProductId              string    `json:"product_id"`
	ActivityType           string    `json:"activity_type"`
	XingdongSlot           string    `json:"xingdong_slot"`
	XingdongProductId      string    `json:"xingdong_product_id"`
	DailyXingdongProductId string    `json:"daily_xingdong_product_id"`
	PerAccountDelayMs      int       `json:"per_account_delay_ms"`
	AccountsPerPoll        int       `json:"accounts_per_poll"`
}

type Account struct {
	Cookie       string `json:"cookie"`
	ReceivePhone string `json:"receive_phone"`
	Phone        string `json:"phone"`
	DisplayPhone string `json:"display_phone"`
}

type RttStats struct {
	mu     sync.Mutex
	values []float64
}

var sharedHTTPClient = &http.Client{
	Timeout: 15 * time.Second,
	Transport: &http.Transport{
		Proxy:               http.ProxyFromEnvironment,
		MaxIdleConns:        256,
		MaxIdleConnsPerHost: 128,
		MaxConnsPerHost:     256,
		IdleConnTimeout:     90 * time.Second,
		TLSHandshakeTimeout: 5 * time.Second,
	},
}

func (s *RttStats) Add(ms float64) {
	if ms <= 0 {
		return
	}
	s.mu.Lock()
	s.values = append(s.values, ms)
	s.mu.Unlock()
}

func (s *RttStats) Summary() (int, float64, float64, float64, float64) {
	s.mu.Lock()
	values := append([]float64(nil), s.values...)
	s.mu.Unlock()
	if len(values) == 0 {
		return 0, 0, 0, 0, 0
	}
	sort.Float64s(values)
	count := len(values)
	total := 0.0
	for _, v := range values {
		total += v
	}
	avg := total / float64(count)
	min := values[0]
	max := values[count-1]
	idx := int(math.Ceil(0.95*float64(count))) - 1
	if idx < 0 {
		idx = 0
	}
	p95 := values[idx]
	return count, avg, min, max, p95
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: ./worker <config_json>")
		return
	}

	configJson := os.Args[1]
	var cfg Config
	if err := json.Unmarshal([]byte(configJson), &cfg); err != nil {
		fmt.Printf("Error parsing config: %v\n", err)
		return
	}

	accounts := parseAccounts(cfg)
	if len(accounts) == 0 {
		fmt.Println("No accounts provided")
		return
	}

	if cfg.ProductId == "" {
		cfg.ProductId = "3566"
	}
	if cfg.ActivityType == "" {
		cfg.ActivityType = "normal"
	}
	if cfg.XingdongSlot == "" {
		cfg.XingdongSlot = "all"
	}
	if cfg.PollTimes <= 0 {
		cfg.PollTimes = 1
	}
	if cfg.Source == "" {
		cfg.Source = "1"
	}
	if cfg.IsRandom == "" {
		cfg.IsRandom = "0"
	}
	if cfg.ActivityType == "xingdong" {
		resolveXingdongRuntime(&cfg)
	}
	if cfg.ActivityType == "wed_recharge" {
		cfg.RunMode = "sequential"
		cfg.MaxWorkers = 1
		cfg.PollTimes = 1
		cfg.PollIntervalMs = 0
		cfg.AccountsPerPoll = 0
		if cfg.PerAccountDelayMs <= 0 {
			cfg.PerAccountDelayMs = 300
		}
	}

	if cfg.StartDelayMs > 0 {
		fmt.Printf("[%s] [GO-WORKER] 等待 %dms 后启动...\n", now(), cfg.StartDelayMs)
		time.Sleep(time.Duration(cfg.StartDelayMs) * time.Millisecond)
	}

	stats := &RttStats{}
	fmt.Printf(
		"[%s] [GO-WORKER] 参数检查：账号数=%d cookies_text行数=%d productId=%s activity=%s slot=%s workers=%d poll=%d interval=%dms startDelay=%dms\n",
		now(),
		len(accounts),
		len(parseCookies(cfg.CookiesText)),
		cfg.ProductId,
		cfg.ActivityType,
		cfg.XingdongSlot,
		cfg.MaxWorkers,
		cfg.PollTimes,
		cfg.PollIntervalMs,
		cfg.StartDelayMs,
	)
	fmt.Printf("[%s] [GO-WORKER] 开始执行，账号数: %d, 轮询: %d, activity=%s, slot=%s\n", now(), len(accounts), cfg.PollTimes, cfg.ActivityType, cfg.XingdongSlot)
	if cfg.PerAccountDelayMs > 0 {
		fmt.Printf("[%s] [GO-WORKER] 每轮账号间隔 %dms，单轮账号数: %d\n", now(), cfg.PerAccountDelayMs, effectiveAccountsPerPoll(len(accounts), cfg.AccountsPerPoll))
	}
	if cfg.ActivityType == "wed_recharge" {
		runWedRechargeSerial(accounts, &cfg, stats)
		count, avg, min, max, p95 := stats.Summary()
		if count > 0 {
			fmt.Printf("[%s] [GO-WORKER] RTT统计: count=%d avg=%.1fms min=%.1fms max=%.1fms p95=%.1fms\n", now(), count, avg, min, max, p95)
		} else {
			fmt.Printf("[%s] [GO-WORKER] RTT统计: 无数据。\n", now())
		}
		return
	}
	runPoll(accounts, &cfg, stats)

	count, avg, min, max, p95 := stats.Summary()
	if count > 0 {
		fmt.Printf("[%s] [GO-WORKER] RTT统计: count=%d avg=%.1fms min=%.1fms max=%.1fms p95=%.1fms\n", now(), count, avg, min, max, p95)
	} else {
		fmt.Printf("[%s] [GO-WORKER] RTT统计: 无数据。\n", now())
	}
}

func effectiveAccountsPerPoll(total int, configured int) int {
	if total <= 0 {
		return 0
	}
	if configured <= 0 || configured >= total {
		return total
	}
	return configured
}

func selectAccountsForPoll(all []Account, pollIndex int, accountsPerPoll int) []Account {
	total := len(all)
	if total == 0 {
		return nil
	}
	limit := effectiveAccountsPerPoll(total, accountsPerPoll)
	if limit >= total {
		return all
	}
	start := ((pollIndex - 1) * limit) % total
	chunk := make([]Account, 0, limit)
	for j := 0; j < limit; j++ {
		idx := (start + j) % total
		chunk = append(chunk, all[idx])
	}
	return chunk
}

func runWedRechargeSerial(accounts []Account, cfg *Config, stats *RttStats) {
	fmt.Printf("[%s] [GO-WORKER] [周三话费券] 严格串行开始：账号数=%d 账号间隔=%dms\n", now(), len(accounts), cfg.PerAccountDelayMs)
	success := 0
	participated := 0
	invalid := 0
	failed := 0
	for i, account := range accounts {
		label := account.DisplayPhone
		if strings.TrimSpace(label) == "" {
			label = account.Phone
		}
		if strings.TrimSpace(label) == "" {
			label = fmt.Sprintf("#%d", i+1)
		}
		if !validWedRechargeCookie(account.Cookie) {
			invalid++
			fmt.Printf("[%s] [GO-WORKER] [周三话费券] 账号 %s 跳过 => 缺少 HLWHD_SESSION_TOKEN，请先完成周三活动会话置换。\n", now(), label)
			continue
		}

		client := sharedHTTPClient
		deadline := time.Now().Add(18 * time.Second)
		attempt := 0
		finalCode := "timeout"
		for time.Now().Before(deadline) || time.Now().Equal(deadline) {
			attempt++
			res := wedRechargeDrawOnce(client, account)
			code, _ := res["status_code"].(string)
			msg, _ := res["msg"].(string)
			sendTime, _ := res["send_time"].(string)
			recvTime, _ := res["recv_time"].(string)
			rttMs, _ := res["rtt_ms"].(float64)
			if stats != nil && rttMs > 0 {
				stats.Add(rttMs)
			}
			finalCode = code
			detail := ""
			if !isWedRechargeRetryCode(code) {
				if raw, ok := res["raw"].(string); ok && raw != "" {
					detail = " raw=" + raw
				}
			}
			fmt.Printf(
				"[%s] [GO-WORKER] [周三话费券] 账号 %s 第%d次 请求发送 %s 返回 %s RTT %.1fms HTTP %v 领取结果 => %s %s%s\n",
				now(), label, attempt, sendTime, recvTime, rttMs, res["http_status"], code, msg, detail,
			)
			if code == "0" {
				success++
				if prize, ok := res["prize"].(string); ok && prize != "" {
					fmt.Printf("[%s] [GO-WORKER] [周三话费券] 账号 %s 抢购成功 => %s\n", now(), label, prize)
				}
				break
			}
			if code == "160003" {
				participated++
				break
			}
			if !isWedRechargeRetryCode(code) {
				failed++
				fmt.Printf("[%s] [GO-WORKER] [周三话费券] 账号 %s 非可重试状态，停止该账号。\n", now(), label)
				break
			}
			time.Sleep(wedRechargeRetryInterval(code))
		}
		if finalCode != "0" && finalCode != "160003" && isWedRechargeRetryCode(finalCode) {
			failed++
			if finalCode == "timeout" {
				fmt.Printf("[%s] [GO-WORKER] [周三话费券] 账号 %s 超过 18s 未完成，停止该账号。\n", now(), label)
			}
		}
		if i < len(accounts)-1 && cfg.PerAccountDelayMs > 0 {
			time.Sleep(time.Duration(cfg.PerAccountDelayMs) * time.Millisecond)
		}
	}
	fmt.Printf("[%s] [GO-WORKER] [周三话费券] 串行完成：成功 %d，已参与 %d，CK异常 %d，失败 %d。\n", now(), success, participated, invalid, failed)
}

func validWedRechargeCookie(cookie string) bool {
	return strings.Contains(strings.TrimSpace(cookie), "HLWHD_SESSION_TOKEN=")
}

func isWedRechargeRetryCode(code string) bool {
	return code == "160001" || code == "160005"
}

func wedRechargeRetryInterval(code string) time.Duration {
	if code == "160001" {
		return 80 * time.Millisecond
	}
	if code == "160005" {
		return 250 * time.Millisecond
	}
	return 300 * time.Millisecond
}

func wedRechargeDrawOnce(client *http.Client, account Account) map[string]interface{} {
	body := "{}"
	req, err := http.NewRequest("POST", WED_RECHARGE_URL, strings.NewReader(body))
	nowTime := now()
	if err != nil {
		return map[string]interface{}{
			"status_code": "0",
			"msg":         err.Error(),
			"send_time":   nowTime,
			"recv_time":   nowTime,
			"rtt_ms":      0.0,
			"http_status": 0,
		}
	}
	req.Header.Set("Host", "wx.10086.cn")
	req.Header.Set("Accept", "application/json, text/plain, */*")
	req.Header.Set("Content-Type", "application/json;charset=UTF-8")
	req.Header.Set("Origin", "https://wx.10086.cn")
	req.Header.Set("Sec-Fetch-Site", "same-origin")
	req.Header.Set("login-check", "1")
	req.Header.Set("Sec-Fetch-Mode", "cors")
	req.Header.Set("User-Agent", WED_RECHARGE_UA)
	req.Header.Set("Referer", WED_RECHARGE_REFERER)
	req.Header.Set("Sec-Fetch-Dest", "empty")
	req.Header.Set("Accept-Language", "zh-CN,zh-Hans;q=0.9")
	req.Header.Set("Priority", "u=3, i")
	req.Header.Set("Cookie", account.Cookie)
	req.Header.Set("Connection", "keep-alive")
	req.ContentLength = int64(len(body))

	sendTime := now()
	start := time.Now()
	resp, err := client.Do(req)
	recvTime := now()
	rttMs := float64(time.Since(start).Microseconds()) / 1000.0
	if err != nil {
		return map[string]interface{}{
			"status_code": "exception",
			"msg":         fmt.Sprintf("Network error: %v", err),
			"send_time":   sendTime,
			"recv_time":   recvTime,
			"rtt_ms":      rttMs,
			"http_status": 0,
		}
	}
	defer resp.Body.Close()
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return map[string]interface{}{
			"status_code": strconv.Itoa(resp.StatusCode),
			"msg":         "Read body error",
			"send_time":   sendTime,
			"recv_time":   recvTime,
			"rtt_ms":      rttMs,
			"http_status": resp.StatusCode,
		}
	}
	raw := string(respBody)
	var result map[string]interface{}
	if err := json.Unmarshal(respBody, &result); err != nil {
		return map[string]interface{}{
			"status_code": strconv.Itoa(resp.StatusCode),
			"msg":         raw,
			"send_time":   sendTime,
			"recv_time":   recvTime,
			"rtt_ms":      rttMs,
			"http_status": resp.StatusCode,
			"raw":         raw,
		}
	}
	code := fmt.Sprintf("%v", firstNonNil(result["code"], resp.StatusCode))
	msg := fmt.Sprintf("%v", firstNonNil(result["msg"], ""))
	return map[string]interface{}{
		"status_code": code,
		"msg":         msg,
		"send_time":   sendTime,
		"recv_time":   recvTime,
		"rtt_ms":      rttMs,
		"http_status": resp.StatusCode,
		"raw":         raw,
		"prize":       wedRechargePrizeSummary(result["data"]),
	}
}

func firstNonNil(values ...interface{}) interface{} {
	for _, value := range values {
		if value != nil {
			return value
		}
	}
	return nil
}

func wedRechargePrizeSummary(data interface{}) string {
	rec, ok := data.(map[string]interface{})
	if !ok {
		return ""
	}
	rawPrizes, ok := rec["actPrizes"].([]interface{})
	if !ok {
		return ""
	}
	parts := make([]string, 0, len(rawPrizes))
	for _, item := range rawPrizes {
		prize, ok := item.(map[string]interface{})
		if !ok {
			continue
		}
		name := fmt.Sprintf("%v", firstNonNil(prize["prizeName"], prize["shortName"], "未知奖品"))
		couponCode := strings.TrimSpace(fmt.Sprintf("%v", firstNonNil(prize["couponCode"], "")))
		if couponCode != "" {
			parts = append(parts, name+"/券码:"+couponCode)
		} else {
			parts = append(parts, name)
		}
	}
	return strings.Join(parts, "；")
}

func runPoll(accounts []Account, cfg *Config, stats *RttStats) {
	useSequentialRounds := cfg.RunMode == "sequential"
	if useSequentialRounds {
		seqCfg := *cfg
		seqCfg.RunMode = "sequential"
		seqCfg.MaxWorkers = 1
		for i := 1; i <= cfg.PollTimes; i++ {
			chunk := selectAccountsForPoll(accounts, i, cfg.AccountsPerPoll)
			if len(chunk) == 0 {
				continue
			}
			fmt.Printf("[%s] [GO-WORKER] ===== 轮询 %d/%d 发起 (账号 %d) =====\n", now(), i, cfg.PollTimes, len(chunk))
			runOnce(chunk, &seqCfg, stats)
			fmt.Printf("[%s] [GO-WORKER] ===== 轮询 %d/%d 结束 =====\n", now(), i, cfg.PollTimes)
			if i < cfg.PollTimes && cfg.PollIntervalMs > 0 {
				time.Sleep(time.Duration(cfg.PollIntervalMs) * time.Millisecond)
			}
		}
		return
	}

	var roundWg sync.WaitGroup
	for i := 1; i <= cfg.PollTimes; i++ {
		chunk := selectAccountsForPoll(accounts, i, cfg.AccountsPerPoll)
		if len(chunk) == 0 {
			continue
		}
		fmt.Printf("[%s] [GO-WORKER] ===== 轮询 %d/%d 发起 (账号 %d) =====\n", now(), i, cfg.PollTimes, len(chunk))
		roundWg.Add(1)
		go func(round int, roundAccounts []Account) {
			defer roundWg.Done()
			runOnce(roundAccounts, cfg, stats)
			fmt.Printf("[%s] [GO-WORKER] ===== 轮询 %d/%d 结束 =====\n", now(), round, cfg.PollTimes)
		}(i, chunk)
		if i < cfg.PollTimes && cfg.PollIntervalMs > 0 {
			time.Sleep(time.Duration(cfg.PollIntervalMs) * time.Millisecond)
		}
	}
	roundWg.Wait()
}

func runOnce(accounts []Account, cfg *Config, stats *RttStats) {
	workers := cfg.MaxWorkers
	if workers <= 0 {
		workers = len(accounts)
	}

	if cfg.RunMode == "sequential" || workers <= 1 {
		for i, account := range accounts {
			processOne(i+1, account, cfg, stats)
			if cfg.PerAccountDelayMs > 0 && i < len(accounts)-1 {
				time.Sleep(time.Duration(cfg.PerAccountDelayMs) * time.Millisecond)
			}
		}
	} else {
		var wg sync.WaitGroup
		sem := make(chan struct{}, workers)

		for i, account := range accounts {
			wg.Add(1)
			sem <- struct{}{}
			go func(idx int, acc Account) {
				defer wg.Done()
				defer func() { <-sem }()
				if cfg.PerAccountDelayMs > 0 {
					time.Sleep(time.Duration(idx-1) * time.Duration(cfg.PerAccountDelayMs) * time.Millisecond)
				}
				processOne(idx, acc, cfg, stats)
			}(i+1, account)
		}
		wg.Wait()
	}
}

func processOne(idx int, account Account, cfg *Config, stats *RttStats) {
	if cfg.JitterMs > 0 {
		ms := rand.Intn(cfg.JitterMs)
		time.Sleep(time.Duration(ms) * time.Millisecond)
	}

	client := sharedHTTPClient

	phone := fmt.Sprintf("#%d", idx)
	province := "-"
	netAge := -1
	if cfg.ActivityType == "xingdong" {
		info := queryUserInfo(client, accessTokenCookie(account.Cookie))
		phone, province, netAge = parseUserInfo(info)
		if reason := xingdongSkipReason(netAge, cfg.XingdongSlot); reason != "" {
			fmt.Printf("[%s] [GO-WORKER] 账号 %s %s 跳过 => %s\n", now(), phone, province, reason)
			return
		}
	}

	// 2. Claim
	res := claim(client, account, cfg)
	sendTime, _ := res["send_time"].(string)
	recvTime, _ := res["recv_time"].(string)
	rttMs, _ := res["rtt_ms"].(float64)
	if stats != nil && rttMs > 0 {
		stats.Add(rttMs)
	}
	rttText := "-"
	if rttMs > 0 {
		rttText = fmt.Sprintf("%.1fms", rttMs)
	}

	netAgeText := ""
	if cfg.ActivityType == "xingdong" && netAge >= 0 {
		netAgeText = fmt.Sprintf(" 网龄 %d", netAge)
	}
	fmt.Printf("[%s] [GO-WORKER] 账号 %s %s%s 请求发送 %s 返回 %s RTT %s 领取结果 => %v %s\n", now(), phone, province, netAgeText, sendTime, recvTime, rttText, res["status_code"], res["msg"])
}

func claim(client *http.Client, account Account, cfg *Config) map[string]interface{} {
	data := url.Values{}
	data.Set("productId", cfg.ProductId)
	receivePhone := strings.TrimSpace(account.ReceivePhone)
	if receivePhone == "" {
		receivePhone = cfg.ReceivePhone
	}
	data.Set("receivePhone", receivePhone)
	if cfg.ActivityType == "xingdong" {
		channelCode := strings.TrimSpace(cfg.ChannelCode)
		if channelCode == "" {
			channelCode = "75442"
		}
		data.Set("channelCode", channelCode)
		data.Set("mailCheck", "1")
		data.Set("ischeck", "1")
	} else {
		data.Set("channelCode", cfg.ChannelCode)
		data.Set("isRandom", cfg.IsRandom)
		if cfg.IsRandom == "" {
			data.Set("isRandom", "0")
		}
	}
	data.Set("sourece", cfg.Source)
	if cfg.Source == "" {
		data.Set("sourece", "1")
	}

	claimUrl := CLAIM_URL
	if cfg.ActivityType == "xingdong" {
		claimUrl = XINGDONG_CLAIM_URL
	}
	req, err := http.NewRequest("POST", claimUrl, strings.NewReader(data.Encode()))
	if err != nil {
		nowTime := now()
		return map[string]interface{}{
			"status_code": 0,
			"msg":         err.Error(),
			"send_time":   nowTime,
			"recv_time":   nowTime,
			"rtt_ms":      0.0,
		}
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")
	req.Header.Set("Origin", "https://qqt.cmicrwx.cn")
	req.Header.Set("Referer", refererPage(cfg.ActivityType))
	if cfg.ActivityType == "xingdong" {
		req.Header.Set("Cookie", accessTokenCookie(account.Cookie))
	} else {
		req.Header.Set("Cookie", account.Cookie)
	}
	req.Header.Set("Connection", "keep-alive")
	if cfg.ActivityType == "xingdong" {
		req.Header.Set("Cache-Control", "no-cache")
		req.Header.Set("Pragma", "no-cache")
	}

	sendTime := now()
	start := time.Now()
	resp, err := client.Do(req)
	recvTime := now()
	rttMs := float64(time.Since(start).Microseconds()) / 1000.0
	if err != nil {
		return map[string]interface{}{
			"status_code": 0,
			"msg":         fmt.Sprintf("Network error: %v", err),
			"send_time":   sendTime,
			"recv_time":   recvTime,
			"rtt_ms":      rttMs,
		}
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return map[string]interface{}{
			"status_code": resp.StatusCode,
			"msg":         "Read body error",
			"send_time":   sendTime,
			"recv_time":   recvTime,
			"rtt_ms":      rttMs,
		}
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return map[string]interface{}{
			"status_code": resp.StatusCode,
			"msg":         string(body),
			"send_time":   sendTime,
			"recv_time":   recvTime,
			"rtt_ms":      rttMs,
		}
	}

	status := result["status"]
	if status == nil {
		status = result["code"]
	}
	if status == nil {
		status = resp.StatusCode
	}

	msg := result["msg"]
	if msg == nil {
		msg = result["message"]
	}
	if msg == nil {
		msg = ""
	}

	return map[string]interface{}{
		"status_code": status,
		"msg":         msg,
		"send_time":   sendTime,
		"recv_time":   recvTime,
		"rtt_ms":      rttMs,
	}
}

func resolveXingdongRuntime(cfg *Config) {
	if isXingdongDay() {
		if strings.TrimSpace(cfg.XingdongProductId) != "" {
			cfg.ProductId = strings.TrimSpace(cfg.XingdongProductId)
		}
		return
	}
	cfg.ActivityType = "daily_xingdong"
	if strings.TrimSpace(cfg.DailyXingdongProductId) != "" {
		cfg.ProductId = strings.TrimSpace(cfg.DailyXingdongProductId)
	}
}

func isXingdongDay() bool {
	day := time.Now().Day()
	return day >= 26 && day <= 28
}

func accessTokenCookie(cookie string) string {
	text := strings.TrimSpace(cookie)
	if text == "" {
		return ""
	}
	for _, part := range strings.Split(text, ";") {
		item := strings.TrimSpace(part)
		if strings.HasPrefix(item, "access_token=") {
			return item
		}
	}
	if !strings.Contains(text, "=") {
		return "access_token=" + text
	}
	return text
}

func queryUserInfo(client *http.Client, cookie string) map[string]interface{} {
	data := url.Values{}
	data.Set("sspId", "75442")
	data.Set("tag", "qqtindex")
	req, err := http.NewRequest("POST", INFO_URL, strings.NewReader(data.Encode()))
	if err != nil {
		return nil
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")
	req.Header.Set("Origin", "https://qqt.cmicrwx.cn")
	req.Header.Set("Referer", XINGDONG_REFERER_PAGE)
	req.Header.Set("Cookie", cookie)
	resp, err := client.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil
	}
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil
	}
	return result
}

func refererPage(activityType string) string {
	if activityType == "xingdong" {
		return XINGDONG_REFERER_PAGE
	}
	return REFERER_PAGE
}

func parseUserInfo(info map[string]interface{}) (string, string, int) {
	phone := "-"
	province := "-"
	netAge := -1
	data, ok := info["data"].(map[string]interface{})
	if !ok {
		return phone, province, netAge
	}
	if v, ok := data["phone"].(string); ok && strings.TrimSpace(v) != "" {
		phone = v
	}
	if v, ok := data["province"].(string); ok && strings.TrimSpace(v) != "" {
		province = v
	}
	switch v := data["netAge"].(type) {
	case float64:
		netAge = int(v)
	case string:
		if parsed, err := strconv.Atoi(strings.TrimSpace(v)); err == nil {
			netAge = parsed
		}
	}
	return phone, province, netAge
}

func xingdongSkipReason(netAge int, slot string) string {
	if slot == "early" {
		if netAge < 0 {
			return "网龄未知，不能参加 09:30 提前场"
		}
		if netAge < 15 {
			return fmt.Sprintf("网龄 %d 年，未满 15 年，跳过 09:30 提前场", netAge)
		}
	}
	if slot == "normal" && netAge >= 15 {
		return fmt.Sprintf("网龄 %d 年，已归入 09:30 提前场，跳过 10:00 普通场", netAge)
	}
	return ""
}

func parseCookies(text string) []string {
	var res []string
	lines := strings.Split(text, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line != "" {
			res = append(res, line)
		}
	}
	return res
}

func parseAccounts(cfg Config) []Account {
	var accounts []Account
	for _, item := range cfg.Accounts {
		cookie := strings.TrimSpace(item.Cookie)
		if cookie == "" {
			continue
		}
		accounts = append(accounts, Account{
			Cookie:       cookie,
			ReceivePhone: strings.TrimSpace(item.ReceivePhone),
			Phone:        strings.TrimSpace(item.Phone),
			DisplayPhone: strings.TrimSpace(item.DisplayPhone),
		})
	}
	if len(accounts) > 0 {
		return accounts
	}
	for _, cookie := range parseCookies(cfg.CookiesText) {
		accounts = append(accounts, Account{Cookie: cookie})
	}
	return accounts
}

func now() string {
	return time.Now().Format("2006-01-02 15:04:05.000")
}
