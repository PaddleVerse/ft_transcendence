import React from "react";
import Image from "next/image";
import { Infos } from "../types";
const SmallCard = ({infos} : {infos : Infos}) => {
  return (
    <div className="w-full h-[365px]  relative text-white cursor-pointer rounded-lg">
      <Image
        src="/smallShop.png"
        fill
        alt="image"
        sizes="h-auto w-auto"
        className="object-cover rounded-lg"
      />
      <div className="absolute bottom-2 right-2 ">
      </div>
    </div>
  );
};

export default SmallCard;
