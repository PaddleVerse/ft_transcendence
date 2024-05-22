import { cn } from "@/components/cn";
import { motion } from "framer-motion";
import React, { ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa";
const MainOptions = ({
  children,
  showElements,
  label,
  expanded,
}: {
  children: ReactNode;
  showElements: boolean;
  label: string;
  expanded: boolean;
}) => {
  return (
    <motion.div
      className={cn(
        "group p-3",
        label === "Dashboard" ? "mt-2" : "mt-5",
        "text-sm relative z-10 rounded-lg text-[#707b8f]  transition-colors duration-300 cursor-pointer hover:bg-[#221D29]",
        showElements && "bg-[#221D29]",
        "bg-secondaryColor"
      )}
      initial={{ marginLeft: "15px" }}
      animate={{
        marginLeft: expanded ? "15px" : "-2px",
        paddingRight: expanded ? "10px" : "40px",
      }}
    >
      <div
        className={cn(
          "bg-transparent inset-0 flex justify-between items-center group-hover:text-sidebarRedColor transition-colors duration-300",
          showElements && "text-sidebarRedColor z-10"
        )}
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ fontSize: "26px" }}
            animate={{
              fontSize: expanded ? "26px" : "28px",
            }}
          >
            {children}
          </motion.div>

          <motion.span
            className="2xl:text-[18px] text-[13px]"
            initial={{ opacity: 1 }}
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ duration: expanded ? 1.5 : 0.1 }}
          >
            {label}
          </motion.span>
        </div>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            rotate: showElements ? 180 : 0,
            opacity: expanded ? 1 : 0,
            transition: { duration: expanded ? 0.8 : 0.2 },
          }}
        >
          {label === "Dashboard" ? <FaChevronDown /> : ""}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MainOptions;
