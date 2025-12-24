import { useMutation ,useQueryClient} from "@tanstack/react-query";
import { baseUrl } from "../../Pages/Author/sens/sens";
import toast from "react-hot-toast";
const updateProfiles = ()=>{

	const queryClient = useQueryClient();

    	const {mutate:updateProfile,isPending:isUpdatingProfile} = useMutation({
		mutationFn:async(formData)=>{
			try{
				const res= await fetch(`${baseUrl}/api/user/updateStd`,{
					method:"POST",
					credentials:"include",
					headers:{
						"content-type":"application/json",
					},
					body:JSON.stringify(formData)
				})

				const data = await res.json()

				if(!res.ok){
					throw new Error(data.error || "Something went wrong")
				}

                return data
			}catch(error)
			{
				throw error.message
			}
		},onSuccess:()=>{
			toast.success("Updated SuccessFully"),
			Promise.all([
						queryClient.invalidateQueries({queryKey:["authuser"]}),
						queryClient.invalidateQueries({queryKey:["user"]})
			]
			)
		},onError:()=>{
			toast.error("Current Password doesn't Match" || "")
		},
		retry:false
	},
);
return {updateProfile,isUpdatingProfile}
}

export default updateProfiles