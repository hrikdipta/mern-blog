import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table,Alert,Modal,Button } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
function DashComments() {
  const {currentUser}=useSelector(state=>state.user)
  const[comments,setComments]=useState([])
  const[showDeleteModal,setShowDeleteModal]=useState(false);
  const[commentIdToDelete,setCommentIdToDelete]=useState(null);
  const [error,setError]=useState(null)
  const[showMore,setShowMore]=useState(false)

  const handleDeleteComment=async()=>{
    if(!commentIdToDelete) return;
    try {
      setShowDeleteModal(false);
      const res=await fetch(`/api/comment/deletecomment/${commentIdToDelete}`,{
        method:"DELETE",
      })
      if(res.ok){
        console.log("hello")
        setComments(comments.filter((comment)=>(comment._id!==commentIdToDelete)))
      }else{
        console.log("error occuared");
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(()=>{
    const fetchComments=async()=>{
      const res=await fetch('/api/comment/getallcomments');
      if(res.ok){
        const data=await res.json();
        setComments(data.allComments)
        if(data.totalComments>9){
          setShowMore(true);
        }
      }else{
        setError("An error occuared")
      }
    }
    if(currentUser.isAdmin){
      fetchComments();
    }
  },[currentUser._id])

  const handleShowMore=async()=>{
    const startIndex=comments.length;
    try {
      const res=await fetch(`/api/comment/getallcomments?startIndex=${startIndex}`);
      const data=await res.json();
      if(!res.ok){
        setShowMore(false)
        return setError("something went wrong");
      }else{
        setComments([...comments,...data.allComments])
        if(data.allComments.length<9){
          setShowMore(false);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  }
  if(!currentUser.isAdmin) return  null;
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {
          (currentUser.isAdmin && comments.length === 0) ? <div className='text-md'>You don't have any comments to show here</div> :
            <Table hoverable className='shadow-md'>
              <Table.Head className='w-full'>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>Comment</Table.HeadCell>
                <Table.HeadCell>Number of Likes</Table.HeadCell>
                <Table.HeadCell>Post Id</Table.HeadCell>
                <Table.HeadCell>User Id</Table.HeadCell>
                <Table.HeadCell><span className="sr-only">Delete</span></Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {
                  comments.map(comment => (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={comment._id}>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {comment.updatedAt.substring(0, 10).split('-').reverse().join('-')}
                      </Table.Cell>
                      <Table.Cell>
                        {comment.content}
                      </Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                      <Table.Cell>{comment.postId}</Table.Cell>
                      <Table.Cell>{comment.userId}</Table.Cell>
                      <Table.Cell>
                        <span onClick={() => { setShowDeleteModal(true); setCommentIdToDelete(comment._id) }} className="font-medium text-red-600 hover:underline dark:text-red-500 cursor-pointer">
                          Delete
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
        }
        <Modal show={showDeleteModal} size="md" onClose={() => setShowDeleteModal(false)} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this comment?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteComment}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => { setShowDeleteModal(false); setCommentIdToDelete(null) }}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {
          showMore && <button onClick={handleShowMore} className='text-teal-500 px-4 py-4 self-center w-full'>Show more</button>
        }
        {error && <Alert>{error}</Alert>}
      </div>
  )
}

export default DashComments
