import React from "react";
import { Button } from "@/components/ui/moving-border";
import Image from "next/image";
import { getDate } from "@/app/utils";
import { inter, rajdhani } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";

const Userstatus = ({
  target,
  status,
  recv,
  friendReq,
  removeFriend,
  handleSender,
}: any) => {
  return (
    <div
      className={cn(
        "2xl:w-[30%] sm:w-[40%]   border-orange-500 bg-secondaryColor  py-2 flex  h-[250px]  px-2 rounded-md",
        rajdhani.className
      )}
    >
      <div className="flex flex-col w-full h-full relative justify-around gap-2  ">
        <div className="flex justify-around items-center">
          <div
            className={` ${inter.className} flex flex-col text-white gap-1 relative`}
          >
            <div className="flex items-center">
              <span className="relative flex h-3 w-3 mr-2">
                <span
                  className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full",
                    target?.status === "ONLINE"
                      ? "bg-green-500"
                      : "bg-gray-500",
                    "opacity-75"
                  )}
                ></span>
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-3 w-3",
                    target?.status === "ONLINE" ? "bg-green-500" : target?.status === "IN_GAME" ? "bg-sidebarRedColor" : "bg-gray-500"
                  )}
                ></span>
              </span>
              <span
                className={cn(
                  "2xl:text-xs xl:text-[12px] sm:text-[11px] text-[13px]",
                  target?.status === "ONLINE"
                    ? "text-green-500"
                    : target?.status === "IN_GAME"
                    ? "text-sidebarRedColor"
                    : "text-gray-500"
                )}
              >
                {target?.status === "ONLINE" ? "online" : target?.status === "IN_GAME" ? "IN_GAME" :"offline"}
              </span>
            </div>
            <span className="text-buttonGray 2xl:text-[15px] xl:text-[8px] sm:text-[8px] text-[13px]">
              {getDate(target?.createdAt)}
            </span>
            <span className="text-buttonGray 2xl:text-[13px] xl:text-[12px] sm:text-[10px] text-[13px]">
              public channels
            </span>
            <div className="flex gap-2">
              <Image src={"/group.svg"} width={25} height={25} alt="group" />
              <Image src={"/group.svg"} width={25} height={25} alt="group" />
            </div>
          </div>
          <Image
            src={"/badge2.png"}
            width={170}
            height={170}
            priority
            alt="badge"
            className="2xl:w-[180px] sm:-right-[20px] right-[0px] bottom-[25px] sm:bottom-[45px] xl:w-[120px]  2xl:right-[10px] 2xl:bottom-[100px] xl:-right-[15px] xl:bottom-[95px] lg:w-[95px]"
          />
        </div>
        {recv && recv === "PENDING" ? (
          <div className="flex flex-row gap-4">
            <Button
              onClick={() => friendReq("acceptFriendRequest")}
              borderRadius="10px"
              borderClassName=" bg-[radial-gradient(var(--green-500)_40%,transparent_60%)]"
              className={`text-white border-slate-800 w-full sm:mt-0 mt-4 bg-green-500/[0.5]`}
            >
              ACCEPT
            </Button>
            <Button
              onClick={() => friendReq("rejectFriendRequest")}
              borderRadius="10px"
              borderClassName=" bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
              className={`text-white border-slate-800 w-full sm:mt-0 mt-4  bg-mainRedColor/[0.6]`}
            >
              REJECT
            </Button>
          </div>
        ) : recv && recv === "ACCEPTED" ? (
          <Button
            onClick={removeFriend}
            borderRadius="10px"
            borderClassName="bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
            className={`text-white border-slate-800 w-full sm:mt-0 mt-4  bg-mainRedColor/[0.6]`}
          >
            REMOVE FRIEND
          </Button>
        ) : recv && recv === "BLOCKED" ? null : status &&
          status === "BLOCKED" ? null : (
          <Button
            onClick={handleSender}
            containerClassName="sm:h-[20%] h-full"
            borderRadius="10px"
            borderClassName={
              status === "ACCEPTED"
                ? "bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
                : ""
            }
            className={cn(
              "text-white border-slate-800 w-full",
              status === "PENDING"
                ? "bg-slate-600"
                : status === "ACCEPTED"
                ? "bg-red-600/[0.3]"
                : ""
            )}
          >
            {status && status === "PENDING"
              ? "PENDING"
              : status && status === "ACCEPTED"
              ? "REMOVE FRIEND"
              : "ADD FRIEND"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Userstatus;
