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
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

type SortKey = "code" | "name" | "place" | "address";
type SortDirection = "asc" | "desc" | null;
type SortConfig = {
  key: SortKey | null;
  direction: SortDirection;
};

export function MeirikoderTable({ dairyCodes }: { dairyCodes: DairyCode[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [bovaerFilter, setBovaerFilter] = useState<UsesBovaerStatus | "all">("all");
  const [floating, setFloating] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "code",
    direction: "asc",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () => {
        setFloating(window.pageYOffset > 100);
      });
    }
  }, []);

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key ? (current.direction === "asc" ? "desc" : "asc") : "asc",
    }));
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={16} className="foreground/50 ml-2" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={16} className="ml-2 text-foreground/50" />
    ) : (
      <ArrowDown size={16} className="ml-2 text-foreground/50" />
    );
  };

  // Sort function to sort the data
  const sortData = (data: DairyCode[]) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof DairyCode];
      const bValue = b[sortConfig.key as keyof DairyCode];

      // Handle string comparison (all dairy code fields are strings)
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      return sortConfig.direction === "asc"
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  };

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

  const sortedDairyCodes = sortData(filteredDairyCodes);

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
    <div className="flex flex-col">
      <div
        className={`duration-400 z-10 py-4 transition-all ${
          floating
            ? "sticky top-4 rounded-md bg-background/60 px-2 backdrop-blur-md lg:mx-2"
            : "bg-background"
        }`}
      >
        <div className="flex space-x-4">
          <div className="grow">
            <CustomSearch search={searchTerm} setSearch={setSearchTerm} placeholder="Søk..." />
          </div>
          <Select
            value={bovaerFilter}
            onValueChange={(value: UsesBovaerStatus | "all") => setBovaerFilter(value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter på Bovaer" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="no">Ikke Bovaer</SelectItem>
                <SelectItem value="yes">Bruker Bovaer</SelectItem>
                <SelectItem value="soon">Snart Bovaer</SelectItem>
                <SelectItem value="unknown">Ukjent</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="border-b border-border">
                <TableHead
                  className="w-[15%] cursor-pointer px-2 py-3 text-left font-medium"
                  onClick={() => handleSort("code")}
                >
                  <div className="flex items-center">
                    <Text type="normal">Kode</Text>
                    <span className="inline-flex">{getSortIcon("code")}</span>
                  </div>
                </TableHead>
                <TableHead
                  className="w-[40%] cursor-pointer px-2 py-3 text-left font-medium"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    <Text type="normal">Navn</Text>
                    <span className="inline-flex">{getSortIcon("name")}</span>
                  </div>
                </TableHead>
                <TableHead
                  className="hidden w-[20%] cursor-pointer px-2 py-3 text-left font-medium lg:table-cell"
                  onClick={() => handleSort("place")}
                >
                  <div className="flex items-center">
                    <Text type="normal">Sted</Text>
                    <span className="inline-flex">{getSortIcon("place")}</span>
                  </div>
                </TableHead>
                <TableHead
                  className="hidden w-[25%] cursor-pointer rounded-tr-lg px-2 py-3 text-left font-medium lg:table-cell"
                  onClick={() => handleSort("address")}
                >
                  <div className="flex items-center">
                    <Text type="normal">Adresse</Text>
                    <span className="inline-flex">{getSortIcon("address")}</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDairyCodes.map((dairyCode) => {
                const { rowClass, indicatorClass } = getBovaerStyles(dairyCode.uses_bovaer);

                return (
                  <TableRow key={dairyCode.id} className={`${rowClass} transition duration-150`}>
                    <TableCell className={`px-3 py-2 ${indicatorClass}`}>
                      <Text type="normal">{dairyCode.code}</Text>
                    </TableCell>
                    <TableCell className="px-2 py-2 font-medium">
                      <Text type="normal">{dairyCode.name}</Text>
                    </TableCell>
                    <TableCell className="hidden px-2 py-2 lg:table-cell">
                      <Text type="normal">{titleCase(dairyCode.place)}</Text>
                    </TableCell>
                    <TableCell className="hidden px-2 py-2 lg:table-cell">
                      <Text type="normal">{dairyCode.address}</Text>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="px-4 py-2 text-sm">
                  {sortedDairyCodes.length} resultater
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}
