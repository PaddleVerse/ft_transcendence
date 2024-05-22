import React from 'react'
import Helder from '../../components/Dashboard/Settings/Helder'

const Settings = () => {
  return (
    <>
      <div className='w-full flex justify-center mt-[10px]'>
        <h1 className='mt-[40px] text-xl w-[94%] text-white font-extralight md:text-3xl lg:text-4xl' >Account settings</h1>
      </div>
      <div className='w-full h-full flex justify-center mt-[40px]'>
          <Helder />
      </div>
    </>
  )
}

export default Settings