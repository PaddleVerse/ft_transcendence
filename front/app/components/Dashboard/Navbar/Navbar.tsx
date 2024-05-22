"use client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { useGlobalState } from "../../Sign/GlobalState";
import NotificationCard from "./NotificationCard";
import { fetchData, ipAdress } from "@/app/utils";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifed, setNotifed] = useState(false);
  const { state, dispatch } = useGlobalState();
  const { user, socket } = state;

  const handleClick = () => {
    if (socket) {
      socket.emit("!notified", { userId: user?.id });
    }
    setOpen(!open);
    setNotifed(false);
  };

  const cleanCookie = () => {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  };

  useEffect(() => {
    if (!user || !socket) return;
    if (user?.notified === true) setNotifed(true);
    socket?.on("notification", () => {
      setNotifed(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user]);

  useEffect(() => {
    if (!socket || !user) return;
    socket?.on("notification", (data: any) => {
      if (data?.ok === 0) return;

      fetchData(`/user/${user?.id}`, "GET", null)
        .then((res:any) => {
          if (!res) return;
          dispatch && dispatch({ type: "UPDATE_USER", payload: res?.data });
        })
        .catch((err) => {
        });
    });
    socket?.on("okk", (data:any) => {
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleLogout = async () => {
    fetchData(`/auth/logout`, "GET", null)
      .then(() => {
        cleanCookie();
        router.push("/");
      })
      .catch((err) => {
      });
  };

  return (
    <div className="w-full flex justify-center z-50">
      <div className="w-[95%] h-14 bg-primaryColor rounded-b-sm md:flex hidden justify-between items-center">
        <span className="text-gray-400 ml-10 text-[14px]">{pathname}</span>
        <div className="flex justify-center items-center relative">
          <div className="mr-8 flex justify-center items-center gap-2">
            <h1 className="text-white  text-xl"> {user && user?.coins} </h1>
            <svg
              height="20px"
              width="20px"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 291.764 291.764"
              xmlSpace="preserve"
            >
              <g>
                <path
                  style={{ fill: "#EFC75E" }}
                  d="M145.882,0c80.573,0,145.882,65.319,145.882,145.882s-65.31,145.882-145.882,145.882S0,226.446,0,145.882S65.31,0,145.882,0z"
                />
                <path
                  style={{ fill: "#CC9933" }}
                  d="M145.882,27.353c-65.465,0-118.529,53.065-118.529,118.529s53.065,118.529,118.529,118.529s118.529-53.065,118.529-118.529S211.347,27.353,145.882,27.353z M145.882,246.176c-55.39,0-100.294-44.904-100.294-100.294S90.493,45.588,145.882,45.588s100.294,44.904,100.294,100.294S201.281,246.176,145.882,246.176z M158.009,138.269c-5.452-2.289-25.493-5.452-25.493-14.214c0-6.464,7.495-8.334,11.99-8.334c4.094,0,8.999,1.295,11.589,3.875c1.641,1.577,2.316,2.726,2.854,4.313c0.684,1.869,1.094,3.875,3.684,3.875h13.357c3.136,0,3.957-0.574,3.957-4.021c0-14.789-11.589-23.122-24.809-25.994V86.28c0-2.58-0.821-4.167-3.957-4.167h-10.64c-3.136,0-3.957,1.577-3.957,4.167v11.051c-14.178,2.726-26.031,11.634-26.031,27.718c0,18.235,12.683,23.979,26.441,28.566c11.589,3.884,23.724,4.021,23.724,12.063s-5.99,9.765-13.357,9.765c-5.051,0-10.631-1.304-13.366-4.741c-1.769-2.152-2.453-4.021-2.58-5.89c-0.274-3.592-1.769-4.021-4.914-4.021H113.28c-3.136,0-3.957,0.729-3.957,4.021c0,16.366,13.093,26.286,27.262,29.441v11.206c0,2.58,0.821,4.167,3.957,4.167h10.64c3.136,0,3.957-1.586,3.957-4.167v-10.905c16.084-2.453,27.125-12.209,27.125-29.441C182.28,145.591,167.829,141.424,158.009,138.269z"
                />
              </g>
            </svg>
          </div>
          <div>
            <button
              onClick={handleClick}
              className=" relative h-8 w-8 flex justify-center items-center text-gray-300 select-none rounded-2xl text-center align-middle font-sans text-xs font-medium uppercase transition-all hover:bg-gray-100/10 active:bg-gray-100/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              <IoNotifications className="h-6 w-6" />
              {notifed && (
                <div className="absolute bg-gray-900 p-1 rounded-full top-0 right-0">
                  <div className="bg-red-500 rounded-full w-[6px] h-[6px]"></div>
                </div>
              )}
            </button>
            {open && (
              <ul
                className="absolute w-[150%] #9c9c9c66 bg-gray-200 left-[-60%] rounded-xl mt-2"
                onBlur={() => setOpen(false)}
              >
                {user && user?.notifications.length !== 0 ? (
                  user?.notifications.map((not: any, index: any) => (
                    <li key={index}>
                      <NotificationCard not={not} setOpen={setOpen} />
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-center text-gray-500">
                    {" "}There are no notifications{" "}
                  </li>
                )}
              </ul>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 ml-10 text-[14px] flex gap-1 justify-center items-center mr-10"
          >
            <span>Logout</span>
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 18.5C1.45 18.5 0.979333 18.3043 0.588 17.913C0.196667 17.5217 0.000666667 17.0507 0 16.5V2.5C0 1.95 0.196 1.47933 0.588 1.088C0.98 0.696667 1.45067 0.500667 2 0.5H9V2.5H2V16.5H9V18.5H2ZM13 14.5L11.625 13.05L14.175 10.5H6V8.5H14.175L11.625 5.95L13 4.5L18 9.5L13 14.5Z"
                fill="white"
                fillOpacity="0.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
