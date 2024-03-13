import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarItemGroup } from 'flowbite-react';
import { FaUser ,FaSignOutAlt} from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
function DashSideBar() {
    const location=useLocation();
    const [tab,setTab]=useState('');
    useEffect(()=>{
        const searchparams= new URLSearchParams(location.search);
        const tabFromUrl=searchparams.get('tab');
        if(tabFromUrl){
            setTab(tabFromUrl);
        }
    },[location.search])
    
    return (
        <div>
            <Sidebar className='w-full'>
                <Sidebar.Items>
                    <SidebarItemGroup>
                        <Link to='/dashboard?tab=profile'>
                            <Sidebar.Item href="#" active={tab==='profile'} as='div' icon={FaUser} label="user" labelColor="dark">
                                Profile
                            </Sidebar.Item>
                        </Link>
                        
                        <Sidebar.Item href="#" icon={FaSignOutAlt}>
                            Sign out
                        </Sidebar.Item>
                    </SidebarItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>
    )
}

export default DashSideBar
