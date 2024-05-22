"use client";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "../../components/cn";
import { Input } from "../../components/ui/newinput";
import { Label } from "../../components/ui/newlabel";
import { ipAdress } from "@/app/utils";

import BottomGradient from "@/components/ui/bottomGradiant";
import {
  IconBrandGoogle
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";


export default function SignupFormDemo() {
  const [is, setIs] = useState({
    name: false,
    middlename: false,
    nickname: false,
    password: false,
  });
  
  const [error, setError] = useState({
    name: "",
    middlename: "",
    nickname: "",
    password: "",
  });
  const form = useForm();
  const router = useRouter();

  const updateIs = (key:string, value:boolean) => {
    setIs(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updateError = (key:string, value:string) => {
    setError(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  const serverError = (err: any) => {
    try {
      err?.map((e: any) => {
        if (e.startsWith('Name')) {
          updateIs('name', true);
          updateError('name', e);
        } 
        if (e.startsWith('Middlename')) {
          updateIs('middlename', true);
          updateError('middlename', e);
        }
        if (e.startsWith('Nickname')) {
          updateIs('nickname', true);
          updateError('nickname', e);
        }
        if (e.startsWith('Password')) {
          updateIs('password', true);
          updateError('password', e);
        }
      });
    } catch (error) {}
  }

  function onSubmit(values : any) {
    axios.post(`http://${ipAdress}/auth/signup`, {
      name: values.name,
      middlename: values.middlename,
      nickname: values.nickname,
      password: values.password
    }).then((res) => {
      if (res?.data?.status === 'success')
      {
        form.reset();
        router.push("/Signin");
      }else if (res?.data?.status === 'error_'){
        setIs({name: false, middlename: false, nickname: false, password: false})
        setError({name: "", middlename: "", nickname: "", password: ""});
        serverError(["Nickname already exist."]);
      }
    })
    .catch((err) => {
      if (err && err?.response){
        setIs({name: false, middlename: false, nickname: false, password: false})
        setError({name: "", middlename: "", nickname: "", password: ""});
        serverError(err.response?.data?.message);
      }
    });
  }


  const handleGoogle = () => {
    router.push(`http://${ipAdress}/auth/google`);
  }

  const handle42 = () => {
      router.push(`http://${ipAdress}/auth/42`);
  }

  return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="max-w-md lg:w-full w-[80%] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-[#101823] ring-[0.2px] ring-red-500 z-10">
          <motion.h1
              className='text-red-500 lg:text-4xl md:text-3xl text-2xl font-semibold mb-2 sm:mb-0 text-center'
            >
              Register
            </motion.h1>

          <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="firstname">Name</Label>
                <Input id="firstname" placeholder="Tyler" type="text" {...form.register('name')}/>
                {(is.name) && <p className="text-red-500 text-sm my-4">{error.name}</p>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">middlename</Label>
                <Input id="lastname" placeholder="Durden" type="text" {...form.register('middlename')}/>
                {(is.middlename) && <p className="text-red-500 text-sm my-4">{error.middlename}</p>}
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="nickname">nickname</Label>
              <Input id="nickname" placeholder="Tyler_durden" type="text" {...form.register('nickname')}/>
              {is.nickname && <p className="text-red-500 text-sm my-4">{error.nickname}</p>}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="••••••••" type="password" {...form.register('password')}/>
              {is.password && <p className="text-red-500 text-sm my-4">{error.password}</p>}
            </LabelInputContainer>
            <button
              className="bg-gradient-to-br relative group/btn bg-[#192536] bloc w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Sign up &rarr;
              <BottomGradient />
            </button>

            <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

            <div className="flex flex-col space-y-4">
              <button
                className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-[#192536]"
                type="button"
                onClick={handle42}
              >
                <Image alt="42" src="/Apple Logo.svg" className="w-5" width={100} height={100} />
                <span className="text-neutral-300 text-sm">
                  Intra 42
                </span>
                <BottomGradient />
              </button>
              <button
                className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-[#192536]"
                type="button"
                onClick={handleGoogle}
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
                <span className="text-neutral-300 text-sm">
                  Google
                </span>
                <BottomGradient />
              </button>
            </div>
          </form>
          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          <div className="w-full flex justify-between">
            <Label className="text-gray-300 text-sm" >Already have an account?</Label>
            <Link href='/Signin' className="text-gray-300 text-sm" >Sign In &rarr;</Link>
          </div>
        </div>
      </div>
  );
}

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
