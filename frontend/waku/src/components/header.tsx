import { ThemeToggle } from "@/components/theme-toggle";

export const Header = () => {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-semibold">Hanoi Benchmark</h1>
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
