import React, { useRef, useState } from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/newinput";
import toast from "react-hot-toast";
import { useGlobalState } from "../../Sign/GlobalState";
import BottomGradient from "@/components/ui/bottomGradiant";
import { fetchData } from "@/app/utils";

const inter = Inter({ subsets: ["latin"] });
const modalVariants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "easeOut",
      duration: 0.15,
    },
  },
  closed: {
    opacity: 0,
    scale: 0.75,
    transition: {
      ease: "easeIn",
      duration: 0.15,
    },
  },
};

const CreateChannel = ({ handleClick }: { handleClick: () => void }) => {
  const { state } = useGlobalState();
  const password = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const topic = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const [channelAppearence, setChannelAppearence] = useState(false);
  const { register } = useForm();
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

  const updateIs = (key:string, value:boolean) => {
    setIs(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updateError = (key:string, value:string) => {
    setError(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  const serverError = (err: any) => {
    try {
      err?.map((e: any) => {
        if (e.startsWith('Name')) {
          updateIs('name', true);
          updateError('name', e);
        } 
        if (e.startsWith('Topic')) {
          updateIs('topic', true);
          updateError('topic', e);
        }
        if (e.startsWith('Key')) {
          updateIs('key', true);
          updateError('key', e);
        }
        if (e.startsWith('State')) {
          updateIs('state', true);
          updateError('state', e);
        }
        if (e.startsWith('Picture')) {
          updateIs('picture', true);
          updateError('picture', e);
        }
      });
    } catch (error) {}
  }

  const handleCreateChannel = async () => {

    const channelObject = {
      channel: {
        name: name.current!.value,
        key: password.current!.value ? password.current!.value : null,
        topic: topic.current!.value ? topic.current!.value : null,
        state: channelAppearence
          ? "private"
          : password.current!.value
          ? "protected"
          : "public",
      },
      user: state?.user!,
    };
    try {
      if (file) {
        if (!file.type.startsWith("image/")) {
          toast.error("Please select an image file.");
          return;
        }
      }
      const ret = await fetchData(
        `/channels`,
        "POST",
        channelObject
      );
      if (!ret) return;
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        try {
          await fetchData(
            `/channels/image?channel=${ret.data.id}&user=${state?.user?.id}`,
            "POST",
            formData
          );
        } catch (error) {
          toast.error("error in uploading image, using the default image");
        }
      }
      state?.socket.emit("joinRoom", {
        roomName: ret?.data?.name,
        user: state?.user!,
        type: "self",
      });

    } catch (err:any) {
      if (err && err?.response){
        setIs({key: false, state: false, picture: false, name: false, topic: false});
        setError({key: "", state: "", picture: "", name: "", topic: ""});
        serverError(err.response.data?.message);
      }
      return;
    }
    handleClick();
  };
  return (
    <div
      className={`fixed inset-0 sm:flex hidden ${inter.className} items-center justify-center bg-black bg-opacity-50 z-50 text-white`}
    >
      <motion.div
        className="overflow-y-auto scroll border border-red-500/[0.3] h-[60%] 2xl:w-[35%] xl:w-[55%] sm:w-[70%] flex flex-col bg-transparent rounded-xl px-[150px] py-[60px] gap-5"
        initial="closed"
        animate="open"
        exit="closed"
        variants={modalVariants}
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(13, 9, 10, 0.4)",
        }}
      >
        <p className="text-3xl font-normal">Create a channel</p>
        <p className="text-">
          channels is where you and your friends can communicate as a group and
          you can have three types of channels, Public, private, and Protected.
        </p>
        <div>
        <label htmlFor="uploadFile1"
            className="bg-white hover:bg-gray-200 text-[#000000] text-sm px-4 py-2.5 outline-none rounded w-full cursor-pointer mx-auto flex justify-center items-center font-[sans-serif]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 mr-2 fill-[#000000] inline" viewBox="0 0 32 32">
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000" />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000" />
            </svg>
              Upload an image
            <input type="file" accept="image/*" id='uploadFile1' className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                if (!e.target.files[0].type.startsWith("image/")) {
                  toast.error("Please select an image file.");
                  return;
                }
                setFile(e.target.files[0]);
              }
            }}/>
          </label>
          {is?.picture && <p className="text-red-500 text-sm my-4">{error?.picture}</p>}
        </div>
        <div className="inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only" />
          <div
            className={`flex h-6 w-12 cursor-pointer ${
              !channelAppearence
                ? "bg-white justify-start"
                : "bg-green-500 justify-end"
            }  rounded-full  items-center border-2`}
            onClick={(e) => {
              e.preventDefault();
              setChannelAppearence(!channelAppearence);
            }}
          >
            <motion.div
              className={`w-5 h-5 rounded-full ${
                !channelAppearence ? "bg-green-500" : "bg-white"
              }`}
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
            ></motion.div>
          </div>
          <motion.span
            className="ms-3 text-sm font-medium dark:text-gray-300"
            animate={{
              opacity: channelAppearence ? 1 : 1,
              x: channelAppearence ? 4 : 0,
            }}
            exit={{ opacity: 0, x: -10 }}
          >
            {!channelAppearence ? "Public" : "Private"}
          </motion.span>
          {is?.state && <p className="text-red-500 text-sm my-4">{error?.state}</p>}
        </div>

        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateChannel();
          }}
        >
          <label htmlFor="Name">Name</label>
          <Input
            placeholder="channel name"
            {...register("name", { required: true })}
            ref={name}
            className="rounded-lg"
          />
          {(is?.name) && <p className="text-red-500 text-sm my-4">{error?.name}</p>}
          <label htmlFor="Password" className="mt-5">
            Password (optional)
          </label>
          <Input
            type="text"
            placeholder="password"
            {...register("password", { required: false })}
            ref={password}
            className="rounded-lg"
          />
          {(is?.key) && <p className="text-red-500 text-sm my-4">{error?.key}</p>}
          <label htmlFor="Password" className="mt-5">
            topic (optional)
          </label>
          <Input
            type="text"
            placeholder="topic"
            {...register("topic", { required: false })}
            ref={topic}
            className="rounded-lg"
          />
          {(is?.topic) && <p className="text-red-500 text-sm my-4">{error?.topic}</p>}
          <div className="flex flex-row justify-around mt-5">
            <button
              className="w-[45%] bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800  text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="button"
              onClick={handleClick}
            >
              Cancel
              <BottomGradient />
            </button>
            <button
              className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-[45%] text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Submit
              <BottomGradient />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateChannel;
