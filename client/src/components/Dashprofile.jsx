import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Label, TextInput,Alert,Modal } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart,updateSuccess,updateFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signOutSuccess} from '../redux/User/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
function Dashprofile() {
    const storage = getStorage(app);
    const dispatch=useDispatch();
    const { currentUser,error:globalError,loading } = useSelector(state => state.user)
    const [image, setImage] = useState(null);
    const [ImageUrl, setImageUrl] = useState(null);
    const [imageUploading,setImageUploading]=useState(false);
    const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
    const [error,setError]=useState(null);
    const [imageUploadProgress,setImageUploadProgress]=useState(null);
    const [formdata,setFormdata]=useState({});
    const [showmodal, setShowmodal] = useState(false);
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg','image/gif'];
    
    const handleInputChange=(e)=>{
        setFormdata({...formdata,[e.target.name]:e.target.value});
        console.log(formdata)
    }
    const handleSubmit=async(e)=>{
        setError(null);
        setUpdateUserSuccess(null);
        e.preventDefault();
        if(Object.keys(formdata).length===0){
            return setError("Please change anything to update");
        }
        if(imageUploading){
            return;
        }
        try {
            dispatch(updateStart());
            const res= await fetch(`/api/user/update/${currentUser._id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formdata)
            })
            const data=await res.json();
            if(!res.ok){
                return dispatch(updateFailure(data.message))
            }
            dispatch(updateSuccess(data));
            setUpdateUserSuccess("User updated successfully");
            setFormdata({});
        } catch (error) {
            dispatch(updateFailure(error.message))
        }
        
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        if(!allowedFileTypes.includes(file.type)){
            return setError("Please select an image file (png,jpg,jpeg,gif)");
        }else if(file.size>2*1024*1024){
            return setError("File size must be less than 2 MB")
        }else{
            setImageUploadProgress(0);
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
        }
        
    }
    useEffect(() => {
        if (image) {
            uploadFile();
        }

    }, [image])

    const uploadFile = async () => {
        setError(null);
        setImageUploading(true);
        const fileName = Date.now() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask =  uploadBytesResumable(storageRef, image);
        uploadTask.on('state_changed',
            (snapshot) => {
                setImageUploadProgress(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            },
            (error) => {
                setError("File size must be less than 2 MB")
                setImageUploading(false);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                    setFormdata({...formdata,photoURL:downloadURL});
                });
                setImageUploading(false);
            }
        );

    }

    const handleDeleteUser=async()=>{
        setShowmodal(false);
        try {
            dispatch(deleteUserStart());
            const res=await fetch(`/api/user/delete/${currentUser._id}`,{
                method:'DELETE'
            })
            const data=await res.json();
            if(!res.ok){
                return dispatch(deleteUserFailure(data.message))
            }
            dispatch(deleteUserSuccess());
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignOut=async()=>{
        try {
            setError(null);
            const res=await fetch('/api/user/signout',{
                method:'POST'
            })
            const data=await res.json();
            if(!res.ok){
                return setError(data.message);
            }else{
                dispatch(signOutSuccess());
            }
        } catch (error) {
            setError(error.message);
        }
    }
    return (
        <div className='max-w-lg mx-auto w-full px-4 pt-6'>
            <h1 className='text-center text-3xl mb-4 font-semibold'>Profile</h1>
           
            <form className="flex  flex-col gap-4" onSubmit={handleSubmit}>
                <input type='file' accept='image/*' id='imageInput' onChange={handleImageChange} hidden />
                <div className='w-40 h-40 self-center relative' >
                    <label htmlFor="imageInput">
                        <img src={ImageUrl || currentUser.photoURL} className={`rounded-full w-full h-full border-4 border-red-500 object-cover cursor-pointer ${(imageUploadProgress && imageUploadProgress<100)?'opacity-25':null }`} alt="image description" />
                    </label>
                    {
                        (imageUploadProgress && imageUploadProgress<100) && (<CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`}
                        styles={{
                            root: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
                            path: { stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})` },
                            text: { fill: '#000', fontSize: '16px',fontWeight:'bold' },
                        }}
                        strokeWidth={5}
                    />)
                    }
                    
                </div>
                <div className='w-full'>
                    <div className="mb-2 block">
                        <Label htmlFor="username" value="Username" />
                    </div>
                    <TextInput id="username" name='username' type="text" defaultValue={currentUser.username}  onChange={handleInputChange} />
                </div>

                <div className='w-full'>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Your email" />
                    </div>
                    <TextInput id="email1" type="email" name='email' defaultValue={currentUser.email}  onChange={handleInputChange}/>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password1" value="Your password" />
                    </div>
                    <TextInput id="password1" type="password" name='password' placeholder='password'  onChange={handleInputChange} />
                </div>
                <Button outline gradientDuoTone="purpleToBlue" type="submit" disabled={imageUploading || loading}>
                    {loading ? 'Loading...' : 'Update'}
                </Button>
                {currentUser.isAdmin && (<Link to='/create-post' ><Button outline gradientDuoTone="purpleToBlue" type="button"  className='w-full'>Add Post</Button></Link>) }
            </form>
            <div className='text-red-500 flex justify-between my-4 font-semibold'>
                <span onClick={()=>{setShowmodal(true)}} className='cursor-pointer'>Delete Account</span>
                <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
            </div>
            {error && <Alert color='failure'>{error}</Alert>}
            {globalError && <Alert color='failure'>{globalError}</Alert>}
            {updateUserSuccess && <Alert color='success'>{updateUserSuccess}</Alert>}
            {showmodal &&
            <div>
                <Modal show={showmodal} size="md" onClose={() => setShowmodal(false)} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete Your Account?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" onClick={handleDeleteUser}>
                                    {"Yes, I'm sure"}
                                </Button>
                                <Button color="gray" onClick={() => setShowmodal(false)}>
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
            }
            
        </div>
    )
}

export default Dashprofile
