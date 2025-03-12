import Link from "next/link";
import { Text } from "@/components/Text";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col space-y-4 text-center">
        <Text type="h1">Opps...</Text>
        <Text type="normal">Denne siden finnes ikke 🙈</Text>
        <div>
          <Button asChild variant={"outline"} className="mt-12">
            <Link href="/">Ta meg til forsiden igjen</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
