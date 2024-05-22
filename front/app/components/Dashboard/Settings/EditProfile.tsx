'use client';
import React, { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form';
import { useGlobalState } from '../../Sign/GlobalState';
import toast from "react-hot-toast";
import { cn } from "@/components/cn";
import { Label } from "@/components/ui/newlabel";
import { Input } from "@/components/ui/newinput";
import { fetchData, ipAdress, getCookie } from '@/app/utils';

import axios from 'axios';
import { set } from 'lodash';

const accessToken = getCookie("access_token");

const EditProfile = () => {
  const { state, dispatch } = useGlobalState();
  const { user } = state;

  const { register, handleSubmit, reset } = useForm();

  const [isErrorName, setIsErrorName] = useState(false);
  const [isErrorMiddlename, setIsErrorMiddlename] = useState(false);
  const [errorName, setErrorName] = useState('');
  const [errorMiddlename, setErrorMiddlename] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [LoadingImg, setLoadingImg] = useState(false);
  
  const refreshUser = async () => {
    try {
      const response : any = await fetchData(`/user/${user?.id}`, 'GET', null);
      if (!response) return;
      const usr = response.data;
      dispatch({type: 'UPDATE_USER', payload: usr});
    } catch (error) {
      toast.error('Error updating user');
    }
  }

  const serverError = (err: any) => {
    err.map((e: any) => {
      if (e.startsWith('Name')) {
        setIsErrorName(true);
        setErrorName(e);
      }
      if (e.startsWith('Middlename')) {
        setIsErrorMiddlename(true);
        setErrorMiddlename(e);
      }
    });
  }
  
  const onSubmit = (data : any) => { 

    fetchData(`/user/${user?.id}`, 'PUT', data)
    .then((res: any) => {
      if (!res) return;
      if (res?.data !== '')
      {
        toast.success('User updated successfully');
        setIsErrorMiddlename(false);
        setIsErrorName(false);
        refreshUser();
        reset();
      }
    })
    .catch((err) => {
      setIsErrorName(false); setIsErrorMiddlename(false);
      serverError(err.response.data.message);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return; // Handle empty selection

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type. Please select a valid image file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB
      toast.error('File is too large. Please select an image under 15MB.');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };



  const handleUpload = async () => {
    if (!selectedFile || !accessToken) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);
      await fetchData(`/user/img/${user?.id}`, 'PUT', formData);
      toast.success('Profile picture updated successfully');
      refreshUser();
      setSelectedFile(null);
    } catch (error) {
      toast.error('Error updating profile picture');
    } finally { 
      setLoading(false);
    }
  };


  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-col gap-2 justify-start'>
        <h1 className='text-xl text-white font-light'> Account </h1>
        <p className='text-[#c2c2c2] text-sm font-light'>Information necessary for your account</p>
      </div>

      <div className='mt-20 flex items-center justify-between w-full border-b-[0.5px] border-white pb-10'>
        <div className='flex items-center'>
          {user ?
            <div className=' relative'>
              <Image priority src={preview || user?.picture} alt='profile' 
                width={200} height={200}
                onLoad={() => setLoadingImg(true)}
                className={`object-cover h-[120px] w-[120px] rounded-full ${LoadingImg ? 'block' : 'invisible'}`}
              />
              <div className={` absolute top-0 flex items-center justify-center bg-gray-400 h-[120px] w-[120px] rounded-full  animate-pulse ${LoadingImg ? 'hidden' : 'block'}`}>
                <svg
                  className="w-10 h-10 text-gray-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                  >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
            </div>
            :
            <div className={`flex items-center justify-center bg-gray-400 h-[120px] w-[120px] rounded-full  animate-pulse`}>
              <svg
                className="w-10 h-10 text-gray-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
          }
          <div className='flex flex-col gap-1 ml-10'>
            <h1 className='sm:text-md text-sm text-white font-light sm:flex hidden'>Profile Picture</h1>
            <p className='text-[#c2c2c2] text-sm font-light sm:flex hidden'>PNG, JPEG under 15MB</p>
          </div>
        </div>
        <div className=' flex gap-3 sm:flex-row flex-col'>
          <label htmlFor="uploadFile1"
            className="bg-white hover:bg-gray-200 text-[#000000] text-sm px-4 py-2.5 outline-none rounded w-max cursor-pointer mx-auto block font-[sans-serif]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 mr-2 fill-[#000000] inline" viewBox="0 0 32 32">
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000" />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000" />
            </svg>
              Upload an image
            <input type="file" accept="image/*" id='uploadFile1' className="hidden" onChange={handleFileChange}/>
          </label>
          <button className='text-[#000000] flex justify-center items-center font-light bg-[#eeeeeecd] p-2 rounded-lg w-20' onClick={handleUpload}>
            {loading ? <div className="loader_"></div> : "Save"}
          </button> 
        </div>
      </div>
      <div className='w-full'>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex sm:flex-row flex-col justify-between sm:items-end sm:gap-20 mt-10'>
            <div className='flex flex-col gap-2 sm:w-1/3 w-full'>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" type="text" {...register('name')}/>
                {isErrorName && <p className='text-red-500 text-sm font-light'>{errorName}</p>}
              </LabelInputContainer>
            </div>
            <div className='flex flex-col gap-2 sm:w-1/3 w-full'>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="middlename">middlename</Label>
                <Input id="middlename" placeholder="Enter your middlename" type="text" {...register('middlename')}/>
                {isErrorMiddlename && <p className='text-red-500 text-sm font-light'>{errorMiddlename}</p>}
              </LabelInputContainer>
            </div>
          </div>
          <div className='flex flex-col mt-10 w-1/6'>
            <button type='submit' className='text-[#000000] font-light bg-white p-2 sm:w-[80%] rounded-xl w-[100px]'>Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};