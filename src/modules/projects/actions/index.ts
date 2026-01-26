"use server"

import { inngest } from "@/inngest/client"
import db  from "@/lib/db"
import { MessageRole, MessageType } from "@/generated/prisma/enums"
import { generateSlug } from "random-word-slugs"
import { getCurrentUser } from "@/modules/auth/actions"
import { consumeCredits } from "@/lib/usage"
import { AppError } from "@/lib/app-error"

export const createProject = async (value:string)=>{
    const user = await getCurrentUser()
    if(!user) throw new Error("Unauthorized")
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
    const newProject = await db.project.create({
        data:{
            name:generateSlug(2,{format:"kebab"}),
            userId:user.id,
            messages:{
                create:{
                    content:value,
                    role:MessageRole.USER,
                    type:MessageType.RESULT
                }
            }
        }
})
    await inngest.send({
        name:"code-agent/run",
        data:{
            value:value,
            projectId:newProject.id,
        }
    })
    return newProject
}

export const getProjects = async ()=>{
    const user = await getCurrentUser()
    if(!user) throw new Error("Unauthorized")
    const projects = await db.project.findMany({
        where:{
            userId:user.id
        },
        orderBy:{
            updatedAt:"desc"
        }
    })
    return projects
}
export const getProjectById = async (projectId:string)=>{
    const user = await getCurrentUser()
    if(!user) throw new Error("Unauthorized")
    const project = await db.project.findUnique({
        where:{
            id:projectId  ,
            userId:user.id  
        }
    })
    if(!project) throw new Error("Project not found")
    return project
}