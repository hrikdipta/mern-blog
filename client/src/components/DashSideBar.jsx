import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarItemGroup } from 'flowbite-react';
import { FaUser ,FaSignOutAlt,FaUsers,FaComments} from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi2";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { signOutSuccess } from '../redux/User/userSlice';
function DashSideBar() {
    const dispatch=useDispatch();
    const location=useLocation();
    const [tab,setTab]=useState('');
    const {currentUser}=useSelector(state=>state.user);
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
                    <SidebarItemGroup className='w-full md:min-h-screen flex flex-col gap-1'>
                        <Link to='/dashboard?tab=profile'>
                            <Sidebar.Item href="#" active={tab==='profile'} as='div' icon={FaUser} label={currentUser?.isAdmin ? "Admin":"user"} labelColor="dark">
                                Profile
                            </Sidebar.Item>
                        </Link>
                        {
                            currentUser?.isAdmin &&(
                                <Link to='/dashboard?tab=posts'>
                                    <Sidebar.Item href="#" active={tab === 'posts'} as='div' icon={HiDocumentText} >
                                        Posts
                                    </Sidebar.Item>
                                </Link>
                            )
                        }
                        {
                            currentUser?.isAdmin &&(
                                <Link to='/dashboard?tab=users'>
                                    <Sidebar.Item href="#" active={tab === 'users'} as='div' icon={FaUsers} >
                                        Users
                                    </Sidebar.Item>
                                </Link>
                            )
                        }
                        {
                            currentUser?.isAdmin &&(
                                <Link to='/dashboard?tab=comments'>
                                    <Sidebar.Item href="#" active={tab === 'comments'} as='div' icon={FaComments} >
                                        Comments
                                    </Sidebar.Item>
                                </Link>
                            )
                        }
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
