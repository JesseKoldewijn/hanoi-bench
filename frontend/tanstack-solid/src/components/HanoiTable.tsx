import { createEffect, createSignal, onCleanup } from "solid-js";
import { type Move, streamHanoiMoves } from "~/lib/api";

const ROD_LABELS: Record<number, string> = { 0: "A", 1: "B", 2: "C" };

type HanoiTableProps = { n: number; backend: "rust" | "go" };

export function HanoiTable(props: HanoiTableProps) {
	const [moves, setMoves] = createSignal<Move[]>([]);
	const [totalMoves, setTotalMoves] = createSignal<number | null>(null);
	const [error, setError] = createSignal<string | null>(null);
	const [loading, setLoading] = createSignal(true);

	createEffect(() => {
		const n = props.n;
		const backend = props.backend;
		setLoading(true);
		setError(null);
		setMoves([]);
		setTotalMoves(null);
		const controller = new AbortController();
		streamHanoiMoves(n, backend, controller.signal).then((res) => {
			setMoves(res.moves);
			setTotalMoves(res.totalMoves);
			setError(res.error);
			setLoading(false);
		});
		onCleanup(() => controller.abort());
	});

	return (
		<>
			{loading() && moves().length === 0 && (
				<p class="text-muted-foreground">Loading moves...</p>
			)}
			{error() && (
				<p class="text-red-600 dark:text-red-400">Error: {error()}</p>
			)}
			{!loading() && !error() && (
				<div class="space-y-4">
					<p class="text-sm text-muted-foreground">
						Total moves: {totalMoves() ?? moves().length} (2^
						{props.n} - 1 = {Math.pow(2, props.n) - 1})
					</p>
					<div class="overflow-hidden rounded-md border border-border">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b border-border bg-muted">
									<th class="p-3 text-left font-medium">
										Step
									</th>
									<th class="p-3 text-left font-medium">
										From
									</th>
									<th class="p-3 text-left font-medium">
										To
									</th>
								</tr>
							</thead>
							<tbody>
								{moves().map((move, i) => (
									<tr class="border-b border-border last:border-0">
										<td class="p-3">{i + 1}</td>
										<td class="p-3">
											{ROD_LABELS[move.from] ?? move.from}
										</td>
										<td class="p-3">
											{ROD_LABELS[move.to] ?? move.to}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</>
	);
}
