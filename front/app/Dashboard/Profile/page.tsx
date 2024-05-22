'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import UserProfile from '@/app/components/Dashboard/Profile/UserProfile';
import axios from 'axios';
import { useGlobalState } from '@/app/components/Sign/GlobalState';
import { useRouter } from 'next/navigation';
import { fetchData, ipAdress } from '@/app/utils';

const Profile = () => {
  const searchParams = useSearchParams()
  const [targetUser, setTargetUser] = useState(null)
  const [is , setIs] = useState(false)
  const {state} = useGlobalState();
  const router = useRouter();
  const {socket , user}= state;
 
  const id = searchParams.get('id')

  if (user && id == user?.id)
    router.push('/Dashboard')
  
  useEffect(() => {
    socket?.on('ok', () => { setIs((prev) => !prev); })
    return () => { socket?.off('ok') }
  } , [socket])

  useEffect(() => {
    fetchData(`/user/${id}`, "GET", null).then((res) => {
      if (!res) return;
      if (res?.data === "") router.push('/Dashboard');
      setTargetUser(res.data)
    })
    .catch((err) => {
      router.push('/Dashboard')
    })
  } , [id, is])
  
  return (
    <>
        {
          (user && id != user?.id ) ?
            <div className="w-[100%] mt-[50px] flex flex-col gap-10 items-center">
              <div className="xl:flex-row w-[94%] flex flex-col gap-7">
              <div className="flex flex-col w-full gap-8">
                <UserProfile target={targetUser}/>
            </div>
          </div>
            </div>
          : 
          <div className='w-full h-full flex justify-center items-center'>
            <div className="loader animate-loader"></div>
          </div>
        }
    </>
  );
};

export default Profile;
