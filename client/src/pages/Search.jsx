import React, { useEffect, useState } from 'react'
import { TextInput,Select, Button,Spinner } from 'flowbite-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard'
function Search() {
    const location=useLocation();
    const navigate=useNavigate();
    const [sidebarData,setSidebarData]=useState({
        searchTerm:'',
        sort:'desc',
        catagory:'uncatagorized'
    })
    const [posts,setPosts]=useState([]);
    const [loading,setLoading]=useState(false);
    const[showMore,setShowMore]=useState(false);
    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search);
        const searchTermFromURL=urlParams.get('searchTerm');
        const sortFromURL=urlParams.get('sort');
        const catagroyFromURL=urlParams.get('catagory');
        if(searchTermFromURL || sortFromURL || catagroyFromURL){
            setSidebarData({
                ...sidebarData,
                searchTerm:searchTermFromURL,
                sort:sortFromURL,
                catagory:catagroyFromURL
            })
        }
        const fetchPost=async()=>{
            setLoading(true);
            const searchQuery=urlParams.toString();
            const res=await fetch(`/api/post/getposts?${searchQuery}`);
            if(!res.ok){
                return setLoading(false);
            }
            const data= await res.json();
            setPosts(data.posts)
            setLoading(false);
            if(data.posts.length===9){
                setShowMore(true);
            }else{
                setShowMore(false)
            }
        }
        fetchPost();
    },[location.search])
    const handleSubmit=(e)=>{
        e.preventDefault()
        const urlParams=new URLSearchParams(location.search);
        urlParams.set('searchTerm',sidebarData.searchTerm);
        urlParams.set('sort',sidebarData.sort);
        urlParams.set('catagory',sidebarData.catagory)
        const searchQuery=urlParams.toString();
        navigate(`/search/?${searchQuery}`)
    }
    const handleShowMore=async()=>{
        const startIndex=posts.length;
        const urlParams=new URLSearchParams(location.search)
        urlParams.set('startIndex',startIndex);
        const searchQuery=urlParams.toString();
        const res = await fetch(`/api/search/?${searchQuery}`);
        if(!res.ok){
            return
        }
        const data= await res.json();
        setPosts([...posts,...data.posts]);
        if(data.posts.length===9){
            setShowMore(true);
        }else{
            setShowMore(false)
        }
    }
  return (
    <div className='flex flex-col md:flex-row'>
        <div className=' md:min-h-screen p-4 mt-6 md:border-r-2 border-b-2'>
              <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                  <div className='flex gap-2 items-center'>
                      <label className=' font-semibold'>Search Term</label>
                      <TextInput placeholder='Search...' value={sidebarData.searchTerm} onChange={(e) => { setSidebarData({ ...sidebarData, searchTerm: e.target.value }) }} />
                  </div>
                  <div className='flex gap-2 items-center'>
                      <label className='font-semibold'>Sort:</label>
                    <Select onChange={(e)=>{setSidebarData({...sidebarData,sort:e.target.value})}} value={sidebarData.sort}>
                          <option value='asc'>Latest</option>
                          <option value='desc'>Oldest</option>
                    </Select>
                  </div>
                  <div className='flex gap-2 items-center'>
                      <label className='font-semibold'>Category</label>
                    <Select onChange={(e)=>{setSidebarData({...sidebarData,catagory:e.target.value})}} value={sidebarData.catagory}>
                        <option value='uncatagorized'>Select a catagory</option>
                        <option value='javascript'>Javascript</option>
                        <option value='python'>Python</option>
                        <option value='react.js'>React JS</option>
                        <option value='node.js'>Node JS</option>
                    </Select>
                  </div>
                  <Button type='submit'>Apply Filters</Button>
              </form>
        </div>
        <div className='w-full flex flex-col gap-4 p-4'>
            <h1 className=' font-semibold text-2xl p-3 border-b-2 border-gray-500 dark:border-gray-400'>Search Results:</h1>
            {
                !loading && <div className='flex flex-wrap gap-4'>
                {
                    posts.length===0 ? 
                    <p className='text-xl p-3'>No result found</p>
                    :(
                        posts.map((post)=>(<PostCard post={post}/>))
                    )
                }
            </div>}
            <div className='self-center '>
                {
                    loading && <Spinner aria-label="Extra large spinner example" size="xl" />

                }
                
            </div>
            {
                showMore && <button type='button' className=' text text-teal-500 hover:underline' onClick={handleShowMore}>Show more</button>
            }
        </div>
    </div>
  )
}

export default Search
