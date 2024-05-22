'use client';
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { fetchData, ipAdress } from "@/app/utils";

import React,{useState,useEffect} from "react";
import axios from "axios";
import { useGlobalState } from "../../Sign/GlobalState";

const plusjakarta = Plus_Jakarta_Sans({subsets:["latin"], weight:["300","400","500","700"]})

const PlacingElement = () => {
  const [users, setUsers] = useState<any>([]);
  const {state} = useGlobalState();
  const router = useRouter();

  useEffect(() => {
      fetchData(`/user/top`, "GET", null)
      .then((res:any) => {
        if (!res) return;
        setUsers(res.data);
      })
      .catch((err) => {
      });
  } ,[]);

  const handleClick = (id: number) => {
    if (id === state?.user?.id) {
      router.push(`/Dashboard`);
      return;
    }
    router.push(`/Dashboard/Profile?id=${id}`);
  }

  return (
    <div className=" flex gap-[7px] items-center h-full relative pb-[20px]">
      <div className="flex flex-col items-center text-white gap-4">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden mt-20  border-[3px] border-progressIndicator "
        >
            <Image
              onClick={() => handleClick(users[1].id)}
              src={users && users[1] && users[1].picture ? users[1].picture : "/leaderboard/2.jpeg"}
              width={100}
              height={100}
              alt="image"
              style={{objectFit:"cover"}}
              className="rounded-full cursor-pointer"
              property="image"
            />
          <div className={`absolute bottom-[62px] left-[38px] flex items-center justify-center bg-progressIndicator w-6 h-6 rounded-full text-[12px] ${plusjakarta.className}`}>
            2
          </div>
        </div>
        <div className="text-[11px] flex flex-col items-center">
          <div>{users && users[1] && users[1].name ? users[1].name : "unknown"}</div>
          <div>42pts</div>
        </div>
      </div>
      <div className="flex flex-col items-center text-white gap-4">
        <div className="w-[120px] h-[120px] rounded-full overflow-hidden  border-[3px] border-progressIndicator ">
            <Image
              onClick={() => handleClick(users[0].id)}
              src={users && users[0] && users[0].picture ? users[0].picture : "/leaderboard/2.jpeg"}
              width={120}
              height={120}
              alt="image"
              style={{objectFit:"cover"}}
              className="rounded-full cursor-pointer"
              property="image"
            />
          <div className={`absolute bottom-[92px] left-[157px] flex items-center justify-center bg-progressIndicator w-6 h-6 text-white rounded-full text-[12px] ${plusjakarta.className}`}>
            1
          </div>
        </div>
        <div className="text-[11px] flex flex-col items-center">
          <div>{users && users[0] && users[0].name ? users[0].name : "unknown"}</div>
          <div>42pts</div>
        </div>
      </div>
      <div className="flex flex-col items-center text-white gap-4">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden mt-20 border-[3px] border-progressIndicator">
            <Image
              onClick={() => handleClick(users[2].id)}
              src={users && users[2] && users[2].picture ? users[2].picture : "/leaderboard/2.jpeg"}
              width={100}
              height={100}
              alt="image"
              style={{objectFit:"cover"}}
              className="rounded-full cursor-pointer"
              property="image"
            />
          <div className={`absolute bottom-[57px] left-[272px] flex items-center justify-center bg-progressIndicator w-6 h-6 text-white rounded-full text-[12px] ${plusjakarta.className}`}>
            3
          </div>
        </div>
        <div className="text-[11px] flex flex-col items-center" >
          <div>{users && users[2] && users[2].name ? users[2].name : "unknown"}</div>
          <div>42pts</div>
        </div>
      </div>
    </div>
  );
};

export default PlacingElement;
