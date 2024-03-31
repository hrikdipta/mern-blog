import React, { useState }  from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {signInStart,signInSuccess,signInFailure} from '../redux/User/userSlice'
import { Button, Label, TextInput ,Alert,Spinner} from 'flowbite-react';
import { Link ,useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';


function signIn() {
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const[formData,setFormData]=useState({});
  const {loading,error}=useSelector((state)=>state.user)

  const handleOnChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value.trim()})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData.email||!formData.password){
      return dispatch(signInFailure("All Fields are required"))
    }
    try {
      dispatch(signInStart());
      const res=await fetch('/api/auth/signin',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
      })
      const data =await res.json();
      if(data.success==false){
        dispatch(signInFailure(data.message))
      }
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }
  return (
    <div className='max-w-screen-xl mt-20 min-h-screen mx-auto'>
      <div className='flex max-w-5xl px-4 items-center justify-around mx-auto'>
        <div className='w-1/2 mx-6 hidden md:block'>
          <img className="w-full object-cover" src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7963.jpg" alt="login"  />
        </div>
        
        <div className='md:w-1/2 w-full max-w-sm'>
          <form className="flex  flex-col gap-4 " onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput id="email" name='email' type="email" placeholder="name@example.com" required onChange={handleOnChange} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1" value="Your password" />
              </div>
              <TextInput id="password1" name='password' type="password" required  onChange={handleOnChange}/>
            </div>

            <Button type="submit" disabled={loading===true}>
            {loading && <Spinner aria-label="Spinner button example" size="sm" />}
            {!loading && <span>Submit</span>}
            </Button>
            <OAuth/>
          </form>
          <p className='mt-4'>Don't have an account ? <span className='text-blue-500 hover:text-blue-900' ><Link to="/sign-up">Sign up </Link></span> </p>
          {error && <Alert color='failure' className='font-medium'>{error}</Alert>}
        </div>
      </div>
    </div>
  )
}

export default signIn
