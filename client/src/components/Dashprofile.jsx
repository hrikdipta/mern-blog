import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Label, TextInput,Alert } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
function Dashprofile() {
    const storage = getStorage(app);
    const { currentUser } = useSelector(state => state.user)
    const [image, setImage] = useState(null);
    const [ImageUrl, setImageUrl] = useState(null);
    const[error,setError]=useState(null);
    const[imageUploadProgress,setImageUploadProgress]=useState(null);
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg','image/gif'];

    const handleOnChange = (e) => {

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
        const fileName = Date.now() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask =  uploadBytesResumable(storageRef, image);
        uploadTask.on('state_changed',
            (snapshot) => {
                setImageUploadProgress(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            },
            (error) => {
                setError("File size must be less than 2 MB")
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                });
            }
        );

    }
    return (
        <div className='max-w-lg mx-auto w-full px-4 pt-6'>
            <h1 className='text-center text-3xl mb-4 font-semibold'>Profile</h1>
           
            <form className="flex  flex-col gap-4">
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
                    <TextInput id="username" type="text" value={currentUser.username} required onChange={handleOnChange} />
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
            {error && <Alert color='failure'>{error}</Alert>}
        </div>
    )
}

export default Dashprofile
