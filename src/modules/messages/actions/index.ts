"use server";
import { MessageRole, MessageType } from "@/generated/prisma/enums";
import db from "@/lib/db";
import { inngest } from "@/inngest/client";
import { getCurrentUser } from "@/modules/auth/actions";

export const createMessage = async (Value: string, projectId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  const project = await db.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
    },
  });
  if (!project) throw new Error("Project not found");
  const newMessage = await db.message.create({
    data: {
      projectId: project.id,
      content: Value,
      role: MessageRole.USER,
      type: MessageType.RESULT,
    },
  });
    await inngest.send({
        name: "code-agent/run",
        data: {
            value: Value,
            projectId: project.id,  
        },
    })
    return newMessage;
};

export const getMessages=async(projectId:string)=>{
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    const project = await db.project.findUnique({   
        where: {
            id: projectId,
            userId: user.id,
        },
    });
    if (!project) throw new Error("Project not found");
    const messages = await db.message.findMany({
        where: {
            projectId: project.id,  
        },
        orderBy: {
            updatedAt: "asc",
        },
        include: {
            fragments: true,
        },
    });
    return messages;
}
