import React from 'react'
import {Label,TextInput,Textarea,Button} from 'flowbite-react'
function Contact() {
  return (
    <div className='max-w-7xl mx-auto p-4 mt-16 min-h-screen flex justify-evenly'>
      <div className='flex flex-col gap-10 mt-8'>
        <h2 className='text-4xl font-bold'>Contact Us</h2>
        <p className='text-md font-semibold'>Need to get in touch with us? fill out the form with your inquiry</p>
      </div>
      <div className=''>
        <form className='flex flex-col gap-3 max-w-md p-3 shadow-md dark:border-[1px]  border-gray-500 rounded-md'>
          <div className='flex gap-2'>
              <div className="mb-2 w-full">
                <Label htmlFor="firstName" value="First Name" />
                <TextInput id="firstName" type="text" placeholder="John" required shadow />
              </div>
              <div className="mb-2 w-full">
                <Label htmlFor="lastName" value="Last Name" />
                <TextInput id="lastName" type="text" placeholder="Doe" required shadow />
              </div>
          </div>
          <div className='max-w-md'>
            <div className="mb-2 block">
              <Label htmlFor="email2" value="Your email" />
            </div>
            <TextInput id="email2" type="email" placeholder="name@example.com" required shadow />
          </div>
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Your message" />
            </div>
            <Textarea id="comment" placeholder="Leave a comment..." required rows={4} />
          </div>
          <Button outline gradientDuoTone="cyanToBlue" >Submit</Button>
        </form>
      </div>
    </div>
  )
}

export default Contact
