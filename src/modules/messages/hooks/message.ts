import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import { createMessage, getMessages } from "../actions";

export const prefetchMessages = async (queryClient: QueryClient, projectId: string) => {
  await queryClient.prefetchQuery({
    queryKey: ["messages", projectId],
    queryFn: () => getMessages(projectId),
    staleTime: 10000,
  });
};

export const useGetMessages = (projectId: string) => {
  return useQuery({
    queryKey: ["messages", projectId],
    queryFn: () => getMessages(projectId),
    staleTime: 10000,
    refetchInterval: (query) => {
      return query.state.data?.length ? 5000 : false;
    },
  });
};

export const useCreateMessages=(projectId:string)=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:(value:string)=>createMessage(value,projectId),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["messages",projectId]})
            queryClient.invalidateQueries({queryKey:["status"]})
        }
    })
}