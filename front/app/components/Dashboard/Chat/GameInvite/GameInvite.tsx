import React, { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { user } from "@/app/Dashboard/Chat/type";
import Image from "next/image";
import { Button } from "@/components/ui/moving-border";

const inter = Inter({ subsets: ["latin"] });
const modalVariants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "easeOut",
      duration: 0.15,
    },
  },
  closed: {
    opacity: 0,
    scale: 0.75,
    transition: {
      ease: "easeIn",
      duration: 0.15,
    },
  },
};

const GameInvite = ({
  sender,
  onDecline,
  onAccept,
}: {
  sender: user | null;
  onDecline: () => void;
  onAccept: () => void;
}) => {
  const [modlar, setModlar] = useState(false);;
  const [count, setCount] = useState(10);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(countdownInterval);
  }, [modlar]);

  return (
    <div
      className={`fixed inset-0 sm:flex ${modlar ? "block" : ""} ${
        inter.className
      } items-center justify-center bg-black bg-opacity-50 z-50 text-white`}
    >
      <motion.div
        className="overflow-y-auto border border-red-500/[0.3] h-[50%] 2xl:w-[35%] xl:w-[55%] sm:w-[70%] px-10 py-16 flex flex-col bg-primaryColor rounded-xl items-center justify-around"
        initial="closed"
        animate="open"
        exit="closed"
        variants={modalVariants}
        style={{
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="">
          <p className="text-4xl font-bold">Game invite</p>
        </div>
        <div>
          <Image
            src={sender?.picture!}
            width={400}
            height={400}
            className="rounded-full w-[250px] h-[250px] object-cover"
            alt={`${sender?.name}'s picture`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-center">{`${sender?.name} has invited you to a game`}</p>
          <p>
            the invitation will disappear after{" "}
            <span className="font-semibold ">{count}</span> seconds and declined
          </p>
        </div>
        <div className="flex flex-row gap-8 w-full justify-center items-center">
          <div
            className="w-[45%] flex justify-center items-center"
            onClick={() => {
              onAccept();
            }}
          >
            <Button
              borderRadius="10px"
              borderClassName=" bg-[radial-gradient(var(--green-500)_40%,transparent_60%)]"
              className={`text-white border-slate-800 w-full sm:mt-0 mt-4 bg-green-500/[0.5]`}
            >
              accept
            </Button>
          </div>
          <div
            className="w-[45%] flex justify-center items-center"
            onClick={() => {
              onDecline();
            }}
          >
            <Button
              borderRadius="10px"
              borderClassName=" bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
              className={`text-white border-slate-800 w-full sm:mt-0 mt-4 bg-red-500/[0.5]`}
            >
              decline
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameInvite;
