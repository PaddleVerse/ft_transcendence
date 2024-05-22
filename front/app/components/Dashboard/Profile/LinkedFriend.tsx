import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { inter, rubik } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";
import { useGlobalState } from "../../Sign/GlobalState";
const LinkedFriend = (props: any) => {
  const {state} = useGlobalState();
  const router = useRouter();

  const handleClick = (id: any) => {
    if (id === state?.user?.id) {
      router.push(`/Dashboard`);
      return;
    }
    router.push(`/Dashboard/Profile?id=${id}`);
  };
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Image
          onClick={() => handleClick(props.user?.id)}
          alt="profile"
          height={50}
          width={50}
          src={props.user?.picture || "/b.png"}
          className="object-cover cursor-pointer !m-0 !p-0 object-top rounded-full h-[50px] w-[50px] border-2 group-hover:scale-105 group-hover:z-30 border-white  relative transition duration-500"
        />
        <div className={`flex flex-col ${inter.className}`}>
          <span className="2xl:text-[17px]">{props.user?.name}</span>
          <p className="text-[11px]">@{props.user?.nickname}</p>
        </div>
      </div>
      <div
        className={cn(
          "w-[25px] h-[25px] flex items-center justify-center text-white text-[11px] font-[400] rounded-full bg-[#BD3944]",
          rubik.className
        )}
      >
        #{props?.index}
      </div>
    </div>
  );
};

export default LinkedFriend;
