import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import PostCard from '../components/PostCard'
function Home() {
  const[posts,setPosts]=useState([]);
  useEffect(()=>{
    const fetchPosts=async()=>{
      const res=await fetch('/api/post/getposts');
      if(res.ok){
        const data=await res.json();
        setPosts(data.posts);
      }
    }
    fetchPosts();
  },[])
  return (
    <div className=' min-h-screen'>
      <div className='flex flex-col gap-6 mt-2 py-12 px-4 lg:p-28 max-w-6xl mx-auto'>
        <h1 className=' text-3xl md:text-6xl font-bold text-gray-700  dark:text-gray-300 '>Welcome To My Blog</h1>
        <p className=' max-w-xl text-wrap text-sm  text-slate-500 dark:text-gray-400'>Here you'll find a varaity of artticles and tutorials on topics such as web devolopment, software engineering and programming languages</p>
        <Link to='/search' className=' text-sm text-teal-500 font-bold hover:underline'>See all posts</Link>
      </div>
      <div>
        {
          posts.length>0 &&(
            <div className='flex flex-col gap-6 items-center'>
              <h2 className='text-2xl font-semibold text-center'>Recent posts</h2>
              <div className='flex flex-wrap gap-4 justify-center '>
                {
                  posts.map((post)=>(
                    <PostCard key={post._id} post={post}/>
                  ))
                }
              </div>
              <Link to='/search' className=' my-6 text-sm text-teal-500 font-bold hover:underline'>See all posts</Link>
            </div>
          )
        }

      </div>
    </div>
  )
}

export default Home
