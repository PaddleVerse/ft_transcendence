import React from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import { cn } from "@/components/cn";
import { Inter, Rajdhani } from "next/font/google";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload:false
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


const Header = ({selected, setCanPlay}:{selected:string, setCanPlay:any}) => {
  // get username from global state
  const { state } = useGlobalState();
  const username = state?.user?.nickname;
  return (
    <div
      className={cn(
        `flex justify-between items-center text-white`,
        rajdhani.className
      )}
    >
      <div className="flex flex-col relative">
        <h1 className="font-[600] text-[24px]">Hello {username}</h1>
        <p
          className={cn(
            "text-buttonGray",
            inter.className,
            "text-[13px] xl:w-auto md:w-[165px] sm:flex hidden truncate"
          )}
        >
          Ready to get started for an exciting new game? Choose a game-mode and
          click Play.
        </p>
      </div>
      <button
        className={cn(
          "flex items-center justify-between",
          rajdhani.className,
          "sm:py-3 sm:px-[65px] py-2  px-5 rounded-md gap-2 border border-red-500 flex items-center",
          selected === "1" || selected === "2" ? "bg-red-500" : "bg-[#101823]"
        )}
        onClick={
          () => {
            selected === "1" || selected === "2" ? setCanPlay(true) : setCanPlay(false)
          }
        
        }
      >
        <span className="font-[500]">Play</span>
        <motion.span
          initial={{width:0, opacity:0}}
          animate={{width: selected === "1" || selected === "2" ? "auto" : 0, opacity: selected === "1" || selected === "2" ? 1 : 0}}
          transition={{duration:0.25}}

          
        >{selected === "1" ? "PVP" : selected === "2" ? "AI":""}</motion.span>
        <Image
          src={"/game-controller.svg"}
          width={20}
          height={20}
          alt="next to play image"
          className="text-white"
        />
      </button>
    </div>
  );
};

export default Header;
