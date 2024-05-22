import Image from "next/image";
import { rajdhani } from "@/app/utils/fontConfig";
import React from "react";
import { cn } from "@/components/cn";
import {motion} from "framer-motion";

const Achievement = ({data, owned, index} : any) => {
  return (

    <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{delay: index * 0.25}}
    exit={{ opacity: 0, y: -20 }}
    className={
      cn(
        "w-full text-white flex items-center gap-2 p-2",
        owned ? "" : "blur"
      )
      }>
      <Image
        src={data?.image || "/achievements/first_win.png"}
        width={40}
        height={40}
        alt="badge"
        className="w-auto h-auto rounded-full object-cover"
      ></Image>
      <div className="flex flex-col w-full">
        <h1 className={cn("text-[14px] font-[500]", rajdhani.className)}>
          {data?.name || ""}
        </h1>
        <p className="text-[10px] text-buttonGray">{data?.description || ""}</p>
      </div>
    </motion.div>
  );
};

export default Achievement;
