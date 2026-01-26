"use server";
import { MessageRole, MessageType } from "@/generated/prisma/enums";
import db from "@/lib/db";
import { inngest } from "@/inngest/client";
import { getCurrentUser } from "@/modules/auth/actions";
import { consumeCredits } from "@/lib/usage";
import { AppError } from "@/lib/app-error";

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

 try {
    await consumeCredits();
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError("BAD_REQUEST", "Something went wrong");
    } else {
      throw new AppError(
        "TOO_MANY_REQUESTS",
        "Too many requests, please try again later"
      );
    }
  }

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
