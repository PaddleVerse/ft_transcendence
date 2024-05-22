import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getShortDate, getTime } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export const ChatCard = (props: any) => {
  const router = useRouter();
  const clt = useQueryClient();
  return (
    <motion.div
      className="flex justify-between items-center lg:p-3 p-1 hover:bg-gray-800 rounded-lg relative sm:w-auto w-full cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg"
      onClick={(e) => {
        e.preventDefault();
        if (props?.value?.user === false) {
          router.push(`/Dashboard/Chat/channel/${props?.value?.id}`);
        } else {
          router.push(`/Dashboard/Chat/dm/${props?.value?.id}`);
        }
        clt.invalidateQueries({ queryKey: ["targetChannel", "targetUser"] });
        props.handleClick();
      }}
      initial={{ opacity: 0, x:450}}
      animate={{ opacity: 1, x: 0}}
      transition={{ delay: 0.20 * props.index}}
    >
      <div className="flex gap-4 w-full">
        <div className="sm:w-10 sm:h-12 h-10 w-10 relative flex flex-shrink-0 items-center">
          <Image
            className="shadow-md rounded-full w-10 h-10 object-cover"
            src={
              props.value?.picture ||
              "https://randomuser.me/api/portraits/women/87.jpg"
            }
            width={40}
            height={40}
            alt="picture"
          />
          <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
            {props?.value?.user &&
              (props?.value?.status === "ONLINE" ? (
                <div className="bg-green-500 rounded-full w-2 h-2"></div>
              ) : props?.value?.status === "IN_GAME" ?
              (
                <div className="bg-red-500 rounded-full w-2 h-2"></div>
              ) :
              (
                <div className="bg-gray-400 rounded-full w-2 h-2"></div>
              ))}
          </div>
        </div>
        <div className="flex flex-col justify-between w-full">
          <p className="text-white max-w-[80%]">{props?.value?.name}</p>
          <div className="flex-auto min-w-0 ml-4 mr-6  md:block group-hover:block">
            <div className="flex items-center text-sm text-gray-400">
              <div className="min-w-0 flex justify-between w-full">
                {props.istyping ? (
                  props?.value?.user ? (
                    <p className="text-white">is typing ...</p>
                  ) : (
                    <p className="text-white">someone is typing ...</p>
                  )
                ) : props?.msg?.content_type === "image" ? (
                  <p>sent a picture</p>
                ) : (
                  <p className="">
                    {props.msg && props.msg?.content?.length >= 10
                      ? props.msg?.content.slice(0, 10) + "..."
                      : props.msg
                      ? props.msg?.content
                      : null}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-gray-400 text-sm ">
          {props.msg && getTime(props.msg.createdAt)}
        </p>
        <p className="ml-2 whitespace-no-wrap text-center text-gray-600 text-sm sm:relative ">
          {props.msg && getShortDate(new Date(props.msg.createdAt))}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatCard;
