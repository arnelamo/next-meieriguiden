import React from "react";
import { fetchDairyCodes } from "@/lib/fetchers/dairycodes";
import { DairyCode } from "@/types/dairycode";
import Image from "next/image";
import { SearchableTable } from "@/components/meierikoder/SearchableTable";

// Sample data to use as fallback when API fails
const fallbackData: DairyCode[] = [
  {
    id: 1,
    name: "EGGEN GARDSYSTERI AS",
    code: "M517",
    address: "(Ikke oppgitt)",
    place: "VINGELEN",
    uses_bovaer: "no",
  },
  {
    id: 2,
    name: "EINAR LIE",
    code: "2918",
    address: "Liavegen 9",
    place: "AURLAND",
    uses_bovaer: "unknown",
  },
  {
    id: 3,
    name: "SYNNØVE FINDEN AS AVD ALVDAL",
    code: "M904",
    address: "Grindegga",
    place: "ALVDAL",
    uses_bovaer: "yes",
  },
  {
    id: 4,
    name: "TINE SA AVD HARSTAD",
    code: "M350",
    address: "Skogveien 18",
    place: "HARSTAD",
    uses_bovaer: "soon",
  },
];

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
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Text content - takes 2/3 of the space on desktop */}
        <div className="md:col-span-2">
          <p className="mb-4 text-lg leading-relaxed text-foreground">
            <b>Alle meieriprodukter som selges i butikk skal være markert med en meierikode.</b> I
            tilfellet det viser seg i etterkant at et meieri har blitt kontaminert, kan dette være
            nyttig for å trekke tilbake produkter. Det gjør det også lettere for forbrukere å vite
            hvor melken deres kommer fra.
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            Denne oversikten er fra{" "}
            <a
              href="https://www.mattilsynet.no/godkjente-produkter-og-virksomheter/food-of-animal-origin-section-IX-raw-milk-and-dairy-products"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              mattilsynet sin nettside
            </a>
            . Markering på emballasjen skal se ut som vist{" "}
            <span className="hidden md:inline">til høyre</span>
            <span className="md:hidden">under</span>.
          </p>
        </div>

        {/* Image - takes 1/3 of the space on desktop */}
        <div className="flex items-center justify-center">
          <Image
            src="/Sporbarhetsmerking.jpg"
            alt="EFTA markings"
            width={200}
            height={100}
            className="rounded-md shadow-md dark:border dark:border-muted"
          />
        </div>
      </div>

      {/* Color legend - horizontal row */}
      <div className="mb-6">
        <p className="mb-3 text-lg font-medium text-foreground">
          Tabellradene er farget for å indikere bruk av Bovaer:
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="border-l-[6px] border-l-green-500 bg-green-100 px-3 py-1.5 text-sm dark:border-l-green-400 dark:bg-green-900/40 dark:text-green-100">
              Grønt: Bruker ikke Bovaer
            </div>
          </div>

          <div className="flex items-center">
            <div className="border-l-[6px] border-l-yellow-500 bg-yellow-100 px-3 py-1.5 text-sm dark:border-l-yellow-400 dark:bg-yellow-900/40 dark:text-yellow-100">
              Gult: Vil snart bruke Bovaer
            </div>
          </div>

          <div className="flex items-center">
            <div className="border-l-[6px] border-l-red-500 bg-red-100 px-3 py-1.5 text-sm dark:border-l-red-400 dark:bg-red-900/40 dark:text-red-100">
              Rødt: Bruker Bovaer
            </div>
          </div>

          <div className="flex items-center">
            <div className="border-l-[6px] border-l-gray-400 bg-gray-50 px-3 py-1.5 text-sm dark:border-l-gray-500 dark:bg-gray-800/40 dark:text-gray-300">
              Grått: Status ukjent
            </div>
          </div>
        </div>
      </div>

      {/* Search and table */}
      <SearchableTable dairyCodes={dairyCodes} />
    </div>
  );
}
