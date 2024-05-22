"use client";
import React from "react";
import Standing from "./Standing/Standing";
import UserProfileSecond from "./UserProfileSecond/UserProfileSecond";
import Achievements from "./Achievements/Achievements";
import Items from "./Items/Items";
import { useGlobalState } from "../../Sign/GlobalState";
import MatchHistory_2 from "./MatchHistory/MatchHistory_2";
import LineChart from "./Chart/LineChart";
import GameStatus from "./GameStatus";

const ContentCenter = () => {
  const { state } = useGlobalState();
  const user: any = state?.user;

  return (
    <div className="w-[100%] mt-[50px] flex flex-col gap-10 items-center">
        <GameStatus />
      <div className="xl:flex-row w-[94%] flex flex-col gap-7">
        <div className="flex flex-col w-full gap-8 sm:pb-[150px]">
          <UserProfileSecond user={user} />
          <MatchHistory_2 />
          <div className="w-full h-[450px] flex gap-4 lg:flex-row flex-col border-red-500 ">
            <Items />
            <div className="flex bg-primaryColor lg:w-[50%] w-full h-full text-white text-4xl rounded-md">
              <LineChart />
            </div>
          </div>
        </div>
        <div className="flex flex-col xl:w-[20%] gap-7">
          <Achievements />
          {/* <Standing /> */}
        </div>
      </div>
    </div>
  );
};

export default ContentCenter;
