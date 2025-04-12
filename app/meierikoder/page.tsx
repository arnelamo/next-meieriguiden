import React from "react";
import { fetchDairyCodes } from "@/lib/fetchers/dairycodes";
import { DairyCode, UsesBovaerStatus } from "@/types/dairycode";
import Image from "next/image";
import { MeirikoderTable } from "@/components/meierikoder/MeierikoderTable";
import dairycodesData from "@/lib/dairy-code-management/data/dairycodes_unique.json";
import { Text } from "@/components/Text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

// Add IDs to the imported data for fallback
const fallbackData: DairyCode[] = dairycodesData.map((dairy, index) => ({
  id: index + 1,
  name: dairy.name,
  code: dairy.code,
  address: dairy.address,
  place: dairy.place,
  uses_bovaer: dairy.uses_bovaer as UsesBovaerStatus,
}));

export default async function Meierikoder() {
  // Try to fetch data, use fallback if it fails
  let dairyCodes: DairyCode[];
  try {
    dairyCodes = await fetchDairyCodes();
  } catch (error) {
    console.error("Failed to fetch dairy codes:", error);
    dairyCodes = fallbackData;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Text type="h3">Meierikoder</Text>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Info size={16} />
              <Text type="small">Hva er meierikoder?</Text>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="hidden">Slik bruker du tabellen</DialogTitle>
              <DialogDescription>Slik bruker du tabellen</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col space-y-2">
                <Text type="h4">Meierikoder</Text>
                <Text type="normal">
                  EFTA-nummer er påkrevd på alle meieriprodukter i butikk. Kodene gjør det mulig å
                  spore produkter ved eventuelle kontaminasjoner og tilbaketrekking. Dette gir også
                  forbrukere informasjon om melkens opprinnelse.
                </Text>
                <Text className="md:inline">
                  Denne oversikten er fra{" "}
                  <a
                    href="https://www.mattilsynet.no/godkjente-produkter-og-virksomheter/food-of-animal-origin-section-IX-raw-milk-and-dairy-products"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    mattilsynet sin nettside
                  </a>
                  . Markering på emballasjen skal se ut som vist her:
                </Text>
                <div className="relative col-span-1 h-[100px] w-full md:h-[100px]">
                  <Image
                    src="/Sporbarhetsmerking.jpg"
                    alt="EFTA markings"
                    fill={true}
                    style={{
                      objectFit: "contain",
                    }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <Text type="h4">Fargeforklaring</Text>
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="w-full">
                      <div className="border-l-[6px] border-l-green-500 bg-green-100 px-3 py-1.5 text-sm dark:border-l-green-400 dark:bg-green-900/40 dark:text-green-100">
                        Bruker ikke Bovaer
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="border-l-[6px] border-l-yellow-500 bg-yellow-100 px-3 py-1.5 text-sm dark:border-l-yellow-400 dark:bg-yellow-900/40 dark:text-yellow-100">
                        Vil snart bruke Bovaer
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="border-l-[6px] border-l-red-500 bg-red-100 px-3 py-1.5 text-sm dark:border-l-red-400 dark:bg-red-900/40 dark:text-red-100">
                        Bruker Bovaer
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="border-l-[6px] border-l-gray-400 bg-gray-50 px-3 py-1.5 text-sm dark:border-l-gray-500 dark:bg-gray-800/40 dark:text-gray-300">
                        Status ukjent
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4 sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Lukk
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <MeirikoderTable dairyCodes={dairyCodes} />
    </div>
  );
}
