package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"hanoi-bench/backend/go/hanoi"
)

const defaultN = 10

type errorBody struct {
	Error string `json:"error"`
}

func handleHanoi(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	n := defaultN
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if s := r.URL.Query().Get("n"); s != "" {
		parsed, err := strconv.Atoi(s)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(errorBody{Error: "n must be between 1 and 32"})
			return
		}
		n = parsed
	}
	if n < hanoi.MinN || n > hanoi.MaxN {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(errorBody{Error: "n must be between 1 and 32"})
		return
	}
	n = hanoi.ClampN(n)
	totalMoves := hanoi.TotalMoves(n)

	w.Header().Set("Content-Type", "application/x-ndjson")
	w.Header().Set("X-Total-Moves", strconv.FormatUint(totalMoves, 10))
	w.WriteHeader(http.StatusOK)

	flusher, ok := w.(http.Flusher)
	if !ok {
		flusher = nil
	}

	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	for i := uint64(1); i <= totalMoves; i++ {
		move := hanoi.MoveAt(i)
		if err := enc.Encode(move); err != nil {
			return
		}
		if flusher != nil {
			flusher.Flush()
		}
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok"))
}
