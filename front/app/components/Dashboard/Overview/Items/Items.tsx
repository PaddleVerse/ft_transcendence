'use client';
import React from "react";
import { rajdhani } from "@/app/utils/fontConfig";
import Image from "next/image";
import { cn } from "@/components/cn";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import { useRouter } from "next/navigation";

const Items = () => {
  const { state } =  useGlobalState();
  const { user } : any = state;
  const router = useRouter();

  return (
    <div className="w-full h-full bg-primaryColor rounded-md overflow-y-auto no-scrollbar">
      <div className="bg-primaryColor sticky top-0 z-10">
        <div className="flex items-center text-white  p-4 pb-2 ">
          <Image src="/itemsMenu.svg" width={40} height={40} alt={"image"} />
          <h1 className={cn("font-[500] text-[20px]", rajdhani.className)}>
            Items
          </h1>
        </div>
      </div>
      <div className="grid p-4 2xl:grid-cols-8  text-white place-items-center md:grid-cols-7 lg:grid-cols-5 grid-cols-4 mt-2 relative text-center">
        {user ? user?.paddles?.length === 0 && user?.balls?.length === 0 && user?.tables?.length === 0 && (
          
          <div className="w-[100%] h-full flex justify-center items-center absolute top-[120px]">
            <h1 className="text-2xl">No items yet</h1>
            </div>
            ) : null}
      {user && user?.paddles?.map((item: any, index: number) => (
          <Image
            src={item?.image || "/badge2_c.png"}
            width={0}
            height={0}
            alt={"image"}
            key={index}
            sizes="100vh 100vw"
            className="w-[100px] h-[100px] mt-2 rounded-full object-cover cursor-pointer"
            onClick={() => router.push("/Dashboard/Shop")}
          />
        ))}
        {user && user?.balls?.map((item: any, index: number) => (
          <Image
            src={item?.image || "/badge2_c.png"}
            width={0}
            height={0}
            alt={"image"}
            key={index}
            sizes="100vh 100vw"
            className="w-[100px] h-[100px] mt-2 rounded-full object-cover cursor-pointer"
            onClick={() => router.push("/Dashboard/Shop")}
          />
        ))}
        {user && user?.tables?.map((item: any, index: number) => (
          <Image
            src={item?.image || "/badge2_c.png"}
            width={0}
            height={0}
            alt={"image"}
            key={index}
            sizes="100vh 100vw"
            className="w-[100px] h-[100px] mt-2 rounded-full object-cover cursor-pointer"
            onClick={() => router.push("/Dashboard/Shop")}
          />
        ))}
      </div>
    </div>
  );
};

export default Items;
