import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { inter } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";
import axios from "axios";
import { fetchData, ipAdress } from "@/app/utils";
import { useGlobalState } from "@/app/components/Sign/GlobalState";
import { Infos } from "../types";
import toast from "react-hot-toast";

const PaddleCoin = ({ size , infos}: { size: string , infos: Infos}) => {
  const [hover, setHover] = React.useState(false);
  const [owned, setOwned] = React.useState(false);
  const [equipped, setEquipped] = React.useState(false);
  const {state, dispatch} = useGlobalState();
  const {user} = state;

  const refreshUser = async () => {
    try {
      const response : any = await fetchData(`/user/${user?.id}`, "GET", null);
      if (!response) return;
      const usr = response.data;
      dispatch({type: 'UPDATE_USER', payload: usr});
    } catch (error) {
    }
  }

  const handleClick = () => {
    if (owned && equipped) {
      fetchData(`/shop/paddle/disable`, "POST", {
        user_id: user?.id,
        color: infos.color
      }).then(
        (res:any) => {
          if (!res) return;
          if (res?.data?.status === "success")
          {
            setEquipped(false);
            refreshUser();
            toast.success(res?.data?.message);
          }
          else if (res?.data.status === "error")
            toast.error(res?.data.message);
        }
      )
      .catch((err) => {});
    } else if (owned) {
      fetchData(`/shop/paddle/enable`, "POST", {
        user_id: user?.id,
        color: infos.color
      }).then(
        (res:any) => {
          if (!res) return;
          if (res?.data?.status === "success")
          {
            setEquipped(true);
            refreshUser();
            toast.success(res?.data?.message);
          }
          else if (res?.data.status === "error")
            toast.error(res?.data.message);
        }
      )
      .catch((err) => {});
    } else {
      fetchData(`/shop/paddle`, "POST", {
        image: infos?.image,
        color: infos?.color,
        user_id: user?.id,
        price : infos?.price
      }).then(
        (res:any) => {
          if (!res) return;
          if (res?.data?.status === "success")
          {
            setOwned(true);
            refreshUser();
            toast.success(res?.data?.message);
          }
          else if (res?.data.status === "error")
            toast.error(res?.data.message);
        }
      )
      .catch((err) => {});
    }
  }

    useEffect(() => {
      if (user?.paddles) {
        user.paddles.forEach((item: any) => {
          if (item.color === infos.color + user?.id) {
            setOwned(true);
            if (item.enabled)
              setEquipped(true);
            else
              setEquipped(false);
          }
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [user]);

  return (
    <motion.div
      className={cn(
        "rounded-md bg-shopButton relative cursor-pointer",
        inter.className,
        size === "small" && !owned ? "w-[88px] h-[40px]" : "w-[120px] h-[50px]"
      )}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={handleClick}
    >
      <AnimatePresence>
        <motion.span
          className={cn(
            "text-[20px] absolute",
            size === "big" || owned ? "left-8 top-[9px]" : "left-5 top-[5px]"
          )}
          key={owned ? "owned" : "not-owned"}
          initial={{ opacity: 1, x: 0 }}
          animate={{
            opacity: hover ? 0 : 1,
            x: hover ? 2 : owned && !equipped ? -12 : equipped ? -20 : 0,
          }}
          exit={{ opacity: 0 }}
        >
          {owned ? (equipped ? "EQUIPPED" : "OWNED") : (infos && infos?.price)}
        </motion.span>
        <motion.span
          className={cn(
            "text-[20px] absolute",
            size === "big" || owned ? "left-8 top-[9px]" : "left-5 top-[5px]"
          )}
          key={equipped ? "equipped" : "not-equipped"}
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: hover ? 1 : 0,
            x: hover ? (owned && !equipped ? 0 : equipped ? -14 : 5) : 0,
          }}
          exit={{ opacity: 0 }}
        >
          {owned ? (equipped ? "UNEQUIP" : "EQUIP") : "BUY"}
        </motion.span>
        <motion.div
          className={cn(
            "absolute",
            size === "big" ? "right-8 top-[14px]" : "right-3 top-[10px]"
          )}
          animate={{
            opacity: hover || owned ? 0 : 1,
          }}
        >
          <Image
            src={"/ShopVec.svg"}
            width={16}
            height={16}
            alt="coin image"
            className="h-auto w-auto"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default PaddleCoin;
