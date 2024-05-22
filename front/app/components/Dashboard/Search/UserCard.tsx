"use cient";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "../../../../components/ui/3d-card";
import Image from "next/image";
import { useGlobalState } from "../../Sign/GlobalState";

interface Props {
  user: any;
}

const UserCard = ({ user }: Props) => {
  const {state} = useGlobalState(); 
  const [LoadingImg, setLoadingImg] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (user.id === state?.user?.id) {
      router.push(`/Dashboard`);
      return;
    }
    router.push(`/Dashboard/Profile?id=${user.id}`);
  };
  return (
    <div onClick={handleClick} className="cursor-pointer">
      <CardContainer className="inter-var">
        <CardBody className="relative group/card  hover:shadow-2xl hover:shadow-sidebarRedColor/[0.1] bg-black border-[#FF4656]/[0.8] w-auto h-auto rounded-xl p-6 border">
          <CardItem translateZ="100" className="w-full mt-4">
            <div className=" relative">
              <Image
                onLoad={() => setLoadingImg(true)}
                src={user.picture ? user.picture : "/friend.png"}
                height="1000"
                width="1000"
                className={`h-60 w-60 object-cover rounded-xl group-hover/card:shadow-xl ${LoadingImg ? 'block' : 'invisible'}`}
                alt="thumbnail"
              />
              <div className={`absolute top-0 flex items-center justify-center w-full h-full  bg-gray-400 rounded  animate-pulse ${LoadingImg ? 'hidden' : 'block'}`}>
                  <svg
                      className="w-10 h-10 text-gray-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                  >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
              </div>
            </div>
          </CardItem>
          <div className="flex flex-col justify-between items-center mt-10">
            <CardItem
              translateZ={20}
              as="div"
              className="px-4 py-2 rounded-xl text-xs font-normal text-white"
            >
              {user?.name || "loading..."}
            </CardItem>
            <CardItem
              translateZ={20}
              as="div"
              className="px-4 py-2 rounded-xl bg-[#34202A] text-sidebarRedColor text-xs font-bold"
            >
              @{user?.nickname || "loading..."}
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default UserCard;
