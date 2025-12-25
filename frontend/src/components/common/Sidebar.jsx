import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../../Pages/Author/sens/sens";
import toast from "react-hot-toast";


export const Sidebar = () => {

	const {data:authuser} = useQuery({queryKey:["authuser"]});	

	// const { data: authuser, isLoading, error } = useQuery({queryKey: ["authuser"],queryFn:Sidebar});

	const queryClient = useQueryClient();

	const {mutate:Logout} = useMutation({
		mutationFn:async()=>{
			try
			{
				const res = await fetch(`${baseUrl}/api/auther/logout`,{
					method:"POST",
					credentials:"include",
					headers:{
						"content-type":"application/json",
						"accept":"application/json"
					},
					body:JSON.stringify()
				})

				const data = await res.json();

				if(!res.ok){
					throw new Error(data.error || "Something went wrong");
				}
				return data
			}
			catch(error)
			{
				console.log(`The Error is  ${error}`);
				throw error
			}
		
		},
		retry:false,
		onSuccess:()=>{
			queryClient.invalidateQueries({
				queryKey:["authuser"]
			})
		},
		onError:()=>{
			toast.error("LogOut Failed");
		}
		
	});


	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center align-items-center md:justify-start'>
					<XSvg className='px-2 w-25 h-25 rounded-full fill-white hover:bg-stone-900' />
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notification'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authuser.StudentName}`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
				</ul>
				{authuser && (
					<Link
						to={`/profile/${authuser.StudentName}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={authuser.ProfileImage || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{authuser.StudentName}</p>
								<p className='text-slate-500 text-sm'>@{authuser?.UserName}</p>
							</div>
							<BiLogOut
								className='w-5 h-5 cursor-pointer'
								onClick={(e) => {
										e.preventDefault(),
									Logout()
								}
								}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar
