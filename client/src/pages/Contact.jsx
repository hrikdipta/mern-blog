import React ,{useState}from 'react'
import {Label,TextInput,Textarea,Button,Alert,Spinner} from 'flowbite-react'
function Contact() {
  const[formData,setFormData]=useState({});
  const[error,setError]=useState(null);
  const[success,setSuccess]=useState(null);
  const[loading,setLoading]=useState(false);
  const handleSubmit=async(e)=>{
    setError(null);
    setSuccess(null);
    e.preventDefault();
    setLoading(true);
    try {
      const res= await fetch('/api/contact',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          name:`${formData.firstName} ${formData.lastName}`,
          email:formData.email,
          message:formData.message
        })
      })
      if(res.ok){
        setSuccess('Email sent successfully');
        setFormData({
          firstName:'',
          lastName:'',
          email:'',
          message:''
        });
        setLoading(false);
      }else{
        setError('An error occurred, please try again later')
        setLoading(false);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }
  return (
    <div className='max-w-7xl mx-auto p-4  md:mt-16 min-h-screen flex justify-evenly flex-col md:flex-row items-center md:items-start'>
      <div className='flex flex-col gap-10 mt-8'>
        <h2 className='text-4xl font-bold'>Contact Us</h2>
        <p className='text-md font-semibold'>Need to get in touch with us? fill out the form with your inquiry</p>
      </div>
      <div className=''>
        <form className='flex flex-col gap-3 max-w-md p-3 shadow-md dark:border-[1px]  border-gray-500 rounded-md' onSubmit={handleSubmit}>
          <div className='flex gap-2'>
              <div className="mb-2 w-full">
                <Label htmlFor="firstName" value="First Name" />
                <TextInput id="firstName" type="text" placeholder="John" required shadow value={formData.firstName} onChange={(e)=>{setFormData({...formData,firstName:e.target.value})}} />
              </div>
              <div className="mb-2 w-full">
                <Label htmlFor="lastName" value="Last Name" />
                <TextInput id="lastName" type="text" placeholder="Doe" required shadow value={formData.lastName} onChange={(e)=>{setFormData({...formData,lastName:e.target.value})}}/>
              </div>
          </div>
          <div className='max-w-md'>
            <div className="mb-2 block">
              <Label htmlFor="email2" value="Your email" />
            </div>
            <TextInput id="email2" type="email" placeholder="name@example.com" required value={formData.email} shadow onChange={(e)=>{setFormData({...formData,email:e.target.value})}}/>
          </div>
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Your message" />
            </div>
            <Textarea id="comment" placeholder="Leave a comment..." required rows={4} value={formData.message} onChange={(e)=>{setFormData({...formData,message:e.target.value})}}/>
          </div>
          <Button type='submit'  outline gradientDuoTone="cyanToBlue">
            {
              loading?<Spinner aria-label="Default status example" />:'Submit'
            }
          </Button>
        </form>
        {error && <Alert color='failure' className='mt-3'>{error}</Alert>}
        {success && <Alert color='success' className='mt-3'>{success}</Alert>}
      </div>
    </div>
  )
}

export default Contact
