import { channel, user } from "@/app/Dashboard/Chat/type";
import Image from "next/image";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { useGlobalState } from "../../Sign/GlobalState";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { fetchData } from "@/app/utils";

const KidnapUserToChannel = async (
  user: user,
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  socket: Socket,
  channel: channel
) => {
  e.preventDefault();
  const obj = {
    participant: {
      user_id: user.id,
      channel_id: channel.id,
    },
    user: user,
    channel: channel?.id,
  };
  try {
    await fetchData(`/participants`, "POST", obj);
    socket?.emit("joinRoom", {
      user: user,
      roomName: channel?.name,
      type: "other",
    })
  } catch (error) {
    toast.error("failed to join channel");
  }
  return;
};

const InviteUser = ({ user, channel }: { user: user; channel: channel }) => {
  const { state } = useGlobalState();
  const { socket } = state!;

  return (
    <div className="text-white w-[70%] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={
            user?.picture! ||
            "https://res.cloudinary.com/dxxlqdwxb/image/upload/v1713526102/zxwritc0rqvtjvcwbqiv.jpg"
          }
          width={40}
          height={40}
          alt="user image"
          className="rounded-full aspect-square w-auto h-auto"
        />
        <div className="flex flex-col 2xl:text-md text-xs">
          <span>{user?.name}</span>
          <span className="2xl:text-md text-[10px]">@{user?.middlename}</span>
        </div>
      </div>
      <div
        className=""
        onClick={(e) => KidnapUserToChannel(user, e, socket, channel)}
      >
        <FaPlus />
      </div>
    </div>
  );
};

export default InviteUser;
