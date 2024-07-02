"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../../components/ui/newlabel";
import { Input } from "../../components/ui/newinput";
import { cn } from "../../components/cn";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import V2fa from '../components/V2fa/V2fa';
import { ipAdress } from "@/app/utils";
import { set } from "lodash";

export default function SignupFormDemo() {
  const [is, setIs] = useState(0);
  const [userId, setUserId] = useState(-1);
  const [error, setError] = useState("");
  const [error_, setError_] = useState("");
  const [isTwoFa, setIsTwoFa] = useState("false");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const form = useForm();
  const router = useRouter();

  const isValidValues = (value: any) => {
    if (value?.nickname.length < 3) return 3;
    else if (value?.password.length < 6) return 4;
    return 0;
  };

  useEffect(() => {
    switch (is) {
      case 3:
        setError("nickname must be at least 3 characters long.");
        break;
      case 4:
        setError("Password must be at least 6 characters long.");
        break;
      default:
        setError("");
        break;
    }
  }, [is]);

  useEffect(() => {
    if (document.cookie.includes("access_token"))
    {
      const accessToken = document.cookie.split("access_token=")[1].split(";")[0];
      setToken(accessToken);

      if (accessToken) {
        // Access token is present, make a request to the protected endpoint
        axios
        .get(`http://${ipAdress}/auth/protected`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // document.cookie = `access_token=; path=/;`;
          if (res?.status === 200)
          {
            setLoading(false);
            setUserId(res?.data?.id);
            if (res?.data?.twoFa)
              setIsTwoFa("2fa");
            else
              router.push(`http://${process.env.NEXT_PUBLIC_API_URL}/Dashboard`);
          }
          else
            setLoading(false);

        })
        .catch((error) => {
            setLoading(false);
        })
      } else
        setLoading(false);
    }
    else
      setLoading(false);
  }, []);

  const onSubmit = (values: any) => {
    const is = isValidValues(values);
    setIs(is);
    if (is !== 0) return;

    axios
      .post(
        `http://${ipAdress}/auth/login`,
        {
          username: values.nickname,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          setError_("* " + data.message);
          setIs(5);
          return;
        }
        const accessToken = data.access_token;

        setToken(data.access_token);
        
        // Check if access_token is present
        if (accessToken) {
          // Access token is present, make a request to the protected endpoint
          axios
          .get(`http://${ipAdress}/auth/protected`, {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          })
          .then((res) => {
            if (res.status === 200) 
            {
              setUserId(res?.data?.id);
              if (res?.data?.twoFa)
              {
                setIsTwoFa("2fa");
              }
              else
              {
                  document.cookie = `access_token=${data.access_token}; path=/;`;
                  router.push(`http://${process.env.NEXT_PUBLIC_API_URL}/Dashboard`);
              }
            }
          })
          .catch((error) => {});
        }
      })
      .catch((error) => {})
  }

  const handleGoogle = () => {
    router.push(`http://${ipAdress}/auth/google`);
  };

  const handle42 = () => {
    router.push(`http://${ipAdress}/auth/42`);
  };

  useEffect(() => {
    if (isTwoFa === "true")
    {
      document.cookie = `access_token=${token}; path=/;`;
      router.push(`http://${process.env.NEXT_PUBLIC_API_URL}:3000/Dashboard`);
    }
  }, [isTwoFa]);

  if (loading)
    return <div className='w-full h-full flex justify-center items-center'> <div className="loader animate-loader"></div></div>

  if (isTwoFa === "2fa")
    return <V2fa setIsTwoFa={setIsTwoFa} userId={userId}/>;
  else if (isTwoFa === "true")
    return <div className='w-full h-full flex justify-center items-center'> <div className="loader animate-loader"></div> </div>


  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-md lg:w-full w-[80%] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-primaryColor ring-[0.2px] ring-red-500 z-10">
        <motion.h1 className="text-red-500 lg:text-4xl md:text-3xl text-2xl font-semibold mb-2 sm:mb-0 text-center">
          Login
        </motion.h1>

        <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="nickname">nickname</Label>
            <Input
              id="nickname"
              placeholder="Enter your nickname"
              type="text"
              {...form.register("nickname")}
            />
            {is === 3 && <p className="text-red-500 text-sm my-4">{error}</p>}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              {...form.register("password")}
            />
            {is === 4 && <p className="text-red-500 text-sm my-4">{error}</p>}
          </LabelInputContainer>
          {is === 5 && <p className="text-red-500 text-sm my-4">{error_}</p>}
          <button
            className="bg-gradient-to-br relative group/btn bg-[#192536] block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign In &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className=" relative group/btn bg-[#192536] flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input "
              type="button"
              onClick={handle42}
            >
              <Image
                src="/Apple Logo.svg"
                className="w-5"
                alt="42"
                width={100}
                height={100}
              />
              <span className="text-neutral-300 text-sm">Intra 42</span>
              <BottomGradient />
            </button>
            <button
              className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full  rounded-md h-10 font-medium shadow-input bg-[#192536]"
              type="button"
              onClick={handleGoogle}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
              <span className="text-neutral-300 text-sm">Google</span>
              <BottomGradient />
            </button>
          </div>
        </form>
        <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        <div className="w-full flex justify-between">
          <Label className="text-gray-300 text-sm">
            Don&apos;t have an account?
          </Label>
          <Link href="/register" className="text-gray-300 text-sm">
            Sign Up &rarr;
          </Link>
        </div>
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
