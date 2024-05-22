"use client";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import React from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface Props {
  p: string;
}

const SignButton = ({ p }: Props) => {
  const [hoverr, setHover] = React.useState(false);
  //
  return (
    <button
      type="submit"
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      className={`${poppins.className} flex relative items-center justify-center bg-trasparent text-white sm:w-[175px] w-28 sm:h-[52px] h-10 tracking-wide text-sm xm:text-[17px] hover:text-black hover:border-white transition-colors duration-300 ease-in-out mt-2 sm:mt-6 border cursor-pointer`}
    >
      <span className="z-10">{p}</span>
      <motion.div
        initial={{ height: "0%", width: "0%" }}
        animate={{
          height: hoverr ? "100%" : "0%",
          width: hoverr ? "100%" : "0%",
        }}
        // transition={{ duration: 0.8 }}
        className="absolute top-0 left-0  bg-white w-full"
      ></motion.div>
      <motion.div
        initial={{ height: "0%", width: "0%" }}
        animate={{
          height: hoverr ? "100%" : "0%",
          width: hoverr ? "100%" : "0%",
        }}
        // transition={{ duration: 0.8 }}
        className="absolute bottom-0 right-0  bg-white w-full"
      ></motion.div>
    </button>
  );
};

export default SignButton;
