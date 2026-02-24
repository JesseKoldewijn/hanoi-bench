//! Tower of Hanoi iterative algorithm and move type.
//! Rods: 0 = A, 1 = B, 2 = C.

use serde::Serialize;

/// A single move: disk from one rod to another.
#[derive(Debug, Clone, Copy, Serialize)]
pub struct Move {
    /// Source rod (0=A, 1=B, 2=C).
    pub from: u8,
    /// Destination rod (0=A, 1=B, 2=C).
    pub to: u8,
}

/// Iterative Tower of Hanoi iterator. O(1) memory, O(1) per move.
/// Formula for 1-based move index i: from = (i & (i-1)) % 3, to = ((i | (i-1)) + 1) % 3.
#[derive(Debug, Clone)]
pub struct HanoiIterator {
    n: u8,
    total_moves: u64,
    current: u64,
}

impl HanoiIterator {
    /// Creates a new iterator for `n` disks. `n` must be in 1..=32.
    pub fn new(n: u8) -> Self {
        let n = n.clamp(1, 32);
        let total_moves = (1u64 << n) - 1;
        Self {
            n,
            total_moves,
            current: 1,
        }
    }

    /// Total number of moves (2^n - 1).
    pub fn total_moves(&self) -> u64 {
        self.total_moves
    }

    /// Number of disks.
    pub fn n(&self) -> u8 {
        self.n
    }
}

impl Iterator for HanoiIterator {
    type Item = Move;

    fn next(&mut self) -> Option<Self::Item> {
        if self.current > self.total_moves {
            return None;
        }
        let i = self.current;
        // Iterative formula: 1-based move index i
        let from = ((i & (i - 1)) % 3) as u8;
        let to = (((i | (i - 1)) + 1) % 3) as u8;
        self.current += 1;
        Some(Move { from, to })
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        let remaining = (self.total_moves + 1).saturating_sub(self.current) as usize;
        (remaining, Some(remaining))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn n1_one_move() {
        let moves: Vec<_> = HanoiIterator::new(1).collect();
        assert_eq!(moves.len(), 1);
        assert_eq!(moves[0].from, 0);
        assert_eq!(moves[0].to, 2); // A -> C
    }

    #[test]
    fn n2_three_moves() {
        let moves: Vec<_> = HanoiIterator::new(2).collect();
        assert_eq!(moves.len(), 3);
        assert_eq!(moves[0].from, 0);
        assert_eq!(moves[0].to, 2);
        assert_eq!(moves[1].from, 0);
        assert_eq!(moves[1].to, 1);
        assert_eq!(moves[2].from, 2);
        assert_eq!(moves[2].to, 1);
    }

    #[test]
    fn n3_seven_moves_final_to_rod_two() {
        let moves: Vec<_> = HanoiIterator::new(3).collect();
        assert_eq!(moves.len(), 7);
        // Last move places largest disk on rod 2 (C)
        assert_eq!(moves[6].from, 0);
        assert_eq!(moves[6].to, 2);
    }

    #[test]
    fn total_moves_matches_count() {
        for n in 1..=10 {
            let it = HanoiIterator::new(n);
            let expected = (1u64 << n) - 1;
            assert_eq!(it.total_moves(), expected);
            assert_eq!(HanoiIterator::new(n).count(), expected as usize);
        }
    }

    #[test]
    fn n_clamped_to_32() {
        let it = HanoiIterator::new(100);
        assert_eq!(it.n(), 32);
        assert_eq!(it.total_moves(), (1u64 << 32) - 1);
    }
}
