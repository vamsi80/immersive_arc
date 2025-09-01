"use client";

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Building2, Blocks } from "lucide-react";
import { Society } from "@/types/types";
import Image from "next/image";

type Props = {
    societies: Society[];
    selectedSocietyId: string;
    onSelectSociety: (id: string) => void;
    selectedBlockId: string;
    onSelectBlock: (id: string) => void;
};

export default function SidebarNav({
    societies,
    selectedSocietyId,
    onSelectSociety,
    selectedBlockId,
    onSelectBlock,
}: Props) {
    const selectedSociety = societies.find((s) => s.id === selectedSocietyId)!;

    return (
        <Sidebar collapsible="none" className="border-r h-screen overflow-hidden">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 pt-2">
                    <Image
                        src="/logo.svg"
                        alt="RealestateOS Logo"
                        width={130}
                        height={24}
                        className="rounded"
                    />
                </div>
            </SidebarHeader>
            <SidebarContent className="overflow-hidden">
                <SidebarGroup>
                    <SidebarGroupLabel>Societies</SidebarGroupLabel>
                    <div className="px-2">
                        <Select
                            value={selectedSocietyId}
                            onValueChange={(id) => onSelectSociety(id)}
                        >
                            <SelectTrigger className="w-full">
                                <Building2 className="mr-0 h-4 w-4 opacity-70" />
                                <SelectValue placeholder="Select Society" />
                            </SelectTrigger>
                            <SelectContent>
                                {societies.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name} ({s.blocks.length} Blocks)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </SidebarGroup>
                <SidebarSeparator /> 
                {/* Blocks */}
                <SidebarGroup>
                    <SidebarGroupLabel>Blocks</SidebarGroupLabel>
                    <SidebarMenu>
                        {selectedSociety.blocks.map((b) => (
                            <SidebarMenuItem key={b.id}>
                                <SidebarMenuButton
                                    isActive={b.id === selectedBlockId}
                                    onClick={() => onSelectBlock(b.id)}
                                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                                >
                                    <span className="flex items-center gap-2 overflow-hidden">
                                        <Blocks className="opacity-70" />
                                        {b.name}
                                    </span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
