import { BentoGridDemo } from "@/components/BentoDemo";
import { CardGrid, CardGridItem } from "@/components/ui/card-grid";
import { fetchDairies } from "@/lib/fetchers/dairies";

export default async function Home() {
  const dairies = await fetchDairies();
  console.log({ dairies });
  return (
    <div>
      <CardGrid>
        {dairies.map((item, i) => (
          <CardGridItem key={i} dairy={item} />
        ))}
      </CardGrid>
      <div className="mt-10">
        <BentoGridDemo />
      </div>
    </div>
  );
}
