import Image from 'next/image'
import React from 'react'

import { inter, rubik } from '@/app/utils/fontConfig'
import { cn } from '@/components/cn'
import { user } from '@/app/utils'
const Friends = ({friend, i}:{friend:user,i:number}) => {
  return (
    <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
            <Image src={friend?.picture! || "/b.png"} alt='profile' width={100} height={100} className='rounded-full object-cover w-12 h-12' />
            <div 
            className={cn('flex flex-col', inter.className)}
            >
                <span className='2xl:text-[17px]'>{friend?.name?.split(' ')[0]}</span>
                <p className='text-[11px]'>@{friend.middlename}</p>
            </div>
        </div>
        <div 
        className={cn(`w-[25px] h-[25px] flex items-center justify-center text-white text-[11px] font-[400] rounded-full bg-[#BD3944]`, rubik.className)}
        >#{i + 1}</div>
    </div>
  )
}

export default Friends