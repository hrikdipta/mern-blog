import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {signInFailure } from '../redux/User/userSlice'
const VerifyUser = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const verifyUser= async()=>{
            const res= await fetch('/api/auth/verifyuser',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
            })
            const data = await res.json();
            if(!res.ok){
                dispatch(signInFailure(data.message));
            }
        }
        verifyUser();
    },[])
  return null;
}

export default VerifyUser
