import { channel, user } from "@/app/Dashboard/Chat/type";
import Image from "next/image";
import axios from "axios";
import React, { useRef, useState } from "react";
import { GoLock } from "react-icons/go";
import { Socket } from "socket.io-client";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useGlobalState } from "../../Sign/GlobalState";
import { useQueryClient } from "@tanstack/react-query";
import { ipAdress, getCookie, fetchData } from "@/app/utils";

const JoinChannelBubble = ({
  lock,
  channel,
  handleClick,
  user,
}: {
  lock: boolean;
  channel: channel;
  user: user;
  handleClick: () => void;
}) => {
  const lockRef = useRef<HTMLInputElement>(null);
  const { register } = useForm();
  const [unlock, setUnlock] = useState(false);
  const { state, dispatch } = useGlobalState();
  const clt = useQueryClient();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (lock) {
      channel.key = lockRef.current?.value as string;
      const obj = {
        participant: {
          user_id: user?.id,
          channel_id: channel?.id,
        },
        user: user,
        channel: channel?.id,
      };
      try {
        const res = await fetchData(
          `/participants`,
          "POST",
          obj
        );
        if (!res) return;
        toast.success(`you have joined ${channel?.name}`);
        state?.socket?.emit("joinRoom", {
          user: user,
          roomName: channel?.name,
          type: "self",
        });
        clt?.invalidateQueries({ queryKey: ["chatList"] });
      } catch (error) {
        toast.error("failed to join channel");
      }
    } else {
      const obj = {
        participant: {
          user_id: user?.id,
          channel_id: channel?.id,
        },
        user: user,
        channel: channel?.id,
      };
      try {
        const res = await fetchData(
          `/participants`,
          "POST",
          obj
        );
        if (!res) return;
        toast.success(`you have joined ${channel?.name}`);
        clt?.invalidateQueries({ queryKey: ["chatList"] });
        state?.socket?.emit("joinRoom", {
          user: user,
          roomName: channel?.name,
          type: "self",
        });
      } catch (error) {
        toast.error("failed to join channel");
      }
    }
    setUnlock(false);
  };
  return (
    <div
      className="flex gap-2 items-center col-start text-inherit relative py-3  rounded-lg hover:bg-red-900 hover:bg-opacity-10 cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        if (lock) {
          setUnlock(true);
        } else {
          handleSubmit(e);
        }
      }}
    >
      <Image
        src={channel?.picture}
        alt="image"
        className="lg:w-[70px] lg:h-[70px] md:w-[65px] md:h-[65px] object-fill rounded-full"
        width={100}
        height={100}
      />
      <div className="flex flex-col gap-1">
        <h2 className="2xl:text-md xl:text-[15px] md:text-[14px]">
          {channel?.name}
        </h2>
        {unlock && lock ? (
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              className="left-0 top-[45px] rounded-md lp-2 w-[180px] bg-dashBack h-10 text-white"
              {...register("lockRef", { required: true })}
              ref={lockRef}
            />
          </form>
        ) : (
          <p className="text-gray-400 xl:text-sm truncate md:tex  text-xs lg:max-w-full md:max-w-[120px] ">
            {channel?.topic && channel?.topic?.substring(0, 30) +
              (channel?.topic?.length > 30 ? " ..." : "")}
          </p>
        )}
      </div>
      {lock && (
        <div>
          <GoLock className="absolute top-6 2xl:right-[91px] xl:right-[41px] lg:right-[35px] text-white hidden md:text-[14px] 2xl:text-[16px] lg:flex" />
        </div>
      )}
    </div>
  );
};

export default JoinChannelBubble;
