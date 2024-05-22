import { message } from "@/app/Dashboard/Chat/type";
import React, { useEffect, useRef, useState } from "react";
import MiddleBubbleRight from "./RightBubbles/MiddleBubbleRight";
import MiddleBuble from "./LeftBubbles/MiddleBuble";
import { useGlobalState } from "../../Sign/GlobalState";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ipAdress, getCookie, fetchData } from "@/app/utils";

const accessToken = getCookie("access_token");

const FetchMessages = async (p: any, userId: string) => {
  try {
    if (p.subroute == "channel") {
      const mes = await fetchData(
        `/channels/messages/${p?.id!}?uid=${userId}`,
        "GET",
        null
      );
      if (!mes) return [];
      return mes.data;
    } else {
      const mes = await fetchData(
        `/conversations/messages?uid1=${p?.id!}&uid2=${userId}`,
        "GET",
        null
      );
      if (!mes) return [];
      return mes.data;
    }
  } catch (error) {
  }
};

const ChatComponent = ({
  handlers,
  us,
  channel,
  globalStateUserId,
}: {
  handlers: any;
  us: boolean;
  channel: boolean;
  globalStateUserId: number;
}) => {
  const p = useParams();
  const clt = useQueryClient();
  const { state, dispatch } = useGlobalState();
  const { socket, user } = state;
  const {
    data: messages,
    error: messagesError,
    isLoading: messagesLoading,
  } = useQuery<message[]>({
    queryFn: () => FetchMessages(p, user?.id!),
    queryKey: ["messages"],
  });
  const containerRef = useRef(null);

  useEffect(() => {
    const container: any = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  if (messages && messages.length === 0) {
    return (
      <div
        className="w-full h-full overflow-y-scroll no-scrollbar"
        {...handlers}
      >
        <div className="flex flex-row justify-start overflow-y-auto">
          <div className="text-sm text-gray-700 grid grid-flow-row gap-2 w-full">
            <p className="text-center text-gray-500">No messages yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full overflow-y-scroll no-scrollbar "
      {...handlers}
      ref={containerRef}
    >
      <div className="flex flex-row justify-start overflow-y-auto">
        <div className="text-sm text-gray-700 grid grid-flow-row gap-2 w-full">
          {messages &&
            messages.map((value, key: any) => {
              if (value.sender_id === globalStateUserId) {
                return <MiddleBubbleRight message={value} key={key} />;
              } else {
                return (
                  <MiddleBuble
                    message={value}
                    key={key}
                    showProfilePic={
                      (!messages[key + 1] ||
                        messages[key + 1].sender_id !== value.sender_id) &&
                      value &&
                      value.sender_picture
                    }
                    picture={messages[key].sender_picture}
                  />
                );
              }
            })}
        </div>
      </div>
      <p className="p-4 text-center text-sm text-gray-500">
        {messages &&
          messages[messages.length - 1].createdAt.toString().substring(0, 10) +
            " at " +
            messages[messages.length - 1].createdAt
              .toString()
              .substring(11, 16)}
      </p>
    </div>
  );
};

export default ChatComponent;
