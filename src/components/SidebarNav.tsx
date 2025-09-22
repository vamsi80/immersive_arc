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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Blocks,
  PanelRightOpen,
  PanelLeftClose,
  Plus,
} from "lucide-react";
import { Project, Block } from "@/types/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // if you have a cn helper; otherwise remove cn() usage

type Props = {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  selectedBlockId: string;
  onSelectBlock: (id: string) => void;
  onAddProject?: () => void;
  onAddBlock?: (projectId: string) => void;
};

export default function SidebarNav({
  projects,
  selectedProjectId,
  onSelectProject,
  selectedBlockId,
  onSelectBlock,
  onAddProject,
  onAddBlock,
}: Props) {
  const selectedProject = projects.find((p) => p.projectId === selectedProjectId)!;

  return (
    <>
      {/* Full sidebar (overlay on mobile, inline on desktop) */}
      <Sidebar
        collapsible="icon"
        className="
          group/sidebar
          border-r
          md:h-screen
          h-[calc(100dvh-56px)]
          overflow-hidden
        "
      >
        <SidebarHeader className="shrink-0 px-2 pt-2">
          <div className="flex items-center justify-between">
            <Image
              src="/logo.svg"
              alt="RealestateOS Logo"
              width={130}
              height={24}
              className="
                rounded
                group-data-[collapsible=icon]/sidebar:w-7 group-data-[collapsible=icon]/sidebar:h-7
                group-data-[collapsible=icon]/sidebar:object-contain
              "
            />
            <InlineToggle />
          </div>
        </SidebarHeader>

        <SidebarContent className="overflow-auto">
          <SidebarGroup>
            <div className="flex items-center justify-between px-2">
              <SidebarGroupLabel className="group-data-[collapsible=icon]/sidebar:sr-only">
                Societies
              </SidebarGroupLabel>
              {onAddProject && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={onAddProject}
                  aria-label="Add society"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="px-2">
              <Select value={selectedProjectId} onValueChange={(id) => onSelectProject(id)}>
                <SelectTrigger className="w-full">
                  <Building2 className="mr-0 h-4 w-4 opacity-70" />
                  <span className="ml-2 truncate group-data-[collapsible=icon]/sidebar:hidden">
                    <SelectValue placeholder="Select Society" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p: Project) => (
                    <SelectItem key={p.projectId} value={p.projectId}>
                      {p.name} ({Object.keys(p.blocks).length} Blocks)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <div className="flex items-center justify-between px-2">
              <SidebarGroupLabel className="group-data-[collapsible=icon]/sidebar:sr-only">
                Blocks
              </SidebarGroupLabel>
              {onAddBlock && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => onAddBlock(selectedProjectId)}
                  aria-label="Add block"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            {Object.keys(selectedProject.blocks).length === 0 ? (
              <div className="p-4">
                <div className="mx-auto flex flex-col items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddBlock?.(selectedProjectId)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add block
                  </Button>
                  <div className="text-sm text-muted-foreground">No blocks yet in this society</div>
                </div>
              </div>
            ) : (
              <SidebarMenu>
                {Object.values(selectedProject.blocks).map((b: Block) => (
                  <SidebarMenuItem key={b.blockId}>
                    <SidebarMenuButton
                      isActive={b.blockId === selectedBlockId}
                      onClick={() => onSelectBlock(b.blockId)}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      aria-label={b.name}
                    >
                      <Blocks className="opacity-70 shrink-0" />
                      <span className="truncate group-data-[collapsible=icon]/sidebar:hidden">
                        {b.name}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* 📱 Mobile icon rail: shows only when the sidebar is closed/collapsed on small screens */}
      <MobileIconRail
        projects={projects}
        selectedProjectId={selectedProjectId}
        selectedBlockId={selectedBlockId}
        onSelectProject={onSelectProject}
        onSelectBlock={onSelectBlock}
      />
    </>
  );
}

/* --- Small components/helpers --- */

function InlineToggle() {
  const { toggleSidebar, state } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={toggleSidebar}
      aria-label={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
    >
      {state === "collapsed" ? (
        <PanelRightOpen className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </Button>
  );
}

/**
 * MobileIconRail
 * - Visible only on small screens (md:hidden)
 * - Hidden when the full sidebar is in "expanded" or "mobile-open" state
 * - Shows a vertical strip of icons + an Expand button at bottom
 */
function MobileIconRail({
  projects,
  selectedProjectId,
  selectedBlockId,
  onSelectBlock,
}: {
  projects: Project[];
  selectedProjectId: string;
  selectedBlockId: string;
  onSelectProject: (id: string) => void; // (not used here but kept for parity)
  onSelectBlock: (id: string) => void;
}) {
  const { toggleSidebar, state } = useSidebar();
  const selectedProject = projects.find((p) => p.projectId === selectedProjectId);
  const blocks = selectedProject ? Object.values(selectedProject.blocks) : [];

  // Show the rail only on small screens when the sidebar isn't open in overlay
  const showRail = state === "collapsed"; // if your lib exposes a different flag for "closed on mobile", adapt here

  return (
    <div
      className={cn(
        "md:hidden fixed left-0 top-14 z-40", // top matches your 56px topbar
        "h-[calc(100dvh-56px)] w-12",
        "bg-background border-r",
        "flex flex-col items-center justify-between py-2",
        showRail ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!showRail}
    >
      {/* Icons list (scrollable if many) */}
      <div className="flex-1 overflow-auto w-full">
        <div className="flex flex-col items-center gap-2 py-1">
          {/* Society icon (purely visual cue here) */}
          <div className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-accent">
            <Building2 className="h-5 w-5 opacity-80" />
          </div>

          {/* Block icons */}
          {blocks.map((b) => {
            const active = b.blockId === selectedBlockId;
            return (
              <button
                key={b.blockId}
                onClick={() => onSelectBlock(b.blockId)}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-md",
                  "hover:bg-accent transition-colors",
                  active && "bg-primary/10 ring-1 ring-primary/40"
                )}
                title={b.name}
                aria-label={b.name}
              >
                <Blocks className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Expand button */}
      <div className="p-1">
        <Button
          size="icon"
          variant="default"
          className="h-10 w-10 rounded-full shadow-md"
          onClick={toggleSidebar}
          aria-label="Open menu"
          title="Open menu"
        >
          <PanelRightOpen className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
