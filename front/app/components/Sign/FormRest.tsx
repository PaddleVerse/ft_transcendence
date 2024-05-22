import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { rajdhani } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";

export const FormLinesSignUp = () => {
  return (
    <div className="inline-flex items-center justify-center w-full sm:mt-6">
      <hr className="w-4/5 h-px my-8 border-0 bg-lineGray" />
      <span
        className={cn(
          "absolute px-8 text-[12px] text-lineGray -translate-x-1/2 bg-dashBack left-1/2",
          rajdhani.className
        )}
      >
        or sign in with
      </span>
    </div>
  );
};

interface FormLinesAlreadyProps {
  n: string;
  des: string;
  url: string;
}

export const FormLinesAlready = ({ n, des, url }: FormLinesAlreadyProps) => {
  return (
    <>
      <div
        style={{ fontFamily: "fontt" }}
        className="flex justify-between w-4/5 mt-12 text-lg tracking-wide"
      >
        <span className={cn("text-white text-sm", rajdhani.className)}>
          {des}
        </span>
        <Link
          href={url}
          className={cn(
            "text-white text-sm flex items-center cursor-pointer hover:text-red-500",
            rajdhani.className
          )}
        >
          {n} <ArrowUpRight />
        </Link>
      </div>
      <span className="w-4/5 mt-2 bg-white border"></span>
    </>
  );
};
