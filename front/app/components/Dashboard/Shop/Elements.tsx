"use client";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import BigCard from "./Cards/BigCard";
import SmallCard from "./Cards/SmallCard";
import Header from "./Header";
import Modlar from "./Stuff/Modlar";
import cardsData from "./CardData";


const Elements = () => {
  const handleClick = (e: any | null) => {
    setModelarInfos(e);
    setModelarOpen(!modelarOpen);
  };
  const [BigCardinfos, setBigCardInfos] = useState<any>(cardsData.Paddle.bigCard);
  const [selected, setSelected] = useState<string>("Paddle");
  const [modelarOpen, setModelarOpen] = React.useState(false);
  const [modelarInfos, setModelarInfos] = React.useState({
    title: "",
    image: "",
    description: "",
    texture: "",
    color: "",
    price: 0,
  });
  const handleHeaderSelect = (element: string) => {
    setSelected(element);
    const bigCardInfos = cardsData[element as keyof typeof cardsData].bigCard;
    setBigCardInfos(bigCardInfos);
  };
  return (
    <div className="w-full h-full flex justify-center">
      <div className=" flex flex-col gap-5 w-[89%] mt-[50px]">
        <Header onSelect={handleHeaderSelect} />
        <div className="w-full rounded-xl bg-[#101823] pb-10  flex flex-col overflow-y-auto no-scrollbar">
          <div className="flex flex-col w-full h-full relative 2xl:px-[65px] xl:px-[35px] sm:px-[20px] px-[10px]">
            <div className="w-full grid grid-flow-col-1 gap-7 md:grid-cols-3 place-items-center mt-6">
              <BigCard
                infos={BigCardinfos.first}
                handleClick={handleClick}
                selected={selected}
              />
              <BigCard
                infos={BigCardinfos.second}
                handleClick={handleClick}
                selected={selected}
              />
              <BigCard
                infos={BigCardinfos.third}
                handleClick={handleClick}
                selected={selected}
              />
            </div>
            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-5 place-items-center mt-6">
              {Array.from({ length: 8 }, (_, index) => (
                <SmallCard key={index} infos={modelarInfos} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {modelarOpen && (
          <Modlar
            infos={modelarInfos}
            handleClick={handleClick}
            selected={selected}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Elements;
