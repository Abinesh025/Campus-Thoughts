import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../sens/sens";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/common/LoadingSpinner";



const LoginPage = () => {
	const [formData, setFormData] = useState({
		StudentName: "",
		Password: "",
	});
const queryClient = useQueryClient()


const {mutate:loginMutation,isSuccess,isError,error} = useMutation({
	mutationFn:async({StudentName,Password})=>{
		try{
			const res = await fetch(`${baseUrl}/api/auther/login`,{
				method:"POST",
				credentials:"include",
				headers:{
					"content-type":"application/json",
					"Accept":"application/json"
				},
				body:JSON.stringify({StudentName,Password})
			})

			const data =await res.json();

			if(!res.ok){
				throw new Error(data.error || "Something Went Wrong")
			}

			return data
		}catch(error)
		{
			toast.error("Login Failed")
			throw error
		}
	},
	onSuccess:()=>{
		toast.success("Login SuccessFully");
		queryClient.invalidateQueries({
			queryKey:["authuser"]
		})
	}
});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-3/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-34 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-purple lg:text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<FaUser />
						<input
							type='text'
							autoComplete="off"
							className='grow'
							placeholder='Student Name'
							name='StudentName'
							onChange={handleInputChange}
							value={formData.StudentName}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='Password'
							onChange={handleInputChange}
							value={formData.Password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
                        {isSuccess ? <LoadingSpinner /> : "Login"}
					</button>
					{isError && <p className="text-red-500">{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-purple lg:text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;