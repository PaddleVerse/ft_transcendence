import Image from 'next/image'
import React from 'react'
import { rajdhani } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";
import { fetchData } from '@/app/utils';

const ScoreBar = ({score}:any) => {
  return (
    <div 
    style={{
        transform: "translateX(-50%)",
      }}
      className={cn(
        "bg-[#538cdc5c] w-[400px] justify-around items-center flex px-4 py-2 rounded-br-lg rounded-bl-lg absolute text-white text-xl mx-auto top-[55px] ml-[118px] font-[500]",
        rajdhani.className
      )}
    >
        <div className='flex gap-2 justify-center items-center'>
            <p className='pl-6 text-3xl'>{score?.player1}</p>
        </div>
        <p className='text-3xl'>-</p>
        <div className='flex gap-2 justify-center items-center'>
            <p className='pr-6 text-3xl'>{score?.player2}</p>
        </div>
    </div>
  )
}

export default ScoreBar