import React from "react";
import { Rajdhani } from "next/font/google";
import { Inter } from "next/font/google";
import { Rubik } from "next/font/google";
import Image from "next/image";
import { Button } from "@/components/ui/button";
const image =
  "https://preview.redd.it/dwhdw8qeoyn91.png?width=640&crop=smart&auto=webp&s=65176fb065cf249155e065b4ab7041f708af29e4";

const rubik = Rubik({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500"], preload:false });
const UserProfile = () => {
  return (
    <div
      className={`${rubik.className} w-full bg-trasparent  rounded-md xl:h-[550px] sm:h-[1070px]`}
      style={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(13, 9, 10, 0.3)",
      }}
    >
      <div className="flex flex-col w-full h-full items-center sm:justify-center gap-5  rounded-md sm:py-7 py-5 ">
        <div className="2xl:w-[98%] sm:w-[94%] w-[91%] sm:h-[50%] h-[20%]   relative flex items-center justify-center ">
          <Image
            src={"/car1.jpg"}
            alt="car"
            fill
            style={{objectFit:"cover"}}
            objectPosition="center"
            className="rounded-md"
          />

          <div className="absolute sm:w-[180px] sm:h-[240px] w-[100px] h-[160px]  rounded-[7px] xl:left-[100px] xl:top-[100px] md:left-[50px] md:top-[310px] flex items-center justify-center bg-dashBack z-20 left-[35px] -bottom-[70px]">
            <div className="sm:w-[85%] w-[95%] sm:h-[95%] h-[97%] rounded-[7px]  flex flex-col items-center justify-center text-white">
              <div className="w-full h-[70%] relative rounded-md">
                <Image
                  src={"/b.png"}
                  alt="profile"
                  fill
                  style={{objectFit:"cover"}}
                  className="  rounded-md"
                />
              </div>
              <h2 className="mt-2 sm:text-[15px] text-[12px]">Abdelmottalib</h2>
              <span className="sm:text-[10px] text-[7px]">@konami</span>
              <span className="sm:text-[10px] text-[7px]">400,000</span>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col justify-between 2xl:w-[98%] sm:w-[94%] w-[91%] sm:h-[50%] h-[80%] sm:flex-wrap sm:gap-0 gap-4  ">
          <div className="2xl:w-[28%] xl:w-[30%] md:w-[49%]  rounded-md flex justify-center items-end xl:h-full md:h-[240px] sm:mt-0 mt-[70px] ">
            <div className=" w-full h-[120px] flex gap-4 items-center rounded-md bg-dashBack justify-center ">
              <Image
                src={"/badge1.png"}
                width={130}
                height={130}
                alt="badge"
                className="w-[100px]"
              ></Image>
              <div className="flex flex-col h-[60%] w-[350px]  justify-center">
                <div>
                  <div className="flex items-center justify-between text-white">
                    <h1 className="ml-1 2xl:text-[15px] xl:text-[12px] sm:text-[11px] text-[14px]">LVL 2</h1>
                    <span className="2xl:text-xs text-[8px] text-buttonGray sm:mr-3 mr-7">250/1000</span>
                  </div>
                  <div className="sm:w-[95%] w-[91%] 2xl:w-full bg-progressBg rounded-full p-[1px] dark:bg-gray-700">
                    <div
                      className="bg-progressColor sm:h-2.5 h-2 rounded-full relative"
                      style={{ width: "45%" }}
                    >
                      <div className="absolute bg-progressIndicator w-4 h-4 rounded-full -right-2 sm:-top-[3px] -top-[4px]"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="ml-1 2xl:text-xs  text-[10px]  text-progressIndicator">
                    level experience
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:w-[22%] md:w-[49%] bg-dashBack  rounded-md flex items-center justify-center px-5 xl:h-full ">
            {/* <div className=" sm:w-[91%] w-[97%] h-[80%] "> */}
              <div className="flex flex-col w-full h-full relative justify-center gap-2">
                <div className="flex  justify-between items-center">
                  <div className={` ${inter.className} flex flex-col text-white gap-1 relative`}>
                    <span className="text-buttonGray 2xl:text-xs xl:text-[12px] sm:text-[13px] ml-[8px] 2xl:ml-4 xl:ml-2 text-[13px]">online</span>
                    <div className="absolute 2xl:left-2 xl:top-[6px] top-[9px]  w-[5px] h-[5px] rounded-full bg-green-500"></div>
                    <h1 className="2xl:text-[17px] xl:text-[15px] text-[15px]">Andrew</h1>
                    <span className="text-buttonGray 2xl:text-[15px] xl:text-[8px] text-[13px]">02-01-2024</span>
                    <span className="text-buttonGray 2xl:text-[13px] xl:text-[12px] text-[13px]">public channels</span>
                    <div className="flex gap-2">
                      <Image src={'/group.svg'} width={25} height={25} alt="group" />
                      <Image src={'/group.svg'} width={25} height={25} alt="group" />
                    </div>
                  </div>
                  <Image
                    src={"/badge2.png"}
                    width={170}
                    priority
                    height={170}
                    alt="badge"
                    className="2xl:w-[180px] sm:-right-[20px] right-[0px] bottom-[25px] sm:bottom-[45px] xl:w-[120px]  2xl:right-[10px] 2xl:bottom-[100px] xl:-right-[15px] xl:bottom-[95px]"
                  />
                </div>
                  <button className={`w-full h-10 sm:mt-0 mt-4 rounded-md bg-greenButton flex items-center justify-center 2xl:text-[24px] xl:text[22px] text-white font-[500] ${rajdhani.className} `}> ADD FRIEND</button>
              {/* </div> */}
            </div>
          </div>
          <div className="xl:w-[40%] h-[250px] md:w-[100%]   rounded-[7px] xl:mt-0 md:mt-[10px] xl:h-full border"></div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
