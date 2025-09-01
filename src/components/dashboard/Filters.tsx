"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";
import { Availability, BHK, Block } from "@/types/types";

type Props = {
    query: string;
    setQuery: (v: string) => void;
    filterBhk: BHK | "All";
    setFilterBhk: (v: BHK | "All") => void;
    filterFloor: number | "All";
    setFilterFloor: (v: number | "All") => void;
    filterAvail: Availability | "All";
    setFilterAvail: (v: Availability | "All") => void;
    reset: () => void;
    selectedBlock: Block;
};

export default function Filters({
    query,
    setQuery,
    filterBhk,
    setFilterBhk,
    filterFloor,
    setFilterFloor,
    filterAvail,
    setFilterAvail,
    reset,
    selectedBlock,
}: Props) {
    return (
        <Card className="p-4 shadow-subtle">
            <div className="grid grid-cols-6 gap-3 items-end">
                {/* Search */}
                <div className="col-span-6 flex items-center gap-2">
                    <Search className="text-muted-foreground" />
                    <Input
                        placeholder="Search unit number"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={reset}
                        title="Reset Filters"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>

                {/* BHK */}
                <div className="col-span-2">
                    <Label className="text-xs mb-1">BHK</Label>
                    <Select value={filterBhk} onValueChange={(v) => setFilterBhk(v as any)}>
                        <SelectTrigger className="h-9  w-full">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="1BHK">1BHK</SelectItem>
                            <SelectItem value="2BHK">2BHK</SelectItem>
                            <SelectItem value="3BHK">3BHK</SelectItem>
                            <SelectItem value="4BHK">4BHK</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Floor */}
                <div className="col-span-2">
                    <Label className="text-xs mb-1 ">Floor</Label>
                    <Select
                        value={String(filterFloor)}
                        onValueChange={(v) => setFilterFloor(v === "All" ? "All" : Number(v))}
                    >
                        <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            {Array.from({ length: selectedBlock.floors }).map((_, i) => (
                                <SelectItem key={i} value={String(i + 1)}>
                                    {i + 1}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Availability */}
                <div className="col-span-2">
                    <Label className="text-xs mb-1">Availability</Label>
                    <Select value={filterAvail} onValueChange={(v) => setFilterAvail(v as any)}>
                        <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Booked">Booked</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Card>
    );
}
