import React from "react";
import Image from "next/image";
import StandingTable from "./StandingTable";
import { rajdhani } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";

const Standing = () => {
  return (
    <div className="w-full bg-primaryColor  flex flex-col gap-2 p-2 rounded-md">
      <div className="flex text-white sm:gap-0 gap-1">
        <Image src="/standing.svg" width={40} height={40} alt={"standing"} />
        <h1
          className={cn(
            "lg:text-xl text-[20px] font-[500] text-lg self-end",
            rajdhani.className
          )}
        >
          STANDING
        </h1>
      </div>
      <StandingTable />
    </div>
  );
};

export default Standing;
