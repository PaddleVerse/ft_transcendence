"use client";
import { motion } from "framer-motion";
import { ChatCard } from "@/app/components/Dashboard/Chat/ChatCard";
import { AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import JoinChannel from "@/app/components/Dashboard/Chat/JoinChannel";
import Image from "next/image";
import CreateChannel from "@/app/components/Dashboard/Chat/createChannel";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });
import { fetchData } from "@/app/utils";

const fetchChatList = async (
  userId: string,
  setFilteredChatList: Dispatch<SetStateAction<any[]>>
) => {
  try {
    const res: any = await fetchData(`/chat/chatlist/${userId}`, "GET", null);
    const dataWithMessages = await Promise.all(
      res.data.map(async (value: any) => {
        if (value.user) {
          const messageRes = await fetchData(
            `/conversations/lastMessage?uid1=${userId}&uid2=${value?.id}`,
            "GET",
            null
          );
          if (!messageRes) return { ...value, msg: {} };
          return { ...value, msg: messageRes?.data };
        } else {
          const channelRes = await fetchData(
            `/channels/messages/lastMessage/${value?.id}?uid=${userId}`,
            "GET",
            null
          );
          if (!channelRes) return { ...value, msg: {} };
          return { ...value, msg: channelRes?.data };
        }
      })
    );
    setFilteredChatList(dataWithMessages);
    return dataWithMessages;
  } catch (error) {
  }
};

const Page = ({ children }: { children: React.ReactNode }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingobject, setTypingObject] = useState<any>();
  const { state, dispatch } = useGlobalState();
  const { show } = state;
  const { user, socket } = state;
  const [modlar, setModlar] = useState(false);
  const [createModlar, setCreateModlar] = useState(false);
  const router = useRouter();
  const messagesFilter = useRef<HTMLInputElement>(null);
  const [FilteredChatList, setFilteredChatList] = useState<any[]>([]);
  const {
    data: chatList,
    isLoading: listLoading,
    isError: listError,
  } = useQuery({
    queryFn: () => fetchChatList(user?.id, setFilteredChatList),
    queryKey: ["chatList"],
  });
  const clt = useQueryClient();

  useEffect(() => {
    !show && setShowMessage(false);
  }, [show]);

  const handleEscapeKeyPress = useCallback((e: any) => {
    if (e.key === "Escape") {
      setModlar(false);
      setCreateModlar(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEscapeKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [handleEscapeKeyPress]);

  useEffect(() => {
    socket?.on("update", (data: any) => {
      if (data && data.type && (data.type === "leave" || data.type === "join")) {
        clt.invalidateQueries({
          queryKey: ["chatList"],
        });
        return;
      }
      if (data && data.type && data.type === "banned") {
        toast.error("You have been banned from this channel");
        clt.invalidateQueries({
          queryKey: ["chatList"],
        });
        router.push("/Dashboard/Chat");
        return;
      }
      if (data && data.type && data.type === "kicked") {
        toast.error("You have been kicked from this channel");
        clt.invalidateQueries({
          queryKey: ["chatList"],
        });
        router.push("/Dashboard/Chat");
        return;
      }
      if (data && data.type && data.type === "typing") {
        setTypingObject(data);
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setTypingObject(null);
        }, 2000);
      }
      clt.invalidateQueries({
        queryKey: ["chatList"],
      });
      clt.invalidateQueries({
        queryKey: ["messages"],
      });
    });
    socket?.on("ok", (data: any) => {
      if (data === null) return;
      clt.invalidateQueries({
        queryKey: ["chatList"],
      });
    });
    socket?.emit("refresh");
    return () => {
      socket?.off("ok");
      // socket?.off("update");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, clt]);

  const handleClick = () => {
    setModlar(false);
  };

  const handleSwitching = () => {
    setShowMessage(!showMessage);
    dispatch({ type: "UPDATE_SHOW", payload: true });
  };
  function useWindowSize() {
    const [size, setSize] = useState(0);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }
  const tablet = useWindowSize() < 1024;

  const filterMessages = () => {
    if (!messagesFilter.current) return;
    const value = messagesFilter.current.value;

    const filtered = FilteredChatList?.filter((chat: any) => {
      return chat.name.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredChatList(filtered);
  };

  return (
    <div className="w-[91%] mx-auto lg:h-full md:h-[92%] relative h-[80%] flex justify-center mt-5 overflow-hidden">
      <AnimatePresence>
        {modlar ? (
          <JoinChannel handleClick={handleClick} user={state?.user} />
        ) : createModlar ? (
          <CreateChannel handleClick={() => setCreateModlar(false)} />
        ) : null}
      </AnimatePresence>
      <div className="lg:max-h-[95%]  lg:w-[91%] w-full h-full ">
        <div
          className={`h-full w-full flex antialiased text-gray-200 bg-primaryColor rounded-xl ${inter.className}`}
          style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(13, 9, 10, 0.4)",
          }}
        >
          <div className="flex-1 flex flex-col">
            <main className="flex-grow flex flex-row min-h-0">
              <motion.section
                className={` b flex flex-col flex-none overflow-auto  ${
                  showMessage && tablet ? "invisible" : "visible"
                } group lg:max-w-[300px] md:w-2/5 no-scrollbar`}
                initial={{ display: "flex", width: "100%", opacity: 1 }}
                animate={{
                  display: showMessage && tablet ? "hidden" : "flex",
                  width: showMessage && tablet ? "0" : "100%",
                  opacity: showMessage && tablet ? 0 : 1,
                  transition: { duration: 0.25 },
                }}
              >
                <div className=" p-4 flex-none mt-4">
                  <p
                    className={`text-2xl font-bold md:block group-hover:block mb-4`}
                  >
                    Messages
                  </p>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    onChange={filterMessages}
                  >
                    <div className="relative sm:block hidden">
                      <label>
                        <input
                          className="rounded-lg py-2 pr-6 pl-10 w-full bg-white focus:outline-none text-black focus:shadow-md transition duration-300 ease-in"
                          type="text"
                          placeholder="Search Messenger"
                          ref={messagesFilter}
                        />
                        <span className="absolute top-[4px] left-0 mt-2 ml-3 inline-block">
                          <svg viewBox="0 0 24 24" className="w-4 h-4">
                            <path
                              fill="#bbb"
                              d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                            />
                          </svg>
                        </span>
                      </label>
                    </div>
                  </form>
                </div>
                <div className="flex flex-row justify-around w-full">
                  <p className="ml-8">
                    Join a{" "}
                    <span
                      onClick={() => setModlar(true)}
                      className="text-sky-500 cursor-pointer"
                    >
                      Public
                    </span>{" "}
                    Group Chat
                  </p>
                  <div>
                    <motion.span
                      className=""
                      onClick={() => setCreateModlar(true)}
                    >
                      <Image
                        width={0}
                        height={0}
                        sizes="height:100vh width:100vw"
                        src="/Chat/Vector.svg"
                        alt="create svg"
                        className="w-[24px] cursor-pointer"
                      />
                    </motion.span>
                  </div>
                </div>
                <div
                  className="contacts p-2 flex-1 overflow-y-scroll no-scrollbar"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  {Array.isArray(chatList) &&
                    chatList.map((value: any, key: any) => {
                      return (
                        <ChatCard
                          key={key}
                          istyping={
                            typing
                              ? typingobject.target === "dm" && value.user
                                ? value.id === typingobject.sender.id
                                : value.id === typingobject.id &&
                                  typingobject.sender.id !== user.id
                              : false
                          }
                          swipe={setShowMessage}
                          index={key}
                          value={value}
                          self={state?.user}
                          handleClick={handleSwitching}
                          msg={value.msg}
                        ></ChatCard>
                      );
                    })}
                </div>
              </motion.section>
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
