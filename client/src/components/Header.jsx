import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Navbar,TextInput} from 'flowbite-react';
import { Avatar } from 'flowbite-react';
import Logo from "./Logo";
import { FaSearch } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux'
function Header() {
  const path = useLocation().pathname;
  const user=useSelector((state)=>state.user.currentUser)
  
  return (
    <Navbar fluid rounded>
      <div >
        <Logo/>
      </div>
      <div className="md:block hidden">
          <div className="max-w-md">
            <TextInput id="search" type="text" rightIcon={FaSearch} placeholder="Search" required />
          </div>
      </div>
      <div>
        <FaSearch className="h-6 w-6 text-gray-500 md:hidden cursor-pointer"/>
      </div>
      <div className="flex md:order-3 items-center gap-4">
        <MdDarkMode className="w-8 h-8 cursor-pointer"/>
        {user ?
        <Avatar img={user.rest.photoURL} alt="avatar of Jese" rounded />
        :<Link to='/sign-up'><Button outline gradientDuoTone="pinkToOrange">Sign up</Button></Link>}
        
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link to='/'><Navbar.Link as='div' href="#" active={path==='/'}>Home</Navbar.Link></Link>
        <Link to='/about'><Navbar.Link as='div' href="#" active={path==='/about'}>About</Navbar.Link></Link>
        <Link to='/contact'><Navbar.Link as='div' href="#" active={path==='/contact'}>Contact</Navbar.Link></Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
