"use client";
import React, { FC, useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  channel,
  participants,
  participantWithUser,
} from "@/app/Dashboard/Chat/type";
import axios from "axios";
import { useRouter } from "next/navigation";

import { FaMicrophone } from "react-icons/fa6";
import { FaMicrophoneSlash } from "react-icons/fa6";
import { FaBan } from "react-icons/fa6";
import { FaChessKing } from "react-icons/fa6";
import { FaChessPawn } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useGlobalState } from "../../Sign/GlobalState";
import { ipAdress, fetchData } from "@/app/utils";
import { AnimatePresence, motion } from "framer-motion";

import { Dropdown } from "./DropDown";
const MemberList = ({
  participant,
  exec,
  channel,
}: {
  participant: participantWithUser;
  exec: participants;
  channel: channel;
}) => {
  const router = useRouter();
  const { state } = useGlobalState();

  const handleClick = () => {
    if (participant?.user_id! === state?.user?.id) {
      router.push(`/Dashboard`);
      return;
    }
    router.push(`/Dashboard/Profile?id=${participant?.user?.id}`);
  };

  const handleBan = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!exec) {
      toast.error("You cannot take privilage from yourself");
      return;
    }
    if (participant?.role === "ADMIN") {
      toast.error("You cannot ban an admin");
      return;
    }
    const obj = {
      cid: exec?.channel_id,
      uid: participant?.user_id,
    };

    fetchData(`/ban`, "POST", obj)
      .then(() => {
        state?.socket?.emit("ban", {
          roomName: channel.name,
          user: participant?.user,
        });
      })
      .catch((err) => {
      });
  };

  const handleKick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!exec) {
      toast.error("You do not have privilage to kick");
      return;
    }
    if (participant?.role === "ADMIN") {
      toast.error("You cannot kick an admin");
      return;
    }

    fetchData(
      `/participants/kick?target=${participant?.user_id}&user=${
        exec?.user_id
      }&channel=${channel!.id}`,
      "DELETE",
      null
    )
      .then((res) => {
        state?.socket?.emit("kick", {
          roomName: channel?.name,
          user: participant?.user,
        });
      })
      .catch((err) => {
      });
  };

  const handlePromoteDemote = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!exec) {
      toast.error("you do not have privilage to promote/demote");
      return;
    }
    if (participant?.role === "ADMIN") {
      toast.error("You cannot take privilage from admin");
      return;
    }
    const obj = {
      channel: exec?.channel_id,
      executor: exec?.user_id,
      participant: {
        role: participant?.role === "MEMBER" ? "MOD" : "MEMBER",
      },
    };

    fetchData(`/participants/${participant?.user_id}`, "PUT", obj)
      .then((res) => {
        state?.socket?.emit("channelUpdate", {
          roomName: channel.name,
          user: participant?.user,
        });
      })
      .catch((err) => {
      });
  };

  const handleMuteUnMute = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!exec) {
      toast.error("You do not have privilage to mute/unmute");
      return;
    }
    if (participant?.role === "ADMIN") {
      toast.error("You cannot mute an admin");
      return;
    }
    const obj = {
      channel: exec?.channel_id,
      executor: exec?.user_id,
      participant: {
        mute: participant?.mute ? false : true,
      },
    };

    fetchData(`/participants/${participant?.user_id}`, "PUT", obj)
      .then((res) => {
        state?.socket?.emit("channelUpdate", {
          roomName: channel.name,
          user: participant?.user,
        });
      })
      .catch((err) => {
      });
  };

  return (
    <AnimatePresence>
      <motion.div
        id="participant"
        className="text-white w-[70%] flex items-center justify-between"
        initial={{ opacity: 0, y: -120 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="flex items-center gap-2">
          <Image
            src={
              (participant && participant?.user?.picture!) ||
              "https://res.cloudinary.com/dxxlqdwxb/image/upload/v1713526102/zxwritc0rqvtjvcwbqiv.jpg"
            }
            width={40}
            height={40}
            alt="image"
            onClick={() => {
              handleClick();
            }}
            className="rounded-full aspect-square object-cover"
          />
          <div className="flex flex-col 2xl:text-md text-xs">
            <span>{participant && participant?.user?.name}</span>
            <span className="2xl:text-md text-[10px]">
              @{participant && participant?.user?.middlename}
            </span>
          </div>
        </div>
        <span>{participant && participant?.role.toLowerCase()}</span>
        {participant && participant?.role !== "ADMIN" && participant?.user_id !== state?.user?.id ? (
          <Dropdown
            list={[
              {
                name: participant.mute ? "Unmute" : "Mute",
                action: handleMuteUnMute,
              },
              { name: "Ban", action: handleBan },
              { name: "Kick", action: handleKick },
              {
                name: participant.role === "MOD" ? "Demote" : "Promote",
                action: handlePromoteDemote,
              },
            ]}
          />
        ) : (
          <div></div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MemberList;

// need to add something to the backend so when i kick a user or ban a user, the user is removed from the channel and from the room in the socket
