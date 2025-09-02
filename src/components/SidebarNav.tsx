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
import { Project, Block  } from "@/types/types";
import Image from "next/image";

type Props = {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;  // ✅ renamed
  selectedBlockId: string;
  onSelectBlock: (id: string) => void;
};

export default function SidebarNav({
    projects,
    selectedProjectId,
    onSelectProject,
    selectedBlockId,
    onSelectBlock,
}: Props) {
    const selectedProject = projects.find((p) => p.projectId === selectedProjectId)!;

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
                            value={selectedProjectId}
                            onValueChange={(id) => onSelectProject(id)}
                        >
                            <SelectTrigger className="w-full">
                                <Building2 className="mr-0 h-4 w-4 opacity-70" />
                                <SelectValue placeholder="Select Society" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((p:Project) => (
                                    <SelectItem key={p.projectId} value={p.projectId}>
                                        {p.name} ({Object.keys(p.blocks).length} Blocks)
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
                        {Object.values(selectedProject.blocks).map((b: Block) => (
                            <SidebarMenuItem  key={b.blockId}>
                                <SidebarMenuButton
                                    isActive={b.blockId === selectedBlockId}
                                    onClick={() => onSelectBlock(b.blockId)}
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
