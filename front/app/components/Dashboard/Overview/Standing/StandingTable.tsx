import React from "react";
import { roboto } from "@/app/utils/fontConfig";
import StandingRow from "./StandingRow";
import { cn } from "@/components/cn";


const StandingTable = () => {
  return (
    <div>
      <div className="relative">
        <table
          className={cn('w-full text-sm text-left rtl:text-right text-white', roboto.className)}
        >
          <thead className="text-xs text-gray-400  bg-transparent ">
            <tr>
              <th scope="col" className="font-[400] ">
                #
              </th>
              <th scope="col" className=" font-[400]">
                User
              </th>
              <th scope="col" className="font-[400] ">
                PL
              </th>
              <th scope="col" className="font-[400] 2xl:table-cell xl:hidden">
                W
              </th>
              <th scope="col" className="font-[400] 2xl:table-cell xl:hidden">
                L
              </th>
              <th scope="col" className="font-[400] 2xl:table-cell xl:hidden">
                W/L
              </th>
              <th scope="col" className="font-[400] 2xl:table-cell xl:hidden">
                Form
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, index) => (
              <StandingRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingTable;
