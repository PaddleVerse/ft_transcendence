"use client";

import { motion } from 'framer-motion';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGlobalState } from "../../Sign/GlobalState";
import { cn } from '@/components/cn';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchData, ipAdress } from '@/app/utils';
interface Props {
  user: any;
  length: number;
  index: number;
}

const LeaderRow = ({ user, length, index }: Props) => {
  const router = useRouter();
  const { state } = useGlobalState();
  const User: any = state?.user;
  const [wins, setWins] = useState(0);
  const [loses, setLoses] = useState(0);

  const handleClick = () => {
    if (user?.id === User?.id) {
      router.push(`/Dashboard`);
      return;
    }
    router.push(`/Dashboard/Profile?id=${user?.id}`);
  };

  useEffect(() => {
    fetchData(`/match/history/wins/${user?.id}`, "GET", null)
      .then((res:any) => {
        if (!res) return;
        setWins(res?.data);
      })
      .catch((err) => {
      });
    
      fetchData(`/match/history/losses/${user?.id}`, "GET", null)
      .then((res:any) => {
        if (!res) return;
        setLoses(res?.data);
      })
      .catch((err) => {
      });
  }, [state]);
  return (
    <motion.tr
      className={cn(
        'text-white sm:text-[12px] text-[10px] cursor-pointer',
        user?.id % 2 === 0 ? 'bg-[#101823]' : 'bg-[#161F2F]',
        user?.id === state?.user?.id ? 'bg-yellow-700' : ''
      )}
      onClick={handleClick}
      initial={{ opacity: 0, y:-20 }}
      animate={{ opacity: 1, y:0 }}
      transition={{ delay: 0.25 * index }}
    >
      <td scope="row" className=" sm:py-[7px] font-medium text-[14px]">
        {index + 1 === 1 ? (
          <div className="flex items-center justify-center">
            <Image
              width={28}
              height={28}
              src="/1_leaderboard.svg"
              alt="image"
            />
          </div>
        ) : index + 1 === 2 ? (
          <div className="flex items-center justify-center">
            <Image
              width={28}
              height={28}
              src="/2_leaderboard.svg"
              alt="image"
            />
          </div>
        ) : index + 1 === 3 ? (
          <div className="flex items-center justify-center">
          <Image
            width={28}
            height={28}
            src='/3_leaderboard.svg'
            alt="image"
            
            />
        </div>
        ) : (
          <span className="flex items-center justify-center text-[17px] font-semibold">{index + 1}</span>
          
        )}
      </td>
      <td className="sm:py-[7px] text-[13px] flex items-center gap-2 font-[500] text-center">
        <Image
          width={100}
          height={100}
          src={user?.picture}
          alt="image"
          className="w-6 h-7 rounded-full object-cover md:w-7 sm:mt-0 mt-[8px]"
        />
        <span className=" lg:hidden xl:inline sm:inline hidden text-[14px]">
          {user?.name}
        </span>
      </td>
      <td className=" sm:py-[7px] pl-2 text-[14px]">{Math.floor(user?.xp / 100) + 1}</td>
      <td className=" sm:py-[7px] pl-2 text-[#15E5B4] text-[14px]">{wins}</td>
      <td className=" sm:py-[7px] pl-2 text-[14px]">{loses}</td>
      <td className="  sm:py-[7px] pl-4 text-[14px]">{(wins / length).toFixed(1)}</td>
    </motion.tr>
  );
};

export default LeaderRow;
