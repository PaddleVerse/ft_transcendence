"use client";
import React, { use, useEffect, useState } from "react";
import Caroussel from "./Caroussel";
import Header from "./Header";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import Game from "@/app/components/Dashboard/Game/InGame/Game";

const GameOptions = () => {
  const [start, setStart] = useState(false);
  const { state } = useGlobalState();
  const { socket } = state;
  const [roomId, setRoomId] = useState<string | null>();
  const [canPlay, setCanPlay] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setRoomId(state?.GameInviteID || null);
  }, [state?.GameInviteID]);

  useEffect(() => {
    if (!socket) return;
    socket?.on("alreadyInGame", () => {
      setCanPlay(false);
    });

    let startTimeout: any;
    socket?.on("start", (data: any) => {
      startTimeout = setTimeout(() => {
        setStart(true);
        setRoomId(data.room);
      }, 1500);
    });

    socket?.on("leftRoom", () => {
      setCanPlay(false);
      setStart(false);

      if (startTimeout) {
        clearTimeout(startTimeout);
        startTimeout = null;
      }
    });

    return () => {
      socket?.off("start");
      socket?.off("leftRoom");
      socket?.off("alreadyInGame");
    };
  }, [socket]);

  useEffect(() => {
    setStart(roomId ? true : false);
  }, [roomId]);

  if (start) {
    return <Game roomId={roomId!} />;
  }
  return (
    <div className="w-[94%] bg-[#101823]  py-[45px] px-[20px] sm:px-[150px] rounded-lg">
      <Header selected={selected} setCanPlay={setCanPlay} />
      <Caroussel
        setSelected={setSelected}
        canPlay={canPlay}
        setCanPlay={setCanPlay}
      />
    </div>
  );
};

export default GameOptions;
