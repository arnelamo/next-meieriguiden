import { DairyCode } from "@/types/dairycode";

export async function fetchDairyCodes(): Promise<DairyCode[]> {
  const response = await fetch("https://api.meieriguiden.no/meierikoder/", {
    next: {
      revalidate: 3600, // 1 hour
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dairy codes: ${response.statusText}`);
  }

  return response.json();
}
