import React, { useEffect, useState,useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import {TextInput,Select,FileInput,Button,Alert} from 'flowbite-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {app} from '../firebase'
import { useNavigate,useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
function UpdatePost() {
    const storage = getStorage(app);
    const editorRef = useRef(null);
    const navigate=useNavigate();
    const [formData,setFormData]=useState({});
    const [image,setImage]=useState(null);
    const [imageUploadError,setImageUploadError]=useState(null);
    const [error,setError]=useState(null);
    const [imageUploading,setImageUploading]=useState(false);
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const {postId}=useParams();
    const {currentUser} =useSelector((state)=>state.user)
    console.log(formData)
    useEffect(()=>{
        try {
            const fetchPost=async()=>{
                const res=await fetch(`/api/post/getposts?postId=${postId}`)
                const data=await res.json();
                if(!res.ok){
                    return setError("error");
                    
                }
                setFormData(data.posts[0]);
                
            }
            fetchPost();
        } catch (error) {
            console.log(error)
        }
    },[postId])

    
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
        if(!formData.content || formData.content.trim().length===0){
            return setError('Content is required');
        }
        try {
            const res=await fetch(`/api/post/update/${postId}/${currentUser._id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const result = await res.json();
            if(!res.ok){
                return setError(result.message);
            }
            setError(null);
            navigate(`/post/${result.slug}`);

        } catch (error) {
            setError('An error occured while updating the post')
        }
    }
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-2xl md:text-3xl my-4 font-semibold'>Update Post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col md:flex-row gap-4 justify-between' >
                    <TextInput id="title" name='title' type="text" placeholder="Title" required className='flex-auto' value={formData.title} onChange={(e)=>{setFormData({...formData,[e.target.name]:e.target.value})}} />
                    
                    <Select  name='catagory' value={formData.catagory} onChange={(e)=>{setFormData({...formData,[e.target.name]:e.target.value})}}>
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
                <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={formData.content}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount' ,'codesample'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent codesample | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }',
                        
                    }}
                    
                    onEditorChange={()=>{setFormData({...formData,content:(editorRef.current && editorRef.current.getContent())})}}
                    
                />
                <Button type='submit' outline gradientDuoTone="purpleToBlue" className='mt-5' disabled={imageUploading}>Update</Button>
            </form>
            {
                error && <Alert color='failure' className='mt-5'>{error}</Alert>
            }
        </div>
    )
}

export default UpdatePost
