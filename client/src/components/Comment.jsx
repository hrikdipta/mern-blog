import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Avatar ,Textarea,Button} from "flowbite-react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
function Comment({comment,likeComment,onEdit}) {
  const[user,setUser]=useState(null);
  const[isEditing,setIsEditing]=useState(false);
  const[editedContent,setEditedContent]=useState('')
  console.log(editedContent)
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

  const handleEdit=()=>{
    setIsEditing(true)
    setEditedContent(comment.content);
  }
  const saveComment=async()=>{
    try {
      const res=await fetch(`/api/comment/editcomment/${comment._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          content:editedContent
        })
      })
      if(res.ok){
        onEdit(comment._id,editedContent)
        setIsEditing(false)
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className='flex flex-row gap-3 my-4 border-b-2 border-gray-300 py-8'>
      <div>
        <Avatar img={user?.photoURL} alt={user?.username} rounded />
      </div>
      <div className=' w-full'>
        <div className='text-xs flex gap-2 items-center'>
          <span className=' font-semibold'>@{user? user.username:'annonymus user'}</span>
          <span className=' text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
        </div>
        {
          isEditing ?(
            <>
              <Textarea value={editedContent} className=' w-full mb-2 bg-gray-100 text-gray-700 focus:outline-none' onChange={(e)=>{setEditedContent(e.target.value)}}/>
              <div className='flex gap-2 justify-end text-sm'>
              <Button outline gradientDuoTone="purpleToBlue" onClick={saveComment}>Save</Button>
              <Button outline gradientDuoTone="purpleToBlue" onClick={()=>{setIsEditing(false),setEditedContent('')}}>Cancel</Button>
              </div>
            </>
          ):(
            <>
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
                {
                  currentUser &&(currentUser.isAdmin || comment.userId===currentUser._id) &&(
                    <button type='button' className='text-gray-400 hover:text-blue-500' onClick={handleEdit}>
                      Edit
                    </button>
                  )
                }
              
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

export default Comment
