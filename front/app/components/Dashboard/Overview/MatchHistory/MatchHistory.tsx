import React from "react";
import { Rajdhani } from "next/font/google";
import OneGame from "./OneGame";
import Image from "next/image";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload:false
});
const MatchHistory = () => {
  return (
    <div className="   w-full rounded-md bg-transparent overflow-y-auto h-[700px]"
    style={{
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(13, 9, 10, 0.7)",
    }}
    >
      <div className="flex flex-col  sticky top-0 bg-dashBack z-10">
        <div className="flex justify-between h-20 items-center px-7 xl:mt-4 mt-2">
          <div className="flex gap-2 items-center">
            <Image
              src="Frame.svg"
              alt="img"
              className="xl:w-8 h-auto md:w-6 w-5"
              width={100}
              height={100}
            />
            <span
              className={`${rajdhani.className} text-white xl:text-2xl lg:text-lg md:text-md`}
            >
              Match History
            </span>
          </div>
          <div className="bg-gray-700 px-4 py-2 rounded-md xl:text-sm text-xs">
          <span className="text-red-500">7W</span>
            <span className="text-white mr-1 ml-1">-</span>
            <span className="text-red-500/[0.5]">3L</span>
            <span className="text-gray-400">(54%)</span>
          </div>
        </div>
        <hr className="border-red-500" />
      </div>
      <OneGame status="lost" />
      <OneGame status="win" />
      <OneGame status="lost" />
      <OneGame status="win" />
      <OneGame status="win" />
      <OneGame status="lost" />
      <OneGame status="win" />
      <OneGame status="win" />
      <OneGame status="win" />
      <OneGame status="lost" />
      <OneGame status="win" />
      <OneGame status="win" />
      <OneGame status="lost" />
      <OneGame status="win" />
      <OneGame status="lost" />
      <OneGame status="win" />
      <OneGame status="win" />
      <OneGame status="lost" />
      <OneGame status="win" />
      <OneGame status="win" />
      <OneGame status="win" />
      <OneGame status="lost" />
      <OneGame status="win" />
      <OneGame status="win" />
    </div>
  );
};

export default MatchHistory;
