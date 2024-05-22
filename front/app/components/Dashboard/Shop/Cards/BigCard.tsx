/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import { inter } from "@/app/utils/fontConfig";
import Image from "next/image";
import PaddleCoin from "../Stuff/PaddleCoin";
import BallCoin from "../Stuff/BallCoin";
import { motion } from "framer-motion";
import { cn } from "@/components/cn";
import { Infos } from "../types";

interface BigCardProps {
  infos: Infos;
  selected: string;
  handleClick: (infos: Infos) => void;
}
const BigCard = ({ infos, handleClick, selected }: BigCardProps) => {
  const handleCardClick = () => {
    setHover(true);
    handleClick(infos);
  };
  const [hover, setHover] = React.useState(false);
 
  return (
    <div
      className={cn(
        "w-[100%] h-[375px]  relative text-white cursor-pointer rounded-lg",
        inter.className
      )}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <Image
        src={`${infos.image}`}
        alt="shop"
        fill
        sizes="h-auto w-auto"
        priority
        className="object-cover object-center rounded-lg"
        onClick={handleCardClick}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute w-[70%] left-4 top-4">
          <h1 className="xl:text-[22px] text-[18px] font-[500]">
            {infos.title}
          </h1>
          <p className="text-[12px]">{infos.description}</p>
        </div>
        <div className="absolute bottom-4 right-4">
          {
            selected === "Paddle" ? (
              <PaddleCoin size={"small"} infos={infos} />
            ) : selected === "Ball" ? (
              <BallCoin size={"small"} infos={infos} />
            ) : null
          }
        </div>
      </motion.div>
    </div>
  );
};

export default BigCard;
