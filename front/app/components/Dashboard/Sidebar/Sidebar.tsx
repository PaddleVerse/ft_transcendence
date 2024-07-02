"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaChevronRight, FaPlus } from "react-icons/fa6";
import Option from "./Option";
import ProfileUser from "./ProfileUser";
import { useSwipeable } from "react-swipeable";
import { useGlobalState } from "../../Sign/GlobalState";
import { io } from "socket.io-client";
import { oswald } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";
import { fetchData, ipAdress } from "@/app/utils";
const image =
  "https://preview.redd.it/dwhdw8qeoyn91.png?width=640&crop=smart&auto=webp&s=65176fb065cf249155e065b4ab7041f708af29e4";

interface User {
  nickname: string;
  name: string;
  picture: string;
  banner_picture: string;
  status: string;
  level: Number;
  createdAt: Date;
}

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
const Sidebar = () => {
  const { state, dispatch } = useGlobalState();
  const user: any = state?.user;
  const [expanded, setExpanded] = useState(true);
  const sidebarRef = useRef(null);
  const handlers = useSwipeable({
    onSwipedLeft: () => setExpanded(false),
    onSwipedRight: () => setExpanded(true),
  });

  const tablet = useWindowSize() < 769;
  const containerVariants = {
    opened: { width: "270px" },
    closed: { width: tablet ? "1px" : "95px" },
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (dispatch === undefined || state === undefined) return;

    let socket: any = null;

    fetchData(`/auth/protected`, "GET", null)
      .then((res: any) => {
        if (!res) return;
        const data = res?.data;
        if (data || data?.message !== "Unauthorized") {
          socket = io(`https://${ipAdress}`, {
            query: { userId: data?.id },
          });

          dispatch({ type: "UPDATE_SOCKET", payload: socket });
          dispatch({ type: "UPDATE_USER", payload: data });
        }
      })
      .catch((error) => {
      });
    return () => {
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        "flex relative lg:h-[fit-content] h-auto z-50",
        oswald.className
      )}
      {...handlers}
    >
      <div className="h-screen w-full absolute bg-primaryColor"></div>
      <motion.div
        className="absolute border w-5 h-5 cursor-pointer z-40 lg:-right-[10px] -right-[15px] top-[80px] border-rightArrowColor lg:p-[2px] p-[20px]  text-rightArrowColor bg-rightArrowBg rounded-full flex items-center justify-center"
        onClick={() => setExpanded(!expanded)}
        initial={{ rotate: 180 }}
        animate={{ rotate: expanded ? 180 : 0 }}
      >
        <FaChevronRight />
      </motion.div>
      <motion.div
        className={cn(
          "text-white bg-primaryColor  flex-col h-full",
          tablet && !expanded ? "" : "pl-6 pr-7 z-20",
          "select-none sm:flex lg:relative absolute overflow-auto lg:overflow-visible no-scrollbar"
        )}
        variants={containerVariants}
        animate={expanded ? "opened" : "closed"}
        initial={"opened"}
        ref={sidebarRef}
        transition={{
          duration: 0.5,
        }}
      >
        <motion.div
          animate={{
            opacity: !expanded && tablet ? 0 : 1,
            transition: { duration: 0.5 },
          }}
          className="relative z-20"
        >
          <motion.div className=" flex gap-4 mt-[65px] items-center">
            <motion.img
              src={user && user?.picture ? user?.picture : "/b.png"}
              alt="image"
              className="object-cover h-[50px] w-[50px] rounded-full"
            />
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  className="flex flex-col text-center w-[150px] absolute left-[70px]"
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: expanded ? 1 : 0,
                    transition: { duration: 0.2 },
                  }}
                  key="modal"
                >
                  <span className="text-[12px] text-buttonGray">NOOB</span>
                  <span className="text-[17px] w-22">{user && user.name}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.span
            className="text-buttonGray text-[12px] mt-12 block"
            initial={{ paddingLeft: "29px" }}
            animate={{ paddingLeft: expanded ? "29px" : "8px" }}
          >
            MAIN
          </motion.span>
          <div>
            <motion.div>
              <Option label={"Dashboard"} expanded={expanded} />
              <Option label={"Chat"} expanded={expanded} />
              <Option label={"Game"} expanded={expanded} />
              <Option label={"Shop"} expanded={expanded} />
              <Option label={"Search"} expanded={expanded} />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
