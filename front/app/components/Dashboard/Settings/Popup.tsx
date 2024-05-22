'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { Label } from "@/components/ui/newlabel";
import { cn } from "@/components/cn";
import { Input } from "@/components/ui/newinput";
import { useGlobalState } from '../../Sign/GlobalState';
import { fetchData } from '@/app/utils';

const Popup = ()  => {

  const [is, setIs] = useState(0);
  const [error, setError] = useState("");

  const [isErrorName, setIsErrorName] = useState(false);
  const [isErrorMiddlename, setIsErrorMiddlename] = useState(false);
  const [errorName, setErrorName] = useState('');
  const [errorMiddlename, setErrorMiddlename] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const {register, handleSubmit, reset} = useForm();
  const {state, dispatch} = useGlobalState();
  const {user} = state;

  
  const serverError = (err: any) => {
    try {
      err?.map((e: any) => {
        if (e.startsWith('Name')) {
          setIsErrorName(true);
          setErrorName(e);
        } 
        if (e.startsWith('Middlename')) {
          setIsErrorMiddlename(true);
          setErrorMiddlename(e);
        }
      });
    } catch (error) {}
  }

  const refreshUser = async () => {
    try {
      const response : any = await fetchData(`/user/${user?.id}`, 'GET', null);
      if (!response) return;
      const usr = response.data;
      dispatch({type: 'UPDATE_USER', payload: usr});
    } catch (error) {
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return; // Handle empty selection

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB
      alert('Image size must be less than 15MB.');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (is === 1)
      setError("Name must be at least 3 characters long and at most 20 characters long.");
    else if (is === 2)
      setError("Middlename must be at least 3 characters long and at most 20 characters long.");
    else
      setError("");
  }, [is]);

  const isValidValues = (value: any) => {
    if (value?.name.length < 3 || value?.name.length > 20)
      return 1;
    else if (value?.middlename.length < 3 || value?.middlename.length > 20)
      return 2;
    return 0;
  };

  const onSubmit = async (data: any) => {
    // if (isValidValues(data) !== 0) {
    //   setIs(isValidValues(data));
    //   return;
    // }
  
  
    const formData = new FormData();
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
  
    try {
      let imgUpdateResponse;
      if (selectedFile) {
        imgUpdateResponse = await fetchData(`/user/img/${user?.id}`, 'PUT', formData);
      }
  
      const userUpdateResponse = await fetchData(`/user/${user?.id}`, 'PUT', data);
      
      if (!selectedFile || (imgUpdateResponse && imgUpdateResponse.data !== ''))
        if (selectedFile) setSelectedFile(null);
  
      if (userUpdateResponse && userUpdateResponse.data !== '') {
        reset();
        refreshUser();
      }
  
      const visibilityUpdateResponse = await fetchData(`/user/visible/${user?.id}`, 'PUT', { first_time: false });
  
      if (visibilityUpdateResponse.data !== '') {
        refreshUser();
        reset();
      }
    } catch (error:any) {
      if (error?.response?.status === 400)
      {
          setIsErrorName(false); setIsErrorMiddlename(false);
          serverError(error.response.data.message);
      }
    }
  };
  

  if (!user || (user && user?.first_time === false)) return null;

  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center">
      <div className="absolute  inset-0 bg-[#151e2b] bg-opacity-80"></div>
      <div className="relative z-10 w-[350px]">
        <div className="max-w-md lg:w-full w-[80%]  mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-[#151e2b] ring-[0.2px] ring-red-500 z-10">
          <div className='flex flex-col items-center justify-center w-full py-8 px-4'>
            <div className='flex items-center'>
             {user ? 
                <Image priority src={preview || user?.picture} alt='profile' width={200} height={200} className="object-cover h-[120px] w-[120px] rounded-full" />
                :
                <div className="flex items-center justify-center  h-[120px] w-[120px] bg-gray-400 rounded-full  animate-pulse">
                  <svg className="w-10 h-10 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                  </svg>
                </div>
             }
            </div>
            <label htmlFor="uploadFile1"
                className="bg-[#FF5866] hover:bg-[#ff6774] text-white text-sm px-4 py-2.5 outline-none rounded w-max cursor-pointer mx-auto block font-[sans-serif] mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 mr-2 fill-white inline" viewBox="0 0 32 32">
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
            <div className="bg-gradient-to-r from-transparent via-neutral-400 to-transparent mt-8 h-[1px] w-full" />
            <div className='w-full'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='flex flex-col justify-center items-end mt-10'>
                    <div className='flex flex-col gap-2 w-full'>
                      <LabelInputContainer className="mb-4">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter your name" type="text" {...register('name')}/>
                        {/* {(is === 1) && <p className="text-red-500 text-[12px] my-4">{error}</p>} */}
                        {(isErrorName) && <p className="text-red-500 text-[12px] my-4">{errorName}</p>}
                      </LabelInputContainer>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <LabelInputContainer className="mb-4">
                        <Label htmlFor="middlename">Middlename</Label>
                        <Input id="middlename" placeholder="Enter your middlename" type="text" {...register('middlename')}/>
                        {/* {(is === 2) && <p className="text-red-500 text-[10px] my-4">{error}</p>} */}
                        {(isErrorMiddlename) && <p className="text-red-500 text-[10px] my-4">{errorMiddlename}</p>}
                      </LabelInputContainer>
                    </div>
                  </div>
                  <div className='flex flex-col justify-center items-center mt-4 w-full'>
                    <button className="relative inline-flex items-center justify-start px-20 py-3 overflow-hidden font-medium transition-all bg-[#FF5866] rounded-2xl group">
                      <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-[#ff3b4b] rounded group-hover:-mr-4 group-hover:-mt-4">
                        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2"></span>
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full bg-[#ff3b4b] rounded-2xl group-hover:mb-12 group-hover:translate-x-0"></span>
                      <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">Save</span>
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;

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