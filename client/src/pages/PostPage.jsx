import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Spinner,Button } from "flowbite-react";
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
function PostPage() {
    const {postSlug}=useParams();
    const[post,setPost]=useState({})
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState(null);
    const[recentPosts,setRecentPosts]=useState([])
    
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
        const data = await res.json();
        if (res.ok) {
          setPost(data.posts[0])
          setError(null);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message)
      }
    }
    fetchPost();
  }, [postSlug])

  useEffect(()=>{
    const fetchRecentPost=async()=>{
      try {
        const res=await fetch('/api/post/getposts?limit=3');
        const data=await res.json();
        if(res.ok){
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchRecentPost();
  },[])

  if(loading) return <div className="flex justify-center items-center min-h-screen"><Spinner aria-label="Center-aligned spinner example" size='xl' /></div>
  return (
    <div>
      <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-3xl md:text-5xl mt-10 p-3 text-center font-bold font-serif max-w-3xl mx-auto text-black dark:text-gray-300'>{post && post.title}</h1>
        <Link to={`/search?catagory=${post?.catagory}`} className='self-center'>
          <Button color="gray" pill className='mt-6 ' size='xs' >
            {post?.catagory}
          </Button>
        </Link>
        <img src={post?.image} alt={post?.title}  className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
        <div className='flex justify-between p-3 border-b-2 text-xs text-slate-500 border-slate-500 italic'>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>{post.content && (post.content.length/1000).toFixed(0)} mins read</span>
        </div>
        <div className='max-w-3xl p-3 mx-auto w-full post-content text-black dark:text-gray-300 ' dangerouslySetInnerHTML={{__html:post.content}}>
          
        </div>
        <CommentSection postId={post._id}/>
      </main>
        <div className='flex flex-col my-6 p-4 items-center justify-center'>
          <h1 className=' self-center text-xl'>Recent articles</h1>
          <div className='flex flex-wrap gap-6 my-5 justify-center'>
            {
              recentPosts.length>0 && recentPosts.map((recentPost)=>(
                <PostCard key={recentPost._id} post={recentPost}/>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default PostPage
