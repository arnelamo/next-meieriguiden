import { Dairy } from "@/types/diary";

export async function fetchDairies(): Promise<Dairy[]> {
  const response = await fetch("https://api.meieriguiden.no/meierier/", {
    next: {
      revalidate: 3600, // 1 hour
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dairies: ${response.statusText}`);
  }

  return response.json();
}
