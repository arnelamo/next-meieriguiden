"use client";

import React, { useState } from "react";
import { DairyCode } from "@/types/dairycode";
import { Text } from "../Text";

export function SearchableTable({ dairyCodes }: { dairyCodes: DairyCode[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  console.log("dairyCodes", dairyCodes);
  const filteredDairyCodes = dairyCodes.filter((dairyCode) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      dairyCode.name.toLowerCase().includes(searchLower) ||
      dairyCode.code.toLowerCase().includes(searchLower) ||
      dairyCode.address.toLowerCase().includes(searchLower) ||
      dairyCode.place.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredDairyCodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredDairyCodes.slice(startIndex, endIndex);

  // Function to capitalize first letter of each word
  const titleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle page changes
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Søk i tabellen..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="w-full max-w-sm rounded-md border border-input bg-background px-4 py-2 shadow-sm transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />
      </div>

      {/* Table container with horizontal scroll */}
      <div className="shadow-base mb-14">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full table-fixed rounded-lg bg-card text-card-foreground">
            <colgroup>
              <col className="w-1" />
              <col className="w-[25%] lg:w-[15%]" />
              <col className="w-[75%] lg:w-[40%]" />
              <col className="hidden w-[20%] lg:table-column" />
              <col className="hidden w-[25%] lg:table-column" />
            </colgroup>
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="w-6 rounded-tl-lg"></th>
                <th className="px-4 py-3 text-left font-medium">
                  <Text type="normal">Kode</Text>
                </th>
                <th className="px-4 py-3 text-left font-medium">Navn</th>
                <th className="hidden px-4 py-3 text-left font-medium lg:table-cell">Sted</th>
                <th className="hidden rounded-tr-lg px-4 py-3 text-left font-medium lg:table-cell">
                  Adresse
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((dairyCode: DairyCode, index) => {
                // Determine row styling based on uses_bovaer status
                let rowClass = "";
                let indicatorClass = "";

                if (dairyCode.uses_bovaer === "no") {
                  rowClass = "bg-green-100 dark:bg-green-900/40";
                  indicatorClass = "bg-green-500 dark:bg-green-400";
                } else if (dairyCode.uses_bovaer === "yes") {
                  rowClass = "bg-red-100 dark:bg-red-900/40";
                  indicatorClass = "bg-red-500 dark:bg-red-400";
                } else if (dairyCode.uses_bovaer === "soon") {
                  rowClass = "bg-yellow-100 dark:bg-yellow-900/40";
                  indicatorClass = "bg-yellow-500 dark:bg-yellow-400";
                } else {
                  // For unknown status
                  rowClass = "bg-gray-50 dark:bg-gray-800/40";
                  indicatorClass = "bg-gray-400 dark:bg-gray-500";
                }

                // Add rounded corners to the last row
                const isLastRow = index === currentItems.length - 1;
                const lastRowClass = isLastRow ? "border-0" : "border-b border-border";
                const lastRowLeftCorner = isLastRow ? "rounded-bl-lg" : "";
                const lastRowRightCorner = isLastRow ? "rounded-br-lg" : "";

                return (
                  <tr
                    key={dairyCode.id}
                    className={`${lastRowClass} ${rowClass} transition duration-150`}
                  >
                    <td className={`${indicatorClass} w-6 ${lastRowLeftCorner}`}></td>
                    <td className="px-4 py-3">
                      <Text type="normal">{dairyCode.code}</Text>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <Text type="normal">{dairyCode.name}</Text>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <Text type="normal">{titleCase(dairyCode.place)}</Text>
                    </td>
                    <td className={`hidden px-4 py-3 lg:table-cell ${lastRowRightCorner}`}>
                      <Text type="normal">{dairyCode.address}</Text>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Fixed pagination controls */}
        {filteredDairyCodes.length > itemsPerPage && (
          <div className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-muted-foreground">
                Viser {startIndex + 1}-{Math.min(endIndex, filteredDairyCodes.length)} av{" "}
                {filteredDairyCodes.length} resultater
              </div>
              <div className="flex gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="min-w-[80px] rounded border border-border px-3 py-1 hover:text-foreground disabled:opacity-50"
                >
                  Forrige
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="min-w-[80px] rounded border border-border px-3 py-1 hover:text-foreground disabled:opacity-50"
                >
                  Neste
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
