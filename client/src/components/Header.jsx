import React, { useEffect, useState } from "react";
import { Link, useLocation ,useNavigate} from "react-router-dom";
import { Button, Navbar, TextInput, Dropdown, Avatar,Modal } from 'flowbite-react';
import {  HiLogout } from 'react-icons/hi';
import Logo from "./Logo";
import { FaSearch } from "react-icons/fa";
import { MdDarkMode,MdLightMode } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/User/userSlice";
function Header() {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const location=useLocation();
  const path = useLocation().pathname;
  const { currentUser: user } = useSelector(state => state.user)
  const {theme}=useSelector(state=>state.theme);
  const[searchTerm,setSearchTerm]=useState('');
  const[showModal,setShowModal]=useState(false);
  useEffect(()=>{
    const urlParams= new URLSearchParams(location.search)
    const searchTermFromURL=urlParams.get('searchTerm');
    if(searchTermFromURL){
      setSearchTerm(searchTermFromURL);
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
            navigate('/sign-in');
        }
    } catch (error) {
        console.log(error.message)
    }
 }
 const handleSubmit=(e)=>{
  e.preventDefault();
  setShowModal(false);
  const urlParams=new URLSearchParams(location.search);
  urlParams.set('searchTerm',searchTerm);
  const searchQuery=urlParams.toString();
  navigate(`/search/?${searchQuery}`)
 } 

  return (
    <div className="">
      <Navbar className="border-b-2 flex items-center">
        <Logo/>
        <form onSubmit={handleSubmit}>
        <TextInput type="text" className="hidden md:inline" rightIcon={FaSearch} placeholder="Search..." required value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value)}}/>

        </form>
        <Button color="light" pill className="md:hidden" onClick={()=>{setShowModal(true)}}>
          <FaSearch className="text-lg text-gray-700"/>
        </Button>
        <div className="flex items-center gap-3 md:order-2">
          <Button color='light' className=" sm:inline hidden" pill onClick={()=>{dispatch(toggleTheme())}} >
            {theme==='dark'?<MdLightMode/>:<MdDarkMode/>}
          </Button>
          {user ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt='user' img={user.photoURL} rounded />
              }
            >
              <Dropdown.Header>
                <span className='block text-sm'>@{user.username}</span>
                <span className='block text-sm font-medium truncate'>
                  {user.email}
                </span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
            </Dropdown>
            ) : (
            <Link to='/sign-in' className="md:inline hidden">
              <Button gradientDuoTone='purpleToBlue' outline>
                Sign In
              </Button>
            </Link>

          )}
          <Navbar.Toggle/>
        </div>
        <Navbar.Collapse>
          <Link to='/'><Navbar.Link as='div' href="#" active={path === '/'}>Home</Navbar.Link></Link>
          <Link to='/about'><Navbar.Link as='div' href="#" active={path === '/about'}>About</Navbar.Link></Link>
          <Link to='/contact'><Navbar.Link as='div' href="#" active={path === '/contact'}>Contact</Navbar.Link></Link>
          {
            !user &&(
              <Link to='/sign-in' className="inline md:hidden">
                <Button gradientDuoTone='purpleToBlue' outline>
                  Sign In
                </Button>
              </Link>
            )
          }
        </Navbar.Collapse>
      </Navbar>
      <Modal dismissible show={showModal} onClose={() => setShowModal(false)} className="px-1 flex items-center">
        <Modal.Header  className="flex items-center bg-transparent">
        <div className="flex gap-2">
          <TextInput type="text" className="w-full flex-grow"  placeholder="Search..." required value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value)}}/>
          <Button color="light" className="" onClick={handleSubmit}><FaSearch className=""/></Button>
        </div>
        </Modal.Header>
      </Modal>
    </div>
  );
}

export default Header;
