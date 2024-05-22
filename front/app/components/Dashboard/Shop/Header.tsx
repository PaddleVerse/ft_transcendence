"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { rajdhani } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";
const menuItems = ["Paddle", "Ball"];
const Header = ({ onSelect }: { onSelect: (e: string) => void }) => {
  const [selected, setSelected] = useState<number>(0);
  const handleItemClick = (index: number) => {
    setSelected(index);
    onSelect(menuItems[index]);
  };

  return (
    <div
      className="flex justify-between  bg-transparent rounded-lg"
      style={{
        backdropFilter: "blur(7px)",
        backgroundColor: "rgba(13, 9, 10, 0.7)",
      }}
    >
      <div className="h-[61px] cursor-pointer pl-2 rounded-lg  grid place-items-start items-center  text-white">
        <div className="flex justify-evenly">
          {menuItems.map((el, i) => (
            <MenuItem
              key={i}
              text={el}
              selected={selected === i}
              onClick={() => handleItemClick(i)}
            />
          ))}
        </div>
      </div>
      <div
        className={cn(
          `mr-[17px] gap-4 flex items-center text-white`,
          rajdhani.className
        )}
      >
        <input
          type="checkbox"
          className="bg-gray-400 border-none w-7 h-7 rounded-lg text-rightArrowColor cursor-pointer accent-red-500 focus:outline-none focus:ring-transparent"
          value={""}
        />
        <span>Owned</span>
      </div>
    </div>
  );
};

const MenuItem = ({
  text,
  selected,
  onClick,
}: {
  text: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <div className="relative m-2">
    <motion.div
      className=""
      onClick={onClick}
      animate={{ opacity: selected ? 1 : 0.5 }}
    >
      {text}
    </motion.div>
    {selected && (
      <motion.div
        className="absolute -bottom-[8px] left-0 w-full h-[4px] rounded-sm bg-redValorant opacity-100"
        layoutId="underline"
      />
    )}
  </div>
);

export default Header;
