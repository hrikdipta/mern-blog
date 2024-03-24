import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSideBar from '../components/DashSideBar';
import Dashprofile from '../components/Dashprofile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
function Dashboard() {
  const location = useLocation();
  const [tab,setTab]=useState('');
  useEffect(()=>{
    const searchparams= new URLSearchParams(location.search);
    const tabFromUrl=searchparams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search])
  
  
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* dashboard left part */}
      <div className='md:max-w-56 w-full'>
        <DashSideBar/>
      </div>
      {/* dashboard right part */}
      {tab==='profile'?<Dashprofile/>:null}
      {tab==='posts'?<DashPosts/>:null}
      {tab==='users'?<DashUsers/>:null}
    </div>
  )
}

export default Dashboard
