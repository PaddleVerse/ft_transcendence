import Image from "next/image";
import React from "react";

const image =
  "https://preview.redd.it/dwhdw8qeoyn91.png?width=640&crop=smart&auto=webp&s=65176fb065cf249155e065b4ab7041f708af29e4";
const StandingRow = () => {
  return (
    <tr className="bg-transparent text-white text-[10px]">
      <th scope="row" className="py-2 font-medium">
        1
      </th>
      <td className="py-2 text-[10px] flex items-center gap-2">
        <Image src={image} alt="image" className="w-4 rounded-full md:w-5" width={100} height={100} />
        <span className="inline lg:hidden xl:inline ">Leo abdelmottalib</span>
      </td>
      <td className=" py-2 xl:pl-[4px] 2xl:pl-0">6</td>
      <td className=" py-2 2xl:table-cell xl:hidden">3</td>
      <td className=" py-2 2xl:table-cell xl:hidden">5</td>
      <td className="  py-2 2xl:table-cell xl:hidden">2.2</td>
      <td className="w-[95px] 2xl:table-cell xl:hidden">
        <div className="flex justify-between">
          <div className="text-white bg-green-700 h-[12px]  px-[3px] rounded-[2px] text-[7px] flex items-center">
            <span>W</span>
          </div>
          <div className="text-white bg-green-700 h-[12px]  px-[3px] rounded-[2px] text-[7px] flex items-center">
            <span>W</span>
          </div>
          <div className="text-white bg-green-700 h-[12px]  px-[3px] rounded-[2px] text-[7px] flex items-center">
            <span>W</span>
          </div>
          <div className="text-white bg-green-700 h-[12px]  px-[3px] rounded-[2px] text-[7px] flex items-center">
            <span>W</span>
          </div>
          <div className="text-white bg-green-700 h-[12px]  px-[3px] rounded-[2px] text-[7px] flex items-center">
            <span>W</span>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default StandingRow;
