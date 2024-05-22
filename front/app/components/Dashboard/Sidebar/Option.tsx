"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { PiChatCircleTextLight, PiGameController } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { useGlobalState } from "../../Sign/GlobalState";
import MainOptions from "./MainOptions";
import { cn } from "@/components/cn";

const gameNames = ["Overview", "Leaderboard", "Settings"];

const Option = ({ label, expanded }: { label: string; expanded: boolean }) => {
  const [showElements, setShowElements] = useState(false);
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop();
  const router = useRouter();

  const handleDashboardClick = () => {
    if (label === "Dashboard") {
      setShowElements(!showElements);
    }
    if (label === "Chat") {
      router.push("/Dashboard/Chat");
    }
    if (label === "Shop") {
      router.push("/Dashboard/Shop");
    }
    if (label === "Search") {
      router.push("/Dashboard/Search");
    }
    if (label === "Game") {
      router.push("/Dashboard/Game");
    }
  };
  return (
    <div className="relative overflow-visible">
      <motion.div onClick={handleDashboardClick}>
        <MainOptions
          label={label}
          showElements={showElements}
          expanded={expanded}
        >
          {label === "Dashboard" ? (
            <RxDashboard className="hover:bg-[#34202A]" />
          ) : label === "Chat" ? (
              <PiChatCircleTextLight className="hover:bg-[#34202A]" />
          ) : label === "Shop" ? (
            <LiaShoppingCartSolid className="hover:bg-[#34202A]" />
          ) : label === "Search" ? (
            <IoIosSearch className=" hover:bg-[#34202A]" />
          ) : label === "Game" ? (
            <PiGameController className="hover:bg-[#34202A]" />
          ) : (
            <RxDashboard />
          )}
        </MainOptions>
      </motion.div>
      <motion.div>
        {!expanded && showElements && (
          <motion.div
            className="absolute  top-[49px] left-[40px] bg-gradient-to-br from-optionMenu to-dashBack bg-optionMenu  h-[130px] rounded-2xl w-[150px]"
            animate={{ boxShadow: "20px white" }}
          ></motion.div>
        )}
        {gameNames.map((game, index) => (
          <AnimatePresence key={index}>
            {showElements && (
              <motion.div
                initial={{ opacity: 0, y: -20, x: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: 40,
                  height: 20,
                  marginTop: expanded ? 15 : 12,
                  paddingLeft: expanded ? "20px" : "0px",
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  x: 0,
                  height: 0,
                  marginTop: 0,
                  transition: { duration: 0.2, delay: index * 0.2 },
                }}
                transition={{ duration: 0.29, delay: index * 0.2 }}
              >
                <Link href={`/Dashboard/${game === "Overview" ? "" : game}`}>
                  <span
                    className={cn(
                      "py-2 block w-32 rounded-lg cursor-pointer text-sm  pl-4 hover:bg-[#34202A] hover:text-sidebarRedColor text-buttonGray",
                      !expanded ? "ml-2" : "",
                      lastSegment === game ||
                        (lastSegment === "Dashboard" && game === "Overview")
                        ? "bg-[#34202A] text-sidebarRedColor"
                        : ""
                    )}
                  >
                    {game}
                  </span>
                </Link>
                <motion.div
                  initial={{
                    position: "absolute",
                    top: "-32px",
                    left: "0px",
                  }}
                  animate={{
                    position: "absolute",
                    top: expanded ? "32" : "-37px",
                    left: expanded ? "0px" : "-22px",
                  }}
                >
                  <Image
                    src={"/Vector.svg"}
                    width={13}
                    height={13}
                    alt="image"
                    className="z-0 h-auto w-auto"
                  ></Image>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </motion.div>
    </div>
  );
};

export default Option;
