import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { createProject,getProjectById,getProjects } from "../actions";

export function useGetProjects(){
    return useQuery({
        queryKey:["projects"],
        queryFn: async ()=>getProjects(),
    })
}       

export function useGetProjectById(projectId:string){
    return useQuery({
        queryKey:["project",projectId],
        queryFn: async ()=>getProjectById(projectId)
    })
}

export function useCreateProject(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (value:string)=>createProject(value),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["projects"]})
        }
    })
}