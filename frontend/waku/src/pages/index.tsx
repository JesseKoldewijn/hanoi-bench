import { HanoiPageClient } from "@/components/hanoi-page-client";

export default async function HomePage() {
  return <HanoiPageClient />;
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
