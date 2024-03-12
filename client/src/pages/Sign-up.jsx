import React, { useState } from 'react'
import { Button, Label, TextInput ,Alert,Spinner} from 'flowbite-react';
import { Link ,useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';


function SignUp() {
  const [formData,setFormData]=useState({});
  const[error,setError]=useState(null);
  const[loading,setLoading]=useState(false);
  const navigate=useNavigate();

  const handleOnChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value.trim()})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setError('All fields are required')
    }
    try {
      setLoading(true);
      setError(null);
      const res=await fetch('/api/auth/signup',{
        method:'POST',
        headers:{
          "Content-Type":'application/json'
        },
        body:JSON.stringify(formData)
      })
      const data=await res.json();

      if(data.success==false){
        setError(data.message)
      } 
      setLoading(false);
      if(data.success!==false){
        navigate('/sign-in')
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput id="username" name='username' type="text" placeholder="John Doe" required  onChange={handleOnChange}/>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput id="email" name='email' type="email" placeholder="name@flowbite.com" required onChange={handleOnChange} />
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
          <p className='mt-4'>Already have an account ? <span className='text-blue-500 hover:text-blue-900' ><Link to="/sign-in">Sign in </Link></span> </p>
          {error && <Alert color='failure' className='font-medium'>{error}</Alert>}
        </div>
      </div>

    </div>

  )
}

export default SignUp
