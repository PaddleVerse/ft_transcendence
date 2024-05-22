import React, { useEffect, useState } from "react";
import { rajdhani } from "@/app/utils/fontConfig";
import OneGame_2 from "./OneGame_2";
import { cn } from "@/components/cn";
import axios from "axios";
import { fetchData, ipAdress } from "@/app/utils/index";
import { useGlobalState } from "@/app/components/Sign/GlobalState";

const MatchHistory_2 = () => {
  const { state, dispatch } = useGlobalState();
  const { user, socket } = state;
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchData(`/match/history/${user?.id}`, "GET", null)
      .then((res: any) => {
        if (!res) return;
        setData(res?.data?.reverse());
      })
      .catch((error) => {});
  }, [state]);
  
  // Calculate winner and loser streaks
  return (
    <div className="w-full rounded-md bg-primaryColor no-scrollbar overflow-y-auto h-[700px] text-white flex flex-col overflow-x-hidden">
      <div className="w-full p-6 sticky top-0 bg-primaryColor z-30">
        <h1
          className={cn(
            `sm:text-4xl text-2xl font-semibold`,
            rajdhani.className
          )}
        >
          All Matches
        </h1>
      </div>
      <div className="w-full h-full px-6 flex flex-col gap-[12px] ml-1">
        {data.length === 0 && (
          <div className="w-full h-full flex justify-center items-center">
            <h1 className="text-2xl">No matches yet</h1>
            </div>
            )}
        {data.map((item, index) => {
          const marginOfVictory = item.winner_score - item.loser_score;
          const averageScore = (item.winner_score + item.loser_score) / 2;
          return (
            <OneGame_2
              status={item.winner === user.id ? "win" : "lose"}
              marginOfVictory={marginOfVictory}
              averageScore={averageScore}
              winnerStreak={item.winner_streak}
              loserStreak={1}
              key={index}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MatchHistory_2;
