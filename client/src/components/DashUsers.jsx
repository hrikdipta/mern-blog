import React, { useEffect,useState } from 'react'
import {useSelector} from 'react-redux'
import { Table,Modal,Button,Alert } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck,FaTimes } from "react-icons/fa";
function DashUsers() {
  const currentUser = useSelector(state => state.user.currentUser);
  const[users,setusers]=useState([]);
  const[showMore,setShowMore]=useState(true);
  const[showDeleteModal,setShowDeleteModal]=useState(false);
  const[userIdToDelete,setuserIdToDelete]=useState(null);
  const[error,setError]=useState(null)
  useEffect(()=>{
    const fetchUsers=async()=>{
      const res=await fetch(`/api/user/getusers`)
      const data = await res.json();
      if(res.ok){
        setusers(data.allUsers)
        if(data.totalUsers<=9){
          setShowMore(false);
        }
      }
    }
    if(currentUser.isAdmin){
      fetchUsers()
    }
  },[currentUser._id])
  
  const handleShowMore=async()=>{
    const startIndex=users.length;
    try {
      const res=await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data=await res.json();
      if(!res.ok){
        setShowMore(false)
        return setError("something went wrong");
      }else{
        setusers([...users,...data.allUsers])
        if(data.allUsers.length<9){
          setShowMore(false);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  }
  const handleDeleteUser=async()=>{
    setShowDeleteModal(false);
    if(!userIdToDelete) return;
    try {
        const res=await fetch(`/api/user/delete/${userIdToDelete}`,{
            method:"DELETE"
        })
        if(!res.ok){
            setError("something went wrong")
        }
        setusers((prev)=>(prev.filter((user)=>(user._id!==userIdToDelete))))
    } catch (error) {
        setError(error.message)
    }
  }
  if(!currentUser.isAdmin) return null;
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        (currentUser.isAdmin && users.length===0) ?<div className='text-md'>You don't have any user to show here</div>:
          <Table hoverable className='shadow-md'>
            <Table.Head className='w-full'>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>User Name</Table.HeadCell>
              <Table.HeadCell>User Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell><span className="sr-only">Delete</span></Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {
                users.map(user => (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={user._id}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {user.updatedAt.substring(0, 10).split('-').reverse().join('-')}
                    </Table.Cell>
                    <Table.Cell>
                        <img className='max-w-12 max-h-12 rounded-full object-cover bg-slate-500' src={user.photoURL} alt={user.username}/>
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      {
                        user.isAdmin?<FaCheck className='text-green-500'/>:<FaTimes className='text-red-500'/>
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <span onClick={()=>{setShowDeleteModal(true);setuserIdToDelete(user._id)}} className="font-medium text-red-600 hover:underline dark:text-red-500 cursor-pointer">
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
      }
      <Modal show={showDeleteModal} size="md" onClose={() => setShowDeleteModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => {setShowDeleteModal(false);setuserIdToDelete(null)}}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {
        showMore && <button onClick={handleShowMore} className='text-teal-500 px-4 py-4 self-center w-full'>Show more</button>
      }
      {error && <Alert>{error}</Alert>}
    </div>
  )
}

export default DashUsers
