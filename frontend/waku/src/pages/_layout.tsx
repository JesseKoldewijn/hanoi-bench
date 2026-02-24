import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-6">{children}</main>
      </div>
    </ThemeProvider>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
