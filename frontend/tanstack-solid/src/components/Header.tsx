import { ThemeToggle } from "~/components/ThemeToggle";

export function Header() {
	return (
		<header class="border-b border-border bg-background">
			<div class="container mx-auto flex h-14 items-center justify-between px-4">
				<h1 class="text-lg font-semibold">Hanoi Benchmark</h1>
				<div class="flex items-center justify-end">
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
