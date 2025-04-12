"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

interface CustomSearchProps {
  search: string;
  setSearch: (search: string) => void;
  placeholder?: string;
}

export function CustomSearch({ search, setSearch, placeholder }: CustomSearchProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder || "Søk..."}
        value={search}
        onChange={handleSearchChange}
        className="pr-10"
      />
      <div className="absolute inset-y-0 right-0 flex items-center">
        {search && (
          <Button
            onClick={clearSearch}
            variant="ghost"
            className="h-full px-2 py-2 hover:bg-transparent"
          >
            <X className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        {!search && <Search className="mr-2 h-4 w-4 text-gray-500" />}
      </div>
    </div>
  );
}
