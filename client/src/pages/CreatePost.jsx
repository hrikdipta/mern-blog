import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {TextInput,Select,FileInput,Button,Alert} from 'flowbite-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {app} from '../firebase'
import { useNavigate } from 'react-router-dom';
function CreatePost() {
    const storage = getStorage(app);
    const navigate=useNavigate();
    const [value,setValue]=useState('');
    const [formData,setFormData]=useState({});
    const [image,setImage]=useState(null);
    const [imageUploadError,setImageUploadError]=useState(null);
    const [error,setError]=useState(null);
    const [imageUploading,setImageUploading]=useState(false);
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleFileChange=(e)=>{
        const file=e.target.files[0];
        if(!file){
            return setImageUploadError('Please select an image');
        } 
        setImage(file);
        setImageUploadError(null);
    }
    const handleImageUpload=()=>{
        if(!image){
            return setImageUploadError('Please select an image');
        }
        if(!allowedTypes.includes(image.type)){
            return setImageUploadError('File type not supported');
        }
        const fileName=(Date.now()+image.name).split(' ').join('');
        const storageRef=ref(storage,fileName);
        const uploadTask=uploadBytesResumable(storageRef,image);
        uploadTask.on('state_changed',
            (snapshot) => {
                setImageUploading(true);
                setImageUploadError(null);
            },
            (error) => {
                setImageUploading(false);
                setImageUploadError('An error occured while uploading the image')
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUploading(false);
                    setImageUploadError(null)
                    setFormData({...formData,image:downloadURL})
                });
            }
        );
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError(null);
        if(!formData.title || formData.title.trim().length===0){
            return setError('Title is required');
        }
        if(!value||value.trim().length===0){
            return setError('Content is required');
        }
        try {
            let data={
                ...formData,
                content:value
            }
            const res=await fetch('/api/post/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            const result = await res.json();
            if(!res.ok){
                return setError(result.message);
            }
            setError(null);
            navigate(`/post/${result.slug}`);

        } catch (error) {
            setError('An error occured while creating the post')
        }
    }
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-2xl md:text-3xl my-4 font-semibold'>Create a Post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col md:flex-row gap-4 justify-between' >
                    <TextInput id="title" name='title' type="text" placeholder="Title" required className='flex-auto' onChange={handleChange} />
                    
                    <Select onChange={handleChange} name='catagory'>
                        <option value='uncatagorized'>Select a catagory</option>
                        <option value='javascript'>Javascript</option>
                        <option value='python'>Python</option>
                        <option value='react.js'>React JS</option>
                        <option value='node.js'>Node JS</option>
                    </Select>
                </div>
                <div className='px-2 py-3 border-2 border-red-500 border-dashed flex gap-2 justify-between items-center'>
                    <FileInput id="file" type='file' accept='image/*' onChange={handleFileChange} />
                    <Button outline gradientDuoTone="purpleToBlue" size='sm' onClick={handleImageUpload} >
                        {imageUploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                </div>
                {
                    imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>
                }
                {
                    formData.image && <img src={formData.image} alt="post Image" className='w-full h-72 object-cover rounded-md' />
                }
                <ReactQuill theme="snow" value={value} onChange={setValue}  className='h-72 mb-5' required/>
                <Button type='submit' outline gradientDuoTone="purpleToBlue" className='mt-5' disabled={imageUploading}  >Publish</Button>
            </form>
            {
                error && <Alert color='failure' className='mt-5'>{error}</Alert>
            }
        </div>
    )
}

export default CreatePost
