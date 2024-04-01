import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { signInSuccess, signInFailure, signInStart } from '../redux/User/userSlice'
import { app } from '../firebase'
import { useNavigate } from 'react-router-dom';
function OAuth() {
  const navigate=useNavigate();
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    try {
      dispatch(signInStart());
      const resultFromGoogle = await signInWithPopup(auth, provider);
      //console.log(result.user)
      const res=await fetch('/api/auth/google',{
        method:'POST',
        headers:{
          "Content-Type":'application/json'
        },
        body:JSON.stringify({
          username:resultFromGoogle.user.displayName,
          email:resultFromGoogle.user.email,
          photoURL:resultFromGoogle.user.photoURL
        })
      })
      const data=await res.json();
      //console.log(data)
      if(!res.ok ||data.success==false){
        return dispatch(signInFailure(data.message))
      }
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/');
      }
    }
     catch (error) {
    //console.log(error.message);
    dispatch(signInFailure(error.message));
  }
}
return (
  <div>
    <Button type='button' outline gradientDuoTone="pinkToOrange" className='w-full flex gap-8' onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      <span>Continue with Google</span>
    </Button>
  </div>
)
}

export default OAuth
