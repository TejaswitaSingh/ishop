import React from "react";
import { FaStar } from "react-icons/fa6";

export default function FeaturedPdts() {
  return (
    <div className="w-[319px] h-[212px] drop-shadow-[-4px_18px_30px_#0000001A] flex items-center hilit">
      <img
        className="border border-[#F6F7F8] border-width: 2px w-[150px] p-2"
        src="beats.png"
        alt=""
      />
      <div className="flex flex-col ps-5">
        <h1 className="text-sm font-semibold text-[#262626]">
          Beats Solo 2 On Ear Headphones - Black
        </h1>
        <div className="flex gap-1 mt-2 text-xs">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
        </div>
        <div className='text-base flex font-medium mt-2 gap-4'>
          <span className='text-[#FF4858]'>$499</span>
          <span className='line-through text-[#C1C8CE]'>$599</span>
        </div>
      </div>
    </div>
  );
}
