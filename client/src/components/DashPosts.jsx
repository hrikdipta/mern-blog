import React, { useEffect,useState } from 'react'
import {useSelector} from 'react-redux'
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
function DashPosts() {
  const currentUser = useSelector(state => state.user.currentUser);
  const[posts,setPosts]=useState([]);
  const[showMore,setShowMore]=useState(true);
  
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
      console.log(error)
    }
  }
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
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
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
                      <Link to={`/update-post${post._id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                        Edit
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-red-600 hover:underline dark:text-red-500 cursor-pointer">
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
      }
      {
        showMore && <button onClick={handleShowMore} className='text-teal-500 px-4 py-4 self-center w-full'>Show more</button>
      }
    </div>
  )
}

export default DashPosts
