"use client";

import { useState, useEffect } from "react";
import { DairyCode, UsesBovaerStatus } from "@/types/dairycode";
import { Text } from "../Text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CustomSearch } from "../CustomSearch";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

export function MeirikoderTable({ dairyCodes }: { dairyCodes: DairyCode[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [bovaerFilter, setBovaerFilter] = useState<UsesBovaerStatus | "all">("all");
  const [floating, setFloating] = useState(false);
  const { isMobile } = useSidebar();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () => {
        setFloating(window.pageYOffset > 100);
      });
    }
  }, []);
  console.log(isMobile);
  const filteredDairyCodes = dairyCodes.filter((dairyCode) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      dairyCode.name.toLowerCase().includes(searchLower) ||
      dairyCode.code.toLowerCase().includes(searchLower) ||
      dairyCode.address.toLowerCase().includes(searchLower) ||
      dairyCode.place.toLowerCase().includes(searchLower);

    const matchesBovaerFilter = bovaerFilter === "all" || dairyCode.uses_bovaer === bovaerFilter;

    return matchesSearch && matchesBovaerFilter;
  });

  // Function to capitalize first letter of each word
  const titleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get styles based on bovaer status
  const getBovaerStyles = (usesBovaer: UsesBovaerStatus) => {
    switch (usesBovaer) {
      case "no":
        return {
          rowClass: "bg-green-100 dark:bg-green-900/40",
          indicatorClass: "border-l border-green-500 dark:border-green-400",
        };
      case "yes":
        return {
          rowClass: "bg-red-100 dark:bg-red-900/40",
          indicatorClass: "border-l border-red-500 dark:border-red-400",
        };
      case "soon":
        return {
          rowClass: "bg-yellow-100 dark:bg-yellow-900/40",
          indicatorClass: "border-l border-yellow-500 dark:border-yellow-400",
        };
      default:
        return {
          rowClass: "bg-gray-50 dark:bg-gray-800/40",
          indicatorClass: "border-l border-gray-400 dark:border-gray-500",
        };
    }
  };

  return (
    <div className="">
      <div className="flex flex-col">
        <div
          className={`duration-400 z-10 py-4 transition-all ${
            floating
              ? "sticky top-4 rounded-xl bg-background/60 px-4 backdrop-blur-md lg:mx-2"
              : "bg-background"
          }`}
        >
          <div className="flex space-x-4">
            <CustomSearch
              search={searchTerm}
              setSearch={setSearchTerm}
              placeholder="Søk på kode, navn, sted eller adresse"
            />
            <Select
              value={bovaerFilter}
              onValueChange={(value: UsesBovaerStatus | "all") => setBovaerFilter(value)}
            >
              <SelectTrigger className="w-full max-w-[200px]">
                <SelectValue placeholder="Filter på Bovaer" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="no">Bruker ikke Bovaer</SelectItem>
                  <SelectItem value="yes">Bruker Bovaer</SelectItem>
                  <SelectItem value="soon">Bruker snart Bovaer</SelectItem>
                  <SelectItem value="unknown">Ukjent status</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant={isMobile ? "secondary" : "secondary"}>
              <Trash2 />
              {!isMobile && <Text type="small">Nullstill</Text>}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow className="border-b border-border">
                  <TableHead className="w-[15%] px-4 py-3 text-left font-medium">
                    <Text type="normal">Kode</Text>
                  </TableHead>
                  <TableHead className="w-[40%] px-4 py-3 text-left font-medium">
                    <Text type="normal">Navn</Text>
                  </TableHead>
                  <TableHead className="hidden w-[20%] px-4 py-3 text-left font-medium lg:table-cell">
                    <Text type="normal">Sted</Text>
                  </TableHead>
                  <TableHead className="hidden w-[25%] rounded-tr-lg px-4 py-3 text-left font-medium lg:table-cell">
                    <Text type="normal">Adresse</Text>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDairyCodes.map((dairyCode) => {
                  const { rowClass, indicatorClass } = getBovaerStyles(dairyCode.uses_bovaer);

                  return (
                    <TableRow key={dairyCode.id} className={`${rowClass} transition duration-150`}>
                      <TableCell className={`px-4 py-3 ${indicatorClass}`}>
                        <Text type="normal">{dairyCode.code}</Text>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium">
                        <Text type="normal">{dairyCode.name}</Text>
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 lg:table-cell">
                        <Text type="normal">{titleCase(dairyCode.place)}</Text>
                      </TableCell>
                      <TableCell className="hidden px-4 py-3 lg:table-cell">
                        <Text type="normal">{dairyCode.address}</Text>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="px-4 py-2 text-sm">
                    {filteredDairyCodes.length} resultater
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
