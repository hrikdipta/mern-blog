import React from 'react'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Dashprofile() {
    const {currentUser}=useSelector(state=>state.user)
    const handleOnChange=(e)=>[

    ]
    return (
        <div className='max-w-lg mx-auto w-full px-4 pt-6'>
            <h1 className='text-center text-3xl mb-4 font-semibold'>Profile</h1>
            <form className="flex  flex-col gap-4">
                <div className='w-40 h-40 self-center'>
                    <img className="rounded-full w-full border-4 border-red-500 object-cover" src={currentUser.photoURL} alt="image description"/>
                </div>
                <div className='w-full'>
                    <div className="mb-2 block">
                        <Label htmlFor="username" value="Username" />
                    </div>
                    <TextInput id="username" type="text" value={currentUser.username} required  onChange={handleOnChange}/>
                </div>
                
                <div className='w-full'>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Your email" />
                    </div>
                    <TextInput id="email1" type="email" value={currentUser.email} required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password1" value="Your password" />
                    </div>
                    <TextInput id="password1" type="password" placeholder='password' required />
                </div>
                <Button outline gradientDuoTone="purpleToBlue" type="submit">Update</Button>
            </form>
            <div className='text-red-500 flex justify-between mt-4 font-semibold'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}

export default Dashprofile
