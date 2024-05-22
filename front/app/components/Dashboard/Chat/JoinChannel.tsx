import React, { useEffect, useRef, useState } from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import JoinChannelBubble from "./JoinChannelBubble";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { user } from "@/app/Dashboard/Chat/type";
import { useForm } from "react-hook-form";
import { ipAdress, getCookie, fetchData } from "@/app/utils";

const accessToken = getCookie("access_token");

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

const JoinChannel = ({
  handleClick,
  user,
}: {
  handleClick: () => void;
  user: user;
}) => {
  const [channels, setChannels] = useState<any[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<any[]>([]);
  const search = useRef<HTMLInputElement>(null);
  const { register } = useForm();
  useEffect(() => {
    if (!accessToken) return;
    const fetchChannels = async () => {

      await fetchData(
        `/channels/all/${user?.id}`,
        "GET",
        null
      )
      .then((data : any) => {
        if (!data) return;
        setChannels(data.data);
        setFilteredChannels(data.data);
      })
      .catch((err) => {
      });
    };
    fetchChannels();
  }, []);

  const filterBySearch = (e: React.ChangeEvent, value: string | null) => {
    const res = channels.filter((channel) => {
      return channel.name
        .toLowerCase()
        .includes(value?.toLowerCase() as string);
    });
    setFilteredChannels(res);
  };

  return (
    <div
      className={`fixed inset-0 sm:flex hidden ${inter.className} items-center justify-center bg-black bg-opacity-50 z-50 text-white`}
    >
      <motion.div
        className="overflow-y-auto border border-red-500/[0.3] h-[70%] 2xl:w-[35%] xl:w-[55%] sm:w-[70%] px-10 py-16 flex flex-col bg-primaryColor rounded-xl"
        initial="closed"
        animate="open"
        exit="closed"
        variants={modalVariants}
        style={{
          backdropFilter: "blur(20px)",
        }}
      >
        <h1 className="text-3xl">Expand your horizon</h1>
        <div className="w-full relative mt-5">
          <input
            type="text"
            className="rounded-md text-black pl-8 w-full h-[45px] focus:outline-none border-none focus:ring-[2px] focus:ring-red-500/[0.5] transition duration-300 ease-in-out"
            placeholder="Search"
            {...register("search", { required: true })}
            ref={search}
            onChange={(e) => {
              filterBySearch(e, search.current?.value!);
            }}
          />
          <IoIosSearch
            className="absolute top-[15px] left-[10px] text-gray-400"
            size={17}
          />
        </div>
        <div className=" grid-cols-2 grid mt-10 overflow-y-auto">
          {filteredChannels.map((channel, key) => {
            return (
              <JoinChannelBubble
                handleClick={handleClick}
                key={key}
                lock={channel.state === "protected"}
                channel={channel}
                user={user}
              />
            );
          })}
        </div>
        <div className="absolute top-2 right-2 cursor-pointer">
          <AiOutlineClose size={30} onClick={() => handleClick()} />
        </div>
      </motion.div>
    </div>
  );
};

export default JoinChannel;
