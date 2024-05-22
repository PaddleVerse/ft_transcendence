"use client";
import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BigCard from "./BigCard";

import MatchMakingCard from "./MatchMakingCard";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1,
  },
  laptop: {
    breakpoint: { max: 1500, min: 1025 },
    items: 2,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 1,
    slidesToSlide: 1,
  },
};

const Caroussel = ({ setSelected, canPlay, setCanPlay }: any) => {
  // const [matchMaking, setMatchMaking] = useState(false);

  return (
    <>
      <div
        className="mt-[75px] 2xl:mb-4 xl:mb-[175px] mb-[50px]  2xl:max-w-[1800px] xl:max-w-[950px] mx-auto 2xl:pl-4"
        style={{ zIndex: 0 }}
      >
        <Carousel
          responsive={responsive}
          autoPlay={false}
          arrows={false}
          swipeable={false}
          draggable={false}
          centerMode={false}
          // showDots={true}
          infinite={true}
        >
          <div onClick={() => setSelected("1")}>
            <BigCard gameMode={"1"} />
          </div>
          <div onClick={() => setSelected("3")}>
            <BigCard gameMode={"3"} />
          </div>
          {/* <BigCard gameMode={'3'}/>
          <BigCard gameMode={'2'}/> */}
        </Carousel>
      </div>
      {
        canPlay && <MatchMakingCard gameMode={'2'} setCanPlay={setCanPlay} setSelected={setSelected}/>
      }
    </>
  );
};
export default Caroussel;
