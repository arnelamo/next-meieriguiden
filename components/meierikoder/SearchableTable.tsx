"use client";

import React, { useState } from "react";
import { DairyCode } from "@/types/dairycode";

export function SearchableTable({ dairyCodes }: { dairyCodes: DairyCode[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    <>
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

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full table-fixed bg-card text-card-foreground">
          <colgroup>
            <col className="w-6" />
            <col className="w-[15%]" />
            <col className="w-[40%]" />
            <col className="w-[20%]" />
            <col className="w-[25%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="w-6"></th>
              <th className="px-4 py-3 text-left font-medium">Kode</th>
              <th className="px-4 py-3 text-left font-medium">Navn</th>
              <th className="px-4 py-3 text-left font-medium">Sted</th>
              <th className="px-4 py-3 text-left font-medium">Adresse</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((dairyCode: DairyCode) => {
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

              return (
                <tr
                  key={dairyCode.id}
                  className={`border-b border-border ${rowClass} transition duration-150`}
                >
                  <td className={`${indicatorClass} w-6`}></td>
                  <td className="px-4 py-3">{dairyCode.code}</td>
                  <td className="px-4 py-3 font-medium">{dairyCode.name}</td>
                  <td className="px-4 py-3">{titleCase(dairyCode.place)}</td>
                  <td className="px-4 py-3">{dairyCode.address}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredDairyCodes.length > itemsPerPage && (
          <div className="flex items-center justify-between bg-muted px-4 py-3 text-sm text-muted-foreground">
            <div>
              Viser {startIndex + 1}-{Math.min(endIndex, filteredDairyCodes.length)} av{" "}
              {filteredDairyCodes.length} resultater
            </div>
            <div className="flex gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="rounded border border-border px-3 py-1 disabled:opacity-50"
              >
                Forrige
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="rounded border border-border px-3 py-1 disabled:opacity-50"
              >
                Neste
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
