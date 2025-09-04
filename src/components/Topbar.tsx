"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon, User } from "lucide-react";
import { BuildingMode } from "@/components/dashboard/canvas/BuildingCanvas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";

type Props = {
  mode: BuildingMode;
  setMode: (mode: BuildingMode) => void;
  projectName: string;
  blockName: string;
};

export default function Topbar({ projectName, blockName }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="
        sticky top-0 z-40
        h-14 border-b
        bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
        flex items-center justify-between
        px-2 sm:px-4
      "
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile sidebar trigger — NO asChild, NO children */}
        <SidebarTrigger
          className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-accent"
          aria-label="Open sidebar"
        />

        {/* Breadcrumb / title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-sm text-muted-foreground truncate">
            Dashboard / <span className="truncate">{projectName}</span>
          </div>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <div className="text-sm font-medium truncate max-w-[40vw] sm:max-w-none">
            {blockName}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open profile menu">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
