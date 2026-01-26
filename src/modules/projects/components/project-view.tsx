"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import ProjectHeader from "@/modules/home/components/project-header";
import MessageContainer from "@/modules/home/components/message-container";
import type { Fragment } from "@/generated/prisma/client";
import { Code, CrownIcon, EyeIcon } from "lucide-react";
import FragmentWeb from "@/modules/home/components/fragement-web";
import FileExplorer from "@/modules/home/components/file-explorer";

const ProjectView = ({ projectId }: { projectId: string }) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState("preview");
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ProjectHeader projectId={projectId} />

          <MessageContainer
            projectId={projectId}
            activeFragment={activeFragment}
            setActiveFragment={setActiveFragment}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className={"h-full flex flex-col"}
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value)}
          >
            <div className="flex items-center w-full p-2 border-b gap-x-2">
              <TabsList className={"h-8 p-0 border rounded-md"}>
                <TabsTrigger
                  value="preview"
                  className={"rounded-md px-3 flex items-center gap-x-2"}
                >
                  <EyeIcon className="size-4" />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className={"rounded-md px-3 flex items-center gap-x-2"}
                >
                  <Code className="size-4" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Button asChild size={"sm"}>
                  <Link href={"/pricing"}>
                    <CrownIcon className="size-4 mr-2" />
                    Upgrade
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent
              className={"flex-1 overflow-hidden h-[calc(100%-4rem)]"}
              value="preview"
            >
              {activeFragment ? (
                <>
                  <FragmentWeb data={activeFragment} />
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a message to preview
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="code"
              className={"flex-1 h-[calc(100%-4rem)] overflow-hidden"}
            >
              {activeFragment &&
              typeof activeFragment.files === "object" &&
              activeFragment.files !== null &&
              !Array.isArray(activeFragment.files) ? (
                <FileExplorer files={activeFragment.files as Record<string, string>} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a fragment to view code
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
