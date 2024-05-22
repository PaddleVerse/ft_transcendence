import React from "react";
import { getTime } from "@/app/utils";
import Image from "next/image";

const MiddleBubbleRight = (props: any) => {
  return (
    <div className="flex items-center group justify-end">
      <div className="px-4 rounded-2xl bg-white max-w-xs lg:max-w-md text-black">
        {props.message.content_type === "image" ? (
          <Image
            src={props.message.content}
            width={200}
            height={200}
            className="w-[250px] h-[250px]"
            alt="image"
          />
        ) : (
          <p className="text-[14px] mt-2 " style={{ overflowWrap: 'break-word' }}> {props.message.content}</p>
        )}
        <p className="text-[10px] text-gray-500 text-end mb-[2px]">
          {getTime(props.message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MiddleBubbleRight;
