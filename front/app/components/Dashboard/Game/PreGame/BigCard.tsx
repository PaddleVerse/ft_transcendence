/* eslint-disable @next/next/no-img-element */
import React from "react";

import { motion } from "framer-motion";
import { cn } from "@/components/cn";
import { Inter, Rajdhani } from "next/font/google";
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload:false
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const BigCard = ({ gameMode }: { gameMode: string}) => {
  return (
    <div  className=" 2xl:h-[850px] xl:h-[550px] h-[600px] sm:h-[700px] sm:w-[95%] w-[87%] overflow-hidden cursor-pointer rounded-lg relative">
      <motion.img
        src={`${
          gameMode === "1"
            ? "/game2.png"
            : gameMode === "2"
            ? "/game3.png"
            : gameMode === "3"
            ? "/game1.png"
            : "/game4.png"
        }`}
        className="w-full h-full object-cover "
        alt="gameImage"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.15, rotate: 4 }}
        transition={{ duration: 0.5 }}
      />
      <div
        className="h-[25%] w-full bg-transparent absolute bottom-0 text-white flex flex-col 2xl:p-8 md:p-8 lg:p-4 p-4 2xl:gap-4 gap-2"
        style={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(13, 9, 10, 0.5)",
        }}
      >
        <h1
          className={cn("font-[600] 2xl:text-2xl text-lg", rajdhani.className)}
        >
          {gameMode === "1" ? "Online Multiplayer" : "Coming Soon"}
        </h1>
        <p
          className={cn(
            "2xl:text-md text-sm w-[95%] sm:w-auto",
            inter.className
          )}
        >
          {gameMode === "1" ? "Play with someone online and test your skills against them, completly random." : "Game mode coming soon stay tuned"}
          
        </p>
        <div className="flex items-center gap-4">
          <img
            src="/queue.svg"
            alt="queue"
            className="2xl:w-[20px] 2xl:h-[20px] w-[14px] h-[14px]"
          />
          <p className="2xl:text-md text-sm">Queue time: 2 mins</p>
        </div>
      </div>
    </div>
  );
};

export default BigCard;
