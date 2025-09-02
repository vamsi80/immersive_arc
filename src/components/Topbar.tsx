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

type Props = {
    mode: BuildingMode;
    setMode: (mode: BuildingMode) => void;
    projectName: string;
    blockName: string;
};

export default function Topbar({ projectName, blockName }: Props) {
    const { theme, setTheme } = useTheme();
    return (
        <div className="h-14 border-b flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">Dashboard / {projectName}</div>
                <div className="h-5 w-px bg-border" />
                <div className="text-sm font-medium">{blockName}</div>
            </div>
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {/* Profile Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
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
