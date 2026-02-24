// Package hanoi implements the iterative Tower of Hanoi algorithm.
// Rods: 0=A, 1=B, 2=C.
// Formula (1-based move index i): from = (i&(i-1))%3, to = ((i|(i-1))+1)%3.
package hanoi

const (
	MinN = 1
	MaxN = 32
)

// Move is a single move: disk from one rod to another.
type Move struct {
	From uint8 `json:"from"` // source rod (0=A, 1=B, 2=C)
	To   uint8 `json:"to"`   // destination rod
}

// ClampN returns n clamped to [MinN, MaxN].
func ClampN(n int) int {
	if n < MinN {
		return MinN
	}
	if n > MaxN {
		return MaxN
	}
	return n
}

// TotalMoves returns the number of moves for n disks: 2^n - 1.
func TotalMoves(n int) uint64 {
	n = ClampN(n)
	return (1 << n) - 1
}

// MoveAt returns the move at 1-based index i (same formula as Rust).
func MoveAt(i uint64) Move {
	from := uint8((i & (i - 1)) % 3)
	to := uint8(((i | (i - 1)) + 1) % 3)
	return Move{From: from, To: to}
}

// AllMoves returns all moves for n disks. Used by tests; handler streams without collecting.
func AllMoves(n int) []Move {
	n = ClampN(n)
	total := TotalMoves(n)
	out := make([]Move, 0, total)
	for i := uint64(1); i <= total; i++ {
		out = append(out, MoveAt(i))
	}
	return out
}
