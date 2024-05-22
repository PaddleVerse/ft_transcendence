import Image from "next/image";
import React from "react";
const image =
  "https://preview.redd.it/dwhdw8qeoyn91.png?width=640&crop=smart&auto=webp&s=65176fb065cf249155e065b4ab7041f708af29e4";

const image2 =
  "https://img.pikbest.com/origin/09/26/71/799pIkbEsTSty.png!w700wp";
const OneGame = ({status}:{status:string}) => {
  return (
    <div className="w-full">
      <div className="w-full px-7 h-[50px] mt-[25px] bg-transparent flex justify-between"

      >
        <span className={`${status === "win" ? "text-green-500" : "text-red-500"} text-[10px]`}>23:32, Wed, Dec 6</span>
        <div className="flex gap-2 self-end text-xs mr-10">
          <div className="flex items-center gap-2 text-white">
            <span>me</span>
            <Image src={image} alt="player1" className="w-5 h-5 rounded-full" width={100} height={100} />
            <div className="flex flex-col relative">
              <span className="absolute text-[8px] right-[16px] top-[-15px]">
                13:37
              </span>
              <div className={`${status === "win" ? "bg-green-500" : "bg-red-500"} text-white  rounded-sm flex items-center px-4 text-sm`}>
                <span>2</span>
                <span> - </span>
                <span>5</span>
              </div>
            </div>
            <Image src={image2} alt="player2" className="w-5 h-5 rounded-full"  width={100} height={100}/>
            <span>you</span>
          </div>
        </div>
        <div className={`${status === "win" ? "bg-green-500" : "bg-red-500"} text-white  rounded-sm flex items-center px-4 sm:text-md sm:h-[29px] h-[22px] text-[12px]`}>
          <span>{status === 'win' ? 'WIN' : 'LOST'}</span>
        </div>
      </div>
      <div className="flex w-full justify-center mt-1">
        <hr className={`${status === "win" ? "border-green-500" :  "border-red-500"} w-[95%] `} />
      </div>
    </div>
  );
};

export default OneGame;
