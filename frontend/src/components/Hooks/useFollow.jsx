import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { baseUrl } from "../../Pages/Author/sens/sens";
import toast from "react-hot-toast";



const useFollow = ()=>{

        const queryClient = useQueryClient();

    const {mutate:follow,isPending:isWaiting}=useMutation({
        mutationFn:async(userId)=>{
            try{
                const res = await fetch(`${baseUrl}/api/user/follow/${userId}`,{
                    method:"Post",
                    credentials:"include",
                    headers:{
                        "content-type":"application/json"
                    }
                })
                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.error || "Something Went Wrong")
                }

                return
            }
            catch(error){
                throw new Error(error.message)
            }
        },onSuccess:()=>{
            Promise.all([
                // queryClient.invalidateQueries({queryKey:["suggestion"]}),
                // queryClient.invalidateQueries({queryKey:["authuser"]})
                	queryClient.invalidateQueries({queryKey:["authuser"]}),
						queryClient.invalidateQueries({queryKey:["user"]})
            ]) 
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    })
    return {follow,isWaiting}
}

export default useFollow