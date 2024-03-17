import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {TextInput,Select,FileInput,Button} from 'flowbite-react';
function CreatePost() {
    const [value,setValue]=useState('');
    console.log(value)
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-2xl md:text-3xl my-4 font-semibold'>Create a Post</h1>
            <form className='flex flex-col gap-4'>
                <div className='flex flex-col md:flex-row gap-4 justify-between' >
                    <TextInput id="title" name='title' type="text" placeholder="Title" required className='flex-auto' />
                    <Select>
                        <option value='uncatagorized'>Select a catagory</option>
                        <option value='javascript'>Javascript</option>
                        <option value='python'>Python</option>
                        <option value='react.js'>React JS</option>
                        <option value='node.js'>Node JS</option>
                    </Select>
                </div>
                <div className='px-2 py-3 border-2 border-red-500 border-dashed flex gap-2 justify-between items-center'>
                    <FileInput id="file" type='file' accept='image/*'  />
                    <Button outline gradientDuoTone="purpleToBlue" size='sm'>
                        Upload Image
                    </Button>
                </div>
                <ReactQuill theme="snow" value={value} onChange={setValue}  className='h-72 mb-5' required/>
                <Button type='submit' outline gradientDuoTone="purpleToBlue" className='mt-5' >Publish</Button>
            </form>
        </div>
    )
}

export default CreatePost
