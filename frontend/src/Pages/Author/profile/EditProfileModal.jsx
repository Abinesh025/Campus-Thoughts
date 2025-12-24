import {useQuery} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import updateProfiles from "../../../components/Hooks/useUpdated";


const EditProfileModal = ({}) => {
	const [formData, setFormData] = useState({
		StudentName:"",
		UserName:"",
		DepartMent:"",
		RegNum:"",
		Email:"",
		Bio:"",
		link:"",
		Password:"",
		newPassword:"",
	});

	const { data: authuser } = useQuery({ queryKey: ["authuser"],queryFn:EditProfileModal});

	const {isUpdatingProfile,updateProfile} = updateProfiles()
	

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(()=>{
		if(authuser){
			setFormData({
				StudentName:authuser.StudentName,
				UserName:authuser.UserName,
				DepartMent:authuser.DepartMent,
				RegNum:authuser.RegNum,
				Email:authuser.Email,
				Bio:authuser.Bio,
				link:authuser.link,
			})
		}
	},[authuser])
	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='UserName'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.UserName}
								name='UserName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='StudentName'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.StudentName}
								name='StudentName'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.Email}
								name='Email'
								onChange={handleInputChange}
							/>

							<input
								type='text'
								placeholder='DepartMent'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.DepartMent}
								name='DepartMent'
								onChange={handleInputChange}
							/>

							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.Bio}
								name='Bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.Password || ""}
								name='Password'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword || ""}
								name='newPassword'
								onChange={handleInputChange}
							/>

						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData?.link || ""}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile && <LoadingSpinner size="sm" />}

							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;