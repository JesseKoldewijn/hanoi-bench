package hanoi

import (
	"testing"
)

func TestN1OneMove(t *testing.T) {
	moves := AllMoves(1)
	if len(moves) != 1 {
		t.Fatalf("len(moves) = %d, want 1", len(moves))
	}
	if moves[0].From != 0 || moves[0].To != 2 {
		t.Errorf("moves[0] = (%d,%d), want (0,2)", moves[0].From, moves[0].To)
	}
}

func TestN2ThreeMoves(t *testing.T) {
	moves := AllMoves(2)
	if len(moves) != 3 {
		t.Fatalf("len(moves) = %d, want 3", len(moves))
	}
	if moves[0].From != 0 || moves[0].To != 2 {
		t.Errorf("moves[0] = (%d,%d), want (0,2)", moves[0].From, moves[0].To)
	}
	if moves[1].From != 0 || moves[1].To != 1 {
		t.Errorf("moves[1] = (%d,%d), want (0,1)", moves[1].From, moves[1].To)
	}
	if moves[2].From != 2 || moves[2].To != 1 {
		t.Errorf("moves[2] = (%d,%d), want (2,1)", moves[2].From, moves[2].To)
	}
}

func TestN3SevenMovesFinalToRodTwo(t *testing.T) {
	moves := AllMoves(3)
	if len(moves) != 7 {
		t.Fatalf("len(moves) = %d, want 7", len(moves))
	}
	if moves[6].From != 0 || moves[6].To != 2 {
		t.Errorf("moves[6] = (%d,%d), want (0,2)", moves[6].From, moves[6].To)
	}
}

func TestTotalMovesMatchesCount(t *testing.T) {
	for n := 1; n <= 10; n++ {
		expected := TotalMoves(n)
		moves := AllMoves(n)
		if uint64(len(moves)) != expected {
			t.Errorf("n=%d: len(moves)=%d, TotalMoves=%d", n, len(moves), expected)
		}
		expectedDirect := (uint64(1) << n) - 1
		if expected != expectedDirect {
			t.Errorf("n=%d: TotalMoves=%d, want %d", n, expected, expectedDirect)
		}
	}
}

func TestNClampedTo32(t *testing.T) {
	// n=100 is clamped to 32; TotalMoves should be 2^32 - 1
	if c := ClampN(100); c != 32 {
		t.Errorf("ClampN(100)=%d, want 32", c)
	}
	expectedTotal := (uint64(1) << 32) - 1
	if TotalMoves(100) != expectedTotal {
		t.Errorf("TotalMoves(100)=%d, want %d", TotalMoves(100), expectedTotal)
	}
}
