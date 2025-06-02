import React, { useState } from 'react'
import { Modal, TextInput, Button,Alert,Spinner } from 'flowbite-react';
import {signInStart,signInSuccess,signInFailure} from '../redux/User/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
const OtpModal = ({ showModal, setOpenModal, formData }) => {
    const navigate = useNavigate();
    const dispatch=useDispatch();

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // console.log(formData)
    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        if (otp === '') {
            return;
        }
        try {
            setLoading(true);
            dispatch(signInStart());
            setError(null);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ ...formData, otp })
            })
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (!res.ok) {
                setError(data.message);
                dispatch(signInFailure(data.message));
                return;
            } else {
                dispatch(signInSuccess(data));
                navigate('/?login=true');
            }
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div>
            <Modal show={showModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <div className='max-w-60 mx-auto flex flex-col gap-5'>
                            <h1 className='text-xl text-center text-gray-700'>Enter Your OTP</h1>
                            <TextInput id="otp" type="text" placeholder="Enter OTP" required onChange={(e)=>{setOtp(e.target.value)}} />
                            <Button color="blue" className='mb-6' onClick={handleSubmitOtp}>{loading ? <Spinner aria-label="Default status example" /> : "Submit"}</Button>
                        </div>
                    </div>
                    {error && 
                        <Alert color="failure" >
                            <span className="font-medium">{error}</span> 
                        </Alert>
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default OtpModal
