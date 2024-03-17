import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarItemGroup } from 'flowbite-react';
import { FaUser ,FaSignOutAlt} from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/User/userSlice';
function DashSideBar() {
    const dispatch=useDispatch();
    const location=useLocation();
    const [tab,setTab]=useState('');
    useEffect(()=>{
        const searchparams= new URLSearchParams(location.search);
        const tabFromUrl=searchparams.get('tab');
        if(tabFromUrl){
            setTab(tabFromUrl);
        }
    },[location.search])
    
    const handleSignOut=async()=>{
        try {
            const res=await fetch('/api/user/signout',{
                method:'POST'
            })
            const data=await res.json();
            if(!res.ok){
                return ;
            }else{
                dispatch(signOutSuccess());
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div>
            <Sidebar className='w-full'>
                <Sidebar.Items>
                    <SidebarItemGroup className='w-full md:min-h-screen'>
                        <Link to='/dashboard?tab=profile'>
                            <Sidebar.Item href="#" active={tab==='profile'} as='div' icon={FaUser} label="user" labelColor="dark">
                                Profile
                            </Sidebar.Item>
                        </Link>
                        
                        <Sidebar.Item href="#" icon={FaSignOutAlt} onClick={handleSignOut}>
                            Sign out
                        </Sidebar.Item>
                    </SidebarItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>
    )
}

export default DashSideBar
