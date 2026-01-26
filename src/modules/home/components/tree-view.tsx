import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";

type TreeItem = string | [string, ...TreeItem[]];

interface TreeViewProps {
  data: TreeItem[];
  value: string | null;
  onSelect: (path: string) => void;
}

export const TreeView = ({ data, value, onSelect }: TreeViewProps) => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="w-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((item, index) => (
                  <Tree
                    key={index}
                    item={item}
                    selectedValue={value}
                    onSelect={onSelect}
                    parentPath=""
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};

interface TreeProps {
  item: TreeItem;
  selectedValue: string | null;
  onSelect: (path: string) => void;
  parentPath: string;
}

const Tree = ({ item, selectedValue, onSelect, parentPath }: TreeProps) => {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  if (!items.length) {
    const isSelected = selectedValue === currentPath;

    return (
      <SidebarMenuButton
        isActive={isSelected}
        className="data-[active=true]:bg-transparent"
        onClick={() => onSelect?.(currentPath)}
      >
        <FileIcon />
        <span className="truncate">{name}</span>
      </SidebarMenuButton>
    );
  }

  // It's a folder
  const [open, setOpen] = useState(true);

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        open={open}
        onOpenChange={setOpen}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRightIcon className="transition-transform" />
            <FolderIcon />
            <span className="truncate">{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {open && (
          <SidebarMenuSub>
            {items.map((item, index) => (
              <Tree
                key={index}
                item={item}
                selectedValue={selectedValue}
                onSelect={onSelect}
                parentPath={currentPath}
              />
            ))}
          </SidebarMenuSub>
        )}
      </Collapsible>
    </SidebarMenuItem>
  );
};