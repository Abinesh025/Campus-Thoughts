import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X.jsx";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../sens/sens.jsx";
import toast from "react-hot-toast";


const SignUpPage = () => {
	const [formData, setFormData] = useState({
		Email: "",
		UserName:"",
		StudentName: "",
		DepartMent: "",
		Password: "",
        RegNum:""
	});

	const {mutate,isError,isPending,error} =useMutation({
		mutationFn: async({Email,StudentName,DepartMent,Password,RegNum,UserName})=>{
			try{
			const res = await fetch(`${baseUrl}/api/auther/signup`,{
				method:"POST",
				credentials:"include",
				headers:{
					"Content-Type":"application/json",
					"Accept":"application/json"
				},
				body:JSON.stringify({Email,StudentName,DepartMent,Password,RegNum,UserName})
			})

			const data = await res.json();

			if(!res.ok){
				throw new Error(data.error || "Something Went Wrong")
			}

			return data;

			}catch(error){
				toast.error("SignUp Failed");
				throw error
			}
		},
		onSuccess:()=>{
			toast.success("user Created")
		}
	})
	const handleSubmit = (e) => {
		e.preventDefault(); 
		mutate(formData)
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10 ' >
			<div className='flex-1 hidden lg:flex items-center justify-center gap-32'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-34 lg:hidden fill-black' />

					<h1 className='text-4xl font-extrabold text-purple lg:text-white'>Share Your Thoughts Today!</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='Email'
							className='grow'
							autoComplete="off"
							placeholder='Email'
							name='Email'
							onChange={handleInputChange}
							value={formData.Email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Student'
								autoComplete="off"
								name='StudentName'
								onChange={handleInputChange}
								value={formData.StudentName}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='UserName'
								autoComplete="off"
								name='UserName'
								onChange={handleInputChange}
								value={formData.UserName}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Department'
								autoComplete="off"
								name='DepartMent'
								onChange={handleInputChange}
								value={formData.DepartMent}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaRegAddressCard />
							<input
								type='text'
								className='grow'
								placeholder='Reg Num'
								autoComplete="off"
								name='RegNum'
								onChange={handleInputChange}
								value={formData.RegNum}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							autoComplete="off"
							name='Password'
							onChange={handleInputChange}
							value={formData.Password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? <LoadingSpinner /> : "Submit"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-purple lg:text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;