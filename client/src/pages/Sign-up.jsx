import React from 'react'
import { Button, Label, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
function SignUp() {
  return (
    <div className='max-w-screen-xl mt-20 min-h-screen mx-auto'>
      <div className='flex max-w-5xl px-4 items-center justify-around mx-auto'>
        <div className='w-1/2 mx-6 hidden md:block'>
          <img className="w-full object-cover" src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7963.jpg" alt="login"  />
        </div>
        
        <div className='md:w-1/2 w-full max-w-sm'>
          <form className="flex  flex-col gap-4 ">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput id="username" name='username' type="text" placeholder="John Doe" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput id="email" name='email' type="email" placeholder="name@flowbite.com" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Your password" />
              </div>
              <TextInput id="password1" name='password' type="password" required />
            </div>

            <Button type="submit">Submit</Button>
          </form>
          <p className='mt-4'>Already have an account ? <span className='text-blue-500 hover:text-blue-900' ><Link to="/login">Log in </Link></span> </p>
        </div>
      </div>

    </div>

  )
}

export default SignUp
