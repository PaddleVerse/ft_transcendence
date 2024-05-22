"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";


import EnterCode from "../Dashboard/Settings/otp";
import axios from "axios";
import { useState } from "react";
import { ipAdress } from "@/app/utils";


export default function V2fa({setIsTwoFa, userId} : any) {
  
  const { register, handleSubmit , reset} = useForm();
  const [is , setIs] = useState(false);

 const onSubmit = (data:any) => {
  if (userId === -1) return;


  axios.post(`http://${ipAdress}/auth/v2fa`, {
    token : data?.code,
    userId : userId
  }).then((res:any) => {
    if (res?.data?.ok) setIsTwoFa("true");
    else setIs(true);
  })
  .catch(err => {})
  reset();
 };
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="md:w-[480px] pb-[40px] sm:pb-[50px] bg-primaryColor flex flex-col items-center rounded-2xl md:rounded-lg w-[310px] xm:w-[370px] select-none ring-[0.4px] ring-red-500">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-center items-center pt-10">
            <motion.h1
            className='text-red-500 lg:text-3xl md:text-3xl text-2xl font-semibold mb-2 sm:mb-0 text-center'
            >
            Two-Factor Authentication
          </motion.h1>
            <div className="bg-gradient-to-r from-transparent via-neutral-500 to-transparent mt-4 h-[1px] w-full" />
            <p className='w-4/5 text-[#c2c2c2] text-center text-sm font-light mt-4'>Use a phone app like google Authenticator, or Microsoft Authenticator, etc. to get 2FA codes when prompted during sign-in.</p>
            <label className='text-white font-light mt-4 mb-2'>Verify the code from the app.</label>
            <EnterCode register={register} isError={is} reset={false}/>
            <div className="w-full flex items-center justify-center">
            <button
              className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-[80%] mt-4 text-black rounded-md h-10 font-medium shadow-input bg-zinc-800"
              type="submit"
            >
              <span className="text-neutral-300 text-sm">
                Submit
              </span>
              <BottomGradient />
            </button>
            </div>
          </div>
        </form>
        <div className="bg-gradient-to-r from-transparent via-neutral-500 to-transparent mt-4 h-[1px] w-full" />
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};