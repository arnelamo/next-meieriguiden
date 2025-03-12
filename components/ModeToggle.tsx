"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuSubButton } from "./ui/sidebar";

interface ModeToggleProps {
  size?: "normal" | "large";
}

export function ModeToggle({ size = "normal" }: ModeToggleProps) {
  const { setTheme } = useTheme();

  const sizeMap = {
    normal: "h-[0.8rem] w-[0.8rem]",
    large: "h-[1.6rem] w-[1.6rem]",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuSubButton className="cursor-pointer">
          <div className="flex w-full items-center justify-between">
            <span>Lysmodus</span>
            <div className="relative">
              <Sun
                className={`${sizeMap[size]} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`}
              />
              <Moon
                className={`absolute left-0 top-0 ${sizeMap[size]} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`}
              />
            </div>
            <span className="sr-only">Bytt lysmodus</span>
          </div>
        </SidebarMenuSubButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Lys</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Mørk</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
