'use client';
import React,{useState,useEffect} from 'react';
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import { useRouter } from 'next/navigation';
import {GlobalStateProvider} from "../components/Sign/GlobalState";
import V2fa from '../components/V2fa/V2fa';
import { fetchData } from '@/app/utils';

interface Props {children: React.ReactNode;}

function ContentWrapper({ children }: Props) {

    const [isAuth, setIsAuth] = useState("false");
    const [id, setId] = useState(-1);
  
    
  
    const router = useRouter();
    useEffect(() => {

      fetchData(`/auth/protected`, "GET", null)
      .then((res : any) => {
      
        if (!res)
          router.push('/');
        const data = res?.data;
        if (!data || data?.error === "Unauthorized" || data?.message === "Unauthorized")
          router.push('/');
        else
        {
          setId(data?.id);
          setIsAuth("true");
        }
      })
      .catch((error : any) => {
        router.push('/'); 
      });
    }, [router]);

  return (
    <GlobalStateProvider>
        <div className="w-full h-full flex ">
            {
                isAuth === "true" ? 
                <>
                    <Sidebar />
                    <div className="w-full flex flex-col overflow-y-auto">
                        <Navbar />
                        {children}
                    </div>
                </>
                :
                <div className='w-full h-full flex justify-center items-center'>
                    <div className="loader animate-loader"></div>
                </div>
            }
        </div>
    </GlobalStateProvider>
  );
}

export default ContentWrapper;