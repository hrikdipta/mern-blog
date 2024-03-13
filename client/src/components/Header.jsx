import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Navbar, TextInput, Dropdown, Avatar } from 'flowbite-react';
import {  HiLogout } from 'react-icons/hi';
import Logo from "./Logo";
import { FaSearch } from "react-icons/fa";
import { MdDarkMode,MdLightMode } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from "../redux/theme/themeSlice";
function Header() {
  
  const dispatch=useDispatch();
  const path = useLocation().pathname;
  const { currentUser: user } = useSelector(state => state.user)
  const {theme}=useSelector(state=>state.theme);console.log(theme)
  return (
    <Navbar fluid rounded>
      <div >
        <Logo />
      </div>
      <div className="md:block hidden">
        <div className="max-w-md">
          <TextInput id="search" type="text" rightIcon={FaSearch} placeholder="Search" required />
        </div>
      </div>
      <div>
        <FaSearch className="h-6 w-6 text-gray-500 md:hidden cursor-pointer" />
      </div>
      <div className="flex md:order-3 items-center  md:gap-4">
        <div className="w-10 h-10 rounded-md hover:bg-slate-200 flex items-center justify-center dark:bg-inherit">
          {
            theme==='light'?
            (<MdDarkMode className="w-8 h-8 cursor-pointer text-slate-700" onClick={()=>{dispatch(toggleTheme())}}/>)
            :(<MdLightMode className="w-8 h-8 cursor-pointer text-slate-700 dark:text-slate-200" onClick={()=>{dispatch(toggleTheme())}}/>)
          }
          
        </div>
        {user ? (
          <Dropdown arrowIcon={false} inline label={<Avatar img={user.photoURL} alt="user" rounded />}>
            <Dropdown.Header>
              <span className="block text-sm">{user.username}</span>
              <span className="block truncate text-sm font-medium">{user.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}><Dropdown.Item>Profile</Dropdown.Item></Link>
            <Dropdown.Divider/>
            <Dropdown.Item icon={HiLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        )
          : <Link to='/sign-up'><Button outline gradientDuoTone="pinkToOrange">Sign up</Button></Link>}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link to='/'><Navbar.Link as='div' href="#" active={path === '/'}>Home</Navbar.Link></Link>
        <Link to='/about'><Navbar.Link as='div' href="#" active={path === '/about'}>About</Navbar.Link></Link>
        <Link to='/contact'><Navbar.Link as='div' href="#" active={path === '/contact'}>Contact</Navbar.Link></Link>

      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
