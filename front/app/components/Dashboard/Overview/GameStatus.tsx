/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/components/cn";
import { useGlobalState } from "../../Sign/GlobalState";
import { fetchData, ipAdress } from "@/app/utils"


const GameStatus = () => {

  const { state, dispatch } = useGlobalState();
  const { GameStatus, user } = state;
  const refreshUser = async () => {
    try {
      const response : any = await fetchData(`/user/${user?.id}`, "GET", null);
      if (!response) return;
      const usr = response?.data;
      dispatch({type: 'UPDATE_USER', payload: usr});
    } catch (error) {}
  }

  useEffect(() => {
    refreshUser();
    setTimeout(() => {
      dispatch({ type: "UPDATE_GAMESTATUS", payload: null });
    }, 5000);
  }, []);


  return (
    GameStatus && (
      <motion.div className="fixed inset-0 sm:flex hidden items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            className={cn(
              "bg-green-700 rounded-xl flex justify-center p-[100px] text-white relative items-center",
              GameStatus === "win" ? "bg-green-700" : "bg-red-800"
            )}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                ease: "easeIn",
                duration: 0.15,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
              transition: {
                ease: "easeIn",
                duration: 0.15,
              },
            }}
          >
            {GameStatus === "win" ? (
              <div className="flex flex-col gap-8 items-center">
                <Image
                  src={"/confetti.svg"}
                  width={95}
                  height={95}
                  alt="confetti image"
                />
                <span>You Win</span>
                <button
                  className="px-10 py-2 border rounded-md bg-green-900"
                  onClick={() =>
                    dispatch({ type: "UPDATE_GAMESTATUS", payload: null })
                  }
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-8 items-center">
                <Image
                  src={"/sad.svg"}
                  width={95}
                  height={95}
                  alt="sad image"
                />
                <span>You Lose</span>
                <button
                  className={cn(
                    "px-10 py-2 border rounded-md bg-green-900",
                    GameStatus === "win" ? "bg-green-900" : "bg-red-900"
                  )}
                  onClick={() =>
                    dispatch({ type: "UPDATE_GAMESTATUS", payload: null })
                  }
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
      </motion.div>
    )
  );
};

export default GameStatus;
