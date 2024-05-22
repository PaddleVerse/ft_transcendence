"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/newinput";
import MemberList from "./MemberList";
import { useForm } from "react-hook-form";
import {
  channel,
  participants,
  participantWithUser,
  user,
} from "@/app/Dashboard/Chat/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useGlobalState } from "../../Sign/GlobalState";
import InviteCard from "./InviteCard";
import { FaPlus, FaTimes } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { fetchData } from "@/app/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchParticipants = async (channel: channel, user: user) => {
  const participants = await fetchData(
    `/channels/participants/${channel?.id}?uid=${user?.id}`,
    "GET",
    {}
  );
  const ret = await Promise.all(
    participants.data?.map(async (participant: participants) => {
      const user = await fetchData(`/user/${participant.user_id}`, "GET", {});
      return { ...participant, user: user?.data };
    })
  );
  if (!ret) return null;
  return ret;
};

const FetchPriviliged = async (channel: channel, user: user) => {
  const participants = await fetchData(
    `/channels/participants/${channel?.id}?uid=${user?.id}`,
    "GET",
    {}
  );
  return (
    participants.data?.filter(
      (participant: participants) =>
        (participant.role === "ADMIN" || participant.role === "MOD") &&
        participant.user_id === user?.id
    )[0] || null
  );
};

const ChannelManagement = ({
  channel,
  user,
  update,
}: {
  channel: channel;
  user: user;
  update: (arg0: boolean) => void;
}) => {
  const { state } = useGlobalState();
  const [modlar, setModlar] = useState(false);
  const { user: u, socket } = state;
  const router = useRouter();
  const [picture, setPicture] = useState<File>();
  const { register, reset } = useForm();
  const topicInput = useRef<HTMLInputElement | null>(null);
  const channelNameInput = useRef<HTMLInputElement | null>(null);
  const keyInput = useRef<HTMLInputElement | null>(null);
  const [selectedOption, setSelectedOption] = useState(channel?.state);
  const [fetchEnabled, setFetchEnabled] = useState(true);
  const clt = useQueryClient();
  const { data: participants } = useQuery<participantWithUser[] | null>({
    queryKey: ["participants"],
    queryFn: async () => fetchParticipants(channel, user),
    enabled: fetchEnabled,
  });

  const { data: priviliged } = useQuery<participants | null>({
    queryKey: ["priviliged"],
    queryFn: async () => FetchPriviliged(channel, user),
    enabled: fetchEnabled,
  });

  const rotateVariants = {
    initial: {
      rotate: 0,
    },
    rotated: {
      rotate: 90,
    },
  };
  //////////////////////////////
  const [is, setIs] = useState({
    key: false,
    state: false,
    picture: false,
    name: false,
    topic: false,
  });

  const [error, setError] = useState({
    key: "",
    state: "",
    picture: "",
    name: "",
    topic: "",
  });

  const updateIs = (key: string, value: boolean) => {
    setIs((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updateError = (key: string, value: string) => {
    setError((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const serverError = (err: any) => {
    try {
      err?.map((e: any) => {
        if (e.startsWith("Name")) {
          updateIs("name", true);
          updateError("name", e);
        }
        if (e.startsWith("Topic")) {
          updateIs("topic", true);
          updateError("topic", e);
        }
        if (e.startsWith("Key")) {
          updateIs("key", true);
          updateError("key", e);
        }
        if (e.startsWith("State")) {
          updateIs("state", true);
          updateError("state", e);
        }
        if (e.startsWith("Picture")) {
          updateIs("picture", true);
          updateError("picture", e);
        }
      });
    } catch (error) {}
  };
  //////////////////////////////

  const handleOptionChange = (event: any) => {
    setSelectedOption(event?.target?.value);
  };

  useEffect(() => {
    addEventListener("keydown", (e) => {
      if (e?.key === "Escape") {
        setModlar(false);
      }
    });
    return () => removeEventListener("keydown", () => {});
  }, []);

  const handleLeave = () => {
    fetchData(
      `/participants/leave?channel=${channel?.id}&user=${user?.id}`,
      "DELETE",
      null
    )
      .then(() => {
        setFetchEnabled(false);
        socket?.emit("leaveRoom", { user: user, roomName: channel.name });
        router.push("/Dashboard/Chat");
      })
      .catch((error) => {
      });
  };

  useEffect(() => {
    state?.socket?.on("update", (data: any) => {
      if (
        data &&
        data?.type &&
        (data?.type === "channelupdate" ||
          data?.type === "join" ||
          data?.type === "leave")
      ) {
        clt.invalidateQueries({ queryKey: ["participants"] });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.socket]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!priviliged || priviliged === undefined) {
      toast.error("you are not priviliged to change the channel info!!!");
      return;
    }
    if (selectedOption === "public" && keyInput?.current?.value) {
      toast.error("you need to select the protected option to set a password.");
      return;
    }
    const obj = {
      channel: {
        name: channelNameInput?.current?.value! || "",
        key: keyInput?.current?.value! || channel?.key,
        topic: topicInput?.current?.value! || channel?.topic,
        state: selectedOption === "" ? channel?.state : selectedOption,
      },
      user: { id: priviliged?.user_id! },
    };
    const updateChannel = async () => {
      try {
        if (picture) {
          if (!picture?.type?.startsWith("image/")) {
            toast.error("Please select an image picture.");
            return;
          }
        }
        await fetchData(`/channels/${channel?.id}`, "PUT", obj);
        setIs({
          key: false,
          state: false,
          picture: false,
          name: false,
          topic: false,
        });
        setError({ key: "", state: "", picture: "", name: "", topic: "" });
        toast.success("channel updated successfully.");
        reset();
        if (picture) {
          try {
            const formData = new FormData();
            formData?.append("image", picture);
            await fetchData(
              `/channels/image?channel=${channel?.id}&user=${priviliged?.user_id}`,
              "POST",
              formData
            );
          } catch (error) {
            toast.error("error in uploading image, using the default image.");
          }
        }
        state?.socket?.emit("channelUpdate", {
          roomName: obj?.channel?.name!,
          user: user,
        });
      } catch (err: any) {
        if (err && err?.response) {
          setIs({
            key: false,
            state: false,
            picture: false,
            name: false,
            topic: false,
          });
          setError({ key: "", state: "", picture: "", name: "", topic: "" });
          serverError(err.response.data?.message);
        }
      }
    };
    updateChannel();
  };
  return (
    <motion.div
      className="w-full flex sm:h-[80%] h-auto sm:flex-row flex-col jutify-center items-center  sm:overflow-y-scroll no-scrollbar"
      initial={{ opacity: 0, y: -120 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="sm:w-[45%] w-[100%] h-full bg-transparent flex flex-col items-center justify-start pt-[120px] gap-10 sm:border-r-2">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col w-[50%] items-center justify-center  gap-4"
        >
          <div className="rounded-full overflow-hidden relative w-[200px] h-[200px]">
            <input
              type="file"
              onChange={(e) => {
                if (e?.target?.files && e?.target?.files[0]) {
                  setPicture(e?.target?.files[0]);
                }
              }}
              className="absolute opacity-0 z-30 w-full h-full cursor-pointer"
              disabled={priviliged ? false : true}
            />
            <Image
              src={channel?.picture || "/a.png"}
              width={200}
              height={200}
              alt="channel picture"
              className="absolute z-10 blur-sm"
            />

            <Image
              src={"/Chat/plusOverPicture.svg"}
              width={75}
              height={75}
              alt="channel picture"
              className="absolute top-[35%] left-[30%] z-20"
            />
            {is?.picture && (
              <p className="text-red-500 text-sm my-4">{error?.picture}</p>
            )}
          </div>
          <Input
            type="text"
            placeholder="change name"
            {...register("channelNameInput", { required: false })}
            ref={channelNameInput}
            className="rounded-lg "
            disabled={priviliged ? false : true}
          />
          {is?.name && (
            <p className="text-red-500 text-sm my-4">{error?.name}</p>
          )}
          <Input
            type="text"
            placeholder="change password"
            {...register("keyInput", {
              required: selectedOption === "protected" ? true : false,
            })}
            ref={keyInput}
            className="rounded-lg "
            disabled={priviliged ? false : true}
          />
          {is?.key && <p className="text-red-500 text-sm my-4">{error?.key}</p>}
          <fieldset
            className="flex gap-2 items-center flex-wrap"
            disabled={priviliged ? false : true}
          >
            <label htmlFor="private" className="2xl:text-md text-sm">
              private
            </label>
            <input
              type="radio"
              name="access"
              id="private"
              value="private"
              onChange={handleOptionChange}
              checked={selectedOption === "private"}
            />
            <label htmlFor="public" className="2xl:text-md text-sm">
              public
            </label>
            <input
              type="radio"
              name="access"
              id="public"
              value="public"
              onChange={handleOptionChange}
              checked={selectedOption === "public"}
            />
            <label htmlFor="protected" className="2xl:text-md text-sm">
              protected
            </label>
            <input
              type="radio"
              name="access"
              id="protected"
              value="protected"
              onChange={handleOptionChange}
              checked={selectedOption === "protected"}
            />
          </fieldset>
          <Input
            type="text"
            placeholder="change topic"
            {...register("topicInput", { required: false })}
            ref={topicInput}
            className="rounded-lg "
            disabled={priviliged ? false : true}
          />
          {is?.topic && (
            <p className="text-red-500 text-sm my-4">{error?.topic}</p>
          )}
          <button
            type="submit"
            className="py-2 px-5 bg-red-500 rounded-md mt-4"
            disabled={priviliged ? false : true}
          >
            Submit
          </button>
        </form>
        <button
          onClick={() => handleLeave()}
          className="py-2 px-5 bg-red-500 rounded-md mt-4"
        >
          leave channel
        </button>
      </div>
      <div
        className={`"sm:w-[45%]" w-full h-full bg-transparent overflow-y-scroll no-scrollbar`}
      >
        <div className="flex flex-row mt-5 items-center justify-around">
          <div>
            <p className="text-2xl font-bold">
              {!modlar ? "Members" : "invite list"}
            </p>
          </div>
          <div
            onClick={() => setModlar(!modlar)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setModlar(false);
            }}
          >
            <motion.div
              animate={modlar ? "rotated" : "initial"}
              variants={rotateVariants}
            >
              {!modlar ? (
                <FaPlus className="text-2xl cursor-pointer" />
              ) : (
                <FaXmark className="text-3xl cursor-pointer" />
              )}
            </motion.div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 items-center">
          {!modlar ? (
            participants &&
            //@ts-ignore
            participants.map((participant: any, index: number) => {
              return (
                <MemberList
                  key={index}
                  participant={participant}
                  exec={priviliged!}
                  channel={channel}
                />
              );
            })
          ) : (
            <InviteCard channel={channel} user={user} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelManagement;
