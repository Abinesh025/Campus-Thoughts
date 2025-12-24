import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../Pages/Author/sens/sens";
import { useEffect } from "react";

const Posts = ({feedType,StudentName,userId}) => {
	
	const getPosts  = ()=>{
		switch (feedType){
			case "forYou":
				return `${baseUrl}/api/post/all`;
			case "posts":
				return `${baseUrl}/api/post/UserPost/${StudentName}`;
			case "likes":
				return `${baseUrl}/api/post/likedPost/${userId}`;
			case "following":
				return `${baseUrl}/api/post/post/followerPost`
			default:
				return `${baseUrl}/api/post/all`
		}
	}

	const POSTS_FIND = getPosts();

	const {data:posts,isLoading,isFetching,refetch} = useQuery({
		queryKey:["posts"],
		queryFn:async()=>{
			try{
				const res = await fetch(POSTS_FIND,{
					method:"Get",
					credentials:"include",
					headers:{
						"content-type":"application/type"
					}	
				}
			)
			const data = await res.json();
			// console.log(data)
			if(!res.ok){
				throw new Error(data.error || "Something Went Wrong")
			}
			return data
			}catch(error)
			{
				throw error
			}
		},
		retry:false
	}) 

	useEffect(()=>{
		refetch()
	},[feedType,refetch,StudentName])


	return (
		<>
			{(isLoading || isFetching)  && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!isLoading  && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;