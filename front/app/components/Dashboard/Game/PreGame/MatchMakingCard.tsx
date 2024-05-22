"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import PlayerCard from "./PlayerCard";
import axios from "axios";
import { fetchData, ipAdress } from "@/app/utils";
import { AiOutlineClose } from "react-icons/ai";

const MatchMakingCard = ({
  gameMode,
  setCanPlay,
  setSelected
}: {
  gameMode: string;
  setCanPlay: (s:boolean) => void;
  setSelected: (s:string) => void;
}) => {
  const { state } = useGlobalState();
  const { user, socket } = state;
  const [otherPlayer, setOtherPlayer] = useState<any>(null);

  useEffect(() => {
    socket?.emit("matchMaking", { id: user?.id });

    socket?.on("start", (data: any) => {
      fetchData(`/user/${data?.id}`, "GET", null)
      .then((res) => {
        if (!res) return;
        setOtherPlayer(res?.data);
      })
      .catch(() => {
      });
    });

    const emitLeaveRoom = () => {
      socket?.emit("cancelMatchMaking",{ id: user?.id });
    };

    window.addEventListener("beforeunload", emitLeaveRoom);

    return () => {
      if (socket) {
        window.removeEventListener("beforeunload", emitLeaveRoom);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const onClose = () => {
    if (socket) {
      socket?.emit("cancelMatchMaking");
    }
  }
  return (
    <div className="fixed inset-0 sm:flex hidden items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            ease: "easeIn",
            duration: 0.15,
          },
        }}
        exit={{ opacity: 0, scale: 0.75 }}
        className="relative bg-[#101823a6] backdrop-blur 2xl:w-[35%] w-[450px] h-[450px] rounded-xl p-4 z-50 ring-[1px] ring-sidebarRedColor"
      >
        <button
          onClick={()=> {
            setCanPlay(false);
            setSelected('')
          }
          }
          className="absolute top-2 right-4 text-xl text-sidebarRedColor"
        >
        { !otherPlayer && <AiOutlineClose size={30} onClick={onClose} /> }
        </button>
        <div className="flex  justify-center items-center w-full h-full gap-4">
          <PlayerCard name={user?.name} img={user?.picture} />
          <div className="h-full flex flex-col justify-center items-center">
            <div className="w-[1.5px] h-1/2 bg-sidebarRedColor"></div>
              <h1 className="text-3xl text-sidebarRedColor">VS</h1>
            <div className="w-[1.5px] h-1/2 bg-sidebarRedColor"></div>
          </div>

          <PlayerCard name={otherPlayer?.name} img={otherPlayer?.picture} />

        </div>
      </motion.div>
    </div>
  );
};

export default MatchMakingCard;
