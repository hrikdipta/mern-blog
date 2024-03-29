import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Avatar ,Textarea,Button,Modal} from "flowbite-react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from "react-icons/hi";
function Comment({comment,likeComment,onEdit,onDelete}) {
  const[user,setUser]=useState(null);
  const[isEditing,setIsEditing]=useState(false);
  const[editedContent,setEditedContent]=useState('')
  const[showModal,setShowModal]=useState(false);
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

  const deleteComment=async()=>{
    try {
      const res= await fetch(`/api/comment/deletecomment/${comment._id}`,{
        method:"DELETE"
      })
      if(res.ok){
        setShowModal(false);
        onDelete(comment._id)
      }
    } catch (error) {
      console.log(error.message)
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
                {
                  currentUser && (currentUser.isAdmin || comment.userId===currentUser._id)&&(
                    <button type='button' className='text-red-400 hover:text-red-600' onClick={()=>{setShowModal(true)}}>
                      Delete
                    </button>
                  )
                }
                  <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
                    <Modal.Header />
                    <Modal.Body>
                      <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                          Are you sure you want to delete this comment?
                        </h3>
                        <div className="flex justify-center gap-4">
                          <Button color="failure" onClick={deleteComment}>
                            {"Yes, I'm sure"}
                          </Button>
                          <Button color="gray" onClick={() => setShowModal(false)}>
                            No, cancel
                          </Button>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}

export default Comment
