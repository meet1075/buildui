import ProjectView from "@/modules/projects/components/project-view";
import React from "react";

const Page = async ({ params}:{params:{projectId:string}}) => {
  const { projectId } = await params;

  return (
    <ProjectView projectId={projectId} />
  );
};

export default Page;