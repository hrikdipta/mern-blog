import React, { useEffect,useState } from 'react'
import {useSelector} from 'react-redux'
import { Table,Modal,Button,Alert } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
function DashPosts() {
  const currentUser = useSelector(state => state.user.currentUser);
  const[posts,setPosts]=useState([]);
  const[showMore,setShowMore]=useState(true);
  const[showDeleteModal,setShowDeleteModal]=useState(false);
  const[postIdToDelete,setPostIdToDelete]=useState(null);
  const[error,setError]=useState(null)
  console.log(posts)
  useEffect(()=>{
    const fetchPosts=async()=>{
      const res=await fetch(`/api/post/getposts?userId=${currentUser._id}`)
      const data = await res.json();
      if(res.ok){
        setPosts(data.posts)
        if(data.totalPosts<=9){
          setShowMore(false);
        }
      }
    }
    if(currentUser.isAdmin){
      fetchPosts()
    }
  },[currentUser._id])

  const handleShowMore=async()=>{
    const startIndex=posts.length;
    try {
      const res=await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data=await res.json();
      if(res.ok){
        setPosts([...posts,...data.posts])
        if(data.posts.length<=9){
          setShowMore(false);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  }
  const handleDeletePost= async()=>{
    setShowDeleteModal(false);
    if(!postIdToDelete) return;
    try {
      const res=await fetch(`/api/post/delete/${postIdToDelete}/${currentUser._id}`,{
        method:'DELETE'
      })
      if(!res.ok){
        setError('Something went wrong, please try again later')
      }
      setPosts((prev)=>(prev.filter((post)=>post._id!==postIdToDelete)))
    } catch (error) {
      setError(error.message)
    }
  }
  if(!currentUser.isAdmin) return false;
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        (currentUser.isAdmin && posts.length===0) ?<div className='text-md'>You don't have any post to show here</div>:
          <Table hoverable className='shadow-md'>
            <Table.Head className='w-full'>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Catagory</Table.HeadCell>
              <Table.HeadCell><span className="sr-only">Edit</span></Table.HeadCell>
              <Table.HeadCell><span className="sr-only">Delete</span></Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {
                posts.map(post => (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={post._id}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {post.updatedAt.substring(0, 10).split('-').reverse().join('-')}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img className='max-w-40  object-cover bg-slate-500' src={post.image} alt={post.title}/>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.catagory}</Table.Cell>
                    <Table.Cell>
                      <Link to={`/update-post/${post._id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                        Edit
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span onClick={()=>{setShowDeleteModal(true);setPostIdToDelete(post._id)}} className="font-medium text-red-600 hover:underline dark:text-red-500 cursor-pointer">
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
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => {setShowDeleteModal(false);setPostIdToDelete(null)}}>
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

export default DashPosts
