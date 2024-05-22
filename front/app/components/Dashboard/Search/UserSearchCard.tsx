'use client';
import React from 'react'
import Image from 'next/image';

const UserSearchCard = ({user, handleClick} : any) => {
    
  return (
    <div className="text-white rounded-md p-2 xl:w-1/4 md:w-1/2 sm:w-full h-1/6 flex justify-start items-center cursor-pointer" onClick={() => handleClick(user?.id)}>
        <Image
          src={user?.picture || "https://res.cloudinary.com/dxxlqdwxb/image/upload/v1713806275/kx6iknqyvu0uyqhhpfro.jpg"}
          alt="Picture of the author"
          width={100}
          height={100}
          className='rounded-full w-[50px] h-[50px] object-cover'
        />
        <div className='ml-2'>
            <h1 className='text-md'>{user?.name}</h1>
            <div className='flex'>
                <p className='text-[10px] w-[100%] overflow-hidden'>@{user?.nickname}</p>
            </div>
        </div>
    </div>
  )
}

export default UserSearchCard