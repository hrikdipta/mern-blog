import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar ,Button,Textarea} from "flowbite-react";
import Comment from '../components/Comment'
function CommentSection({postId}) {
    const{currentUser} =useSelector((state)=>state.user)
    const[comment,setComment]=useState('');
    const[commentsFromPost,setCommentsFromPost]=useState([]);//all comments
    
    const[error,setError]=useState(null);
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
          setCommentsFromPost([data,...commentsFromPost])
        }
      } catch (error) {
        console.log(error)
      }
    }
    useEffect(()=>{
      const fetchComments=async()=>{
        try {
          const res =await fetch(`/api/comment/getpostcomments/${postId}`)
          const allComments=await res.json();
          
          if(!res.ok){
            return setError("An Error occuared while fetching the comments");
          }else{
            setCommentsFromPost(allComments);
            setError(null);
          }
        } catch (error) {
          setError(error.message);
        }
      }
      fetchComments();
    },[postId])

    const likeComment=async (commentId)=>{
      try {
        if(!currentUser){
          return;
        }
        const res=await fetch(`/api/comment/likecomment/${commentId}`,{
          method:"PUT"
        })
        if(res.ok){
          const data =await res.json();
          setCommentsFromPost(
            commentsFromPost.map((comment)=>((comment._id===commentId)?{...comment,likes:data.likes,numberOfLikes:data.numberOfLikes}:comment))
          )
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    const handleEdit=(commentId,editedContent)=>{
      setCommentsFromPost(commentsFromPost.map((c)=>(
        c._id===commentId?{...c,content:editedContent}:c
      )))
    }

    const handleDelete=(commentId)=>{
      setCommentsFromPost(commentsFromPost.filter((comment)=>(
        comment._id!=commentId
      )))
      
    }
  return (
    <div className='max-w-3xl w-full p-3 mx-auto my-5'>
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
      <div>
        {
          commentsFromPost.length === 0 ? (<p className='text-gray-500 my-5 text-sm'>No Comments Yet</p>) : (
            <>
              <div className='my-5 flex items-center gap-1 text-sm'>
                <p>Comments </p>
                <span className='border rounded-md border-gray-400 px-2'>{commentsFromPost.length}</span>
              </div>
              {
                commentsFromPost.map((comment)=>(
                  <Comment key={comment._id} comment={comment} likeComment={likeComment} onEdit={handleEdit} onDelete={handleDelete}/>
                ))
              }
            </>
          )
        }
      </div>

    </div>
  )
}

export default CommentSection
