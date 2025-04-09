import React from "react";

export default function BannerBlue() {
  return (
    <div className="bannerblue h-[340px] relative">
      <div className="flex flex-col p-16 gap-9">
        <span className="text-[#FFFFFF] text-[42px] ">iPhone 8</span>
        <span className="text-[#FFFFFF] text-base opacity-50">Performance and design. Taken right <br /> to the edge.</span>
        <span className="text-[#FFFFFF] text-sm ">SHOP NOW <div className="h-[2px] bg-white w-[75px] mt-1"></div></span>
        </div>
      <div>
        <img className="absolute right-1 bottom-0 w-[365px]" src="2phone.png" alt="" />
      </div>
    </div>
  );
}
