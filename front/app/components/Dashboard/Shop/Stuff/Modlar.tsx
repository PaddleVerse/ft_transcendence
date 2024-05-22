/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { Infos } from "../types";
import { rajdhani } from "@/app/utils/fontConfig";
import Coin from "./PaddleCoin";
import { cn } from "@/components/cn";

const Modlar = ({
  infos,
  selected,
  handleClick,
}: {
  infos: Infos;
  handleClick: (infos: null) => void;
  selected: string;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClick(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClick]);
  return (
    <motion.div className="fixed inset-0 sm:flex hidden items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        className="bg-black rounded-lg flex justify-center p-[50px] text-white gap-8  relative"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            ease: "easeIn",
            duration: 0.15,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.75,
          transition: {
            ease: "easeIn",
            duration: 0.15,
          },
        }}
      >
        <div className="relative">
          <Image
            src={`${infos.image}`}
            alt="shop"
            sizes="width:auto height:auto"
            width={0}
            height={0}
            priority
            className="object-cover object-center 2xl:w-[750px] 2xl:h-[750px] lg:w-[450px] lg:h-[450px] w-[250px] h-[250px]"
          />
        </div>
        <div
          className={cn("flex flex-col justify-between", rajdhani.className)}
        >
          <div>
            <h1 className="xl:text-[31px] text-[18px] font-[600]">
              {infos.title}
            </h1>
            <p className="text-[18px] w-[450px] font-[500]">
              {infos.description}
            </p>
          </div>
          {/* <div className="mt-[45px] self-end">
            <Coin size="big" infos={infos} />
          </div> */}
        </div>
        <div
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => handleClick(null)}
        >
          <AiOutlineClose size={30} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modlar;
