//! HTTP handlers for the Hanoi streaming API.

use axum::{
    extract::Query,
    http::{header, HeaderName, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
    Json,
};
use axum_streams::StreamBodyAs;
use serde::Deserialize;

use hanoi_bench::HanoiIterator;

const DEFAULT_N: u8 = 10;
const MIN_N: u8 = 1;
const MAX_N: u8 = 32;

#[derive(Debug, Deserialize)]
pub struct HanoiParams {
    /// Number of disks (1–32). Defaults to 10.
    pub n: Option<u8>,
}

#[derive(serde::Serialize)]
struct ErrorBody {
    error: String,
}

/// GET /hanoi?n=<n> — streams moves as JSON Lines (NDJSON).
pub async fn get_hanoi(Query(params): Query<HanoiParams>) -> Response {
    let n = params.n.unwrap_or(DEFAULT_N);
    if n < MIN_N || n > MAX_N {
        return (
            StatusCode::BAD_REQUEST,
            [(header::CONTENT_TYPE, "application/json")],
            Json(ErrorBody {
                error: format!("n must be between {} and {}", MIN_N, MAX_N),
            }),
        )
            .into_response();
    }
    let iter = HanoiIterator::new(n);
    let total_moves = iter.total_moves();
    let stream = tokio_stream::iter(iter);
    let body = StreamBodyAs::json_nl(stream);
    let total_moves_header = HeaderValue::try_from(total_moves.to_string()).unwrap_or_else(|_| HeaderValue::from_static("0"));
    (
        [
            (header::CONTENT_TYPE, HeaderValue::from_static("application/x-ndjson")),
            (HeaderName::from_static("x-total-moves"), total_moves_header),
        ],
        body,
    )
        .into_response()
}

/// GET /health — health check.
pub async fn get_health() -> &'static str {
    "ok"
}
