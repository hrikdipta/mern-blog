import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar ,Button,Textarea} from "flowbite-react";
function CommentSection({postId}) {
    const{currentUser} =useSelector((state)=>state.user)
    const[comment,setComment]=useState('');
    const handleSubmit=async(e)=>{
      e.preventDefault();
      if(comment.length>200)
        return;
      if(comment.trim().length===0)
        return;
      try {
        const res=await fetch('/api/comment/create',{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            content:comment,
            postId,
            userId:currentUser._id
          })
        })
        const data= await res.json();
        if(res.ok){
          setComment('');
        }
      } catch (error) {
        console.log(error)
      }
    }
  return (
    <div className='max-w-2xl w-full p-3 mx-auto my-5'>
      {
        currentUser?(
            <div className='flex items-center text-gray-600 text-xs font-semibold gap-1'>
                <p>Signed in as:</p>
                <Avatar img={currentUser.photoURL} alt="profile image" rounded size='xs'/>
                <Link className='text-teal-500 hover:underline' to='/dashboard?tab=profile'>@{currentUser.username}</Link>
            </div>
        ):(
            <div className='text-sm text-gray-500 flex gap-2'>You must sign in to comment
                <Link className='text-teal-500' to={'/sign-in'}>sign in</Link>
            </div>
        )
      }
      {
        currentUser && (
            <form className='my-5 border border-teal-500 p-3 rounded-md' onSubmit={handleSubmit}>
                <Textarea placeholder='write a comment ...' rows='3' maxLength='200' required className='my-2' onChange={(e)=>{setComment(e.target.value)}} value={comment}/>
                <div className='flex items-center justify-between mt-3'>
                    <p className='text-xs font-serif italic text-gray-500'>{200-comment.length} characters remaining</p>
                    <Button type='submit' outline gradientDuoTone="purpleToBlue">Add Comment</Button>
                </div>
            </form>
        )
      }

    </div>
  )
}

export default CommentSection
