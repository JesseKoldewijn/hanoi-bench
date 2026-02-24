package main

import (
	"log"
	"net/http"
	"os"
)

const defaultPort = "6002"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/hanoi", handleHanoi)
	mux.HandleFunc("/health", handleHealth)

	addr := ":" + port
	log.Printf("listening on http://%s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}
