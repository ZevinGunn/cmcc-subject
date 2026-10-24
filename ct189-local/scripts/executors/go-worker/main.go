package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	body, err := io.ReadAll(os.Stdin)
	if err != nil {
		panic(err)
	}
	var payload map[string]any
	if err := json.Unmarshal(body, &payload); err != nil {
		panic(err)
	}
	callback, ok := payload["callbackUrl"].(string)
	if !ok || callback == "" {
		panic("missing callbackUrl")
	}
	request, err := http.NewRequest(http.MethodPost, callback, bytes.NewReader(body))
	if err != nil {
		panic(err)
	}
	request.Header.Set("Content-Type", "application/json")
	response, err := http.DefaultClient.Do(request)
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()
	result, err := io.ReadAll(response.Body)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(result))
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		os.Exit(1)
	}
}
