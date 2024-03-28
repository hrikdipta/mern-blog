import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Avatar } from "flowbite-react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
function Comment({comment,likeComment}) {
  const[user,setUser]=useState(null);
  const {currentUser}=useSelector((state)=>state.user)
  useEffect(()=>{
    const fetchUserData=async()=>{
      try {
        const res=await fetch(`/api/user/${comment.userId}`);
        const data=await res.json();
        if(!res.ok){
          console.log("error occuared")
        }else{
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  },[comment])
  return (
    <div className='flex flex-row gap-3 my-4 border-b-2 border-gray-300 py-8'>
      <div>
        <Avatar img={user?.photoURL} alt={user?.username} rounded />
      </div>
      <div>
        <div className='text-xs flex gap-2 items-center'>
          <span className=' font-semibold'>@{user? user.username:'annonymus user'}</span>
          <span className=' text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
        </div>
        <p className=' text-gray-500 mb-2'>
          {comment.content}
        </p>
        <div className=' text-sm flex items-center gap-2 '>
          <button type='button' className={`text-gray-500 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`} onClick={()=>{likeComment(comment._id)}}>
            <FaThumbsUp/>
          </button>
          <p className=' text-gray-500'>
            {
              comment.numberOfLikes>0 && (comment.numberOfLikes + " " + (comment.numberOfLikes===1 ? 'like' :"likes"))
            }
          </p>
         
        
        </div>
      </div>
    </div>
  )
}

export default Comment
