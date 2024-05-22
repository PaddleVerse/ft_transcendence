import { motion } from "framer-motion";
import React from "react";

const ProfileUser = ({
  image,
  name,
  expanded,
}: {
  image: string;
  name: string;
  expanded: boolean;
}) => {
  return (
    <div>
      <div className="flex gap-4 mt-7 items-center text-buttonGray">
        <motion.img
          src={image}
          alt="image"
          className="min-w-[50px] max-w-[50px] rounded-full"
          initial={{ marginLeft: 0 }}
          animate={{ marginLeft: expanded ? 0 : -28 }}
        />
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: expanded ? 2.2 : 0.2 }}
          className={`2xl:text-[15px] text-[13px]`}
        >
          {name}
        </motion.span>
      </div>
    </div>
  );
};

export default ProfileUser;
