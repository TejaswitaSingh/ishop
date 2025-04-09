import React from "react";
import Banner from "../Components/Banner";
import { Link } from "react-router-dom";
import ProductCard from "../Components/ProductCard";
import BannerBlue from "../Components/BannerBlue";
import FeaturedPdts from "../Components/FeaturedPdts";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

export default function Home() {
  return (
    <div className="w-full h-auto">
      <Banner />
      <div className="flex justify-center text-center h-[34px] w-full mt-14 text-2xl font-semibold">
        BEST SELLER
      </div>
      <div className="flex gap-11 w-[464px] h-[16px] mx-auto text-[#262626] text-sm font-medium mt-4">
        <Link className="text-[#33A0FF] underline underline-offset-4 ">All</Link>
        <Link>Mac</Link>
        <Link>iPhone</Link>
        <Link>iPad</Link>
        <Link>iPod</Link>
        <Link>Accessories</Link>
      </div>
      <div className="mt-11 flex gap-11 w-[1163px] justify-center flex-wrap mx-auto">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
      <div className="text-[#33A0FF] underline underline-offset-4 text-sm font-semibold text-center mt-20">
        LOAD MORE
      </div>
      <div className="w-full bg-[#2E90E5]">
        <div className="mx-auto w-[1163px] mt-24 ">
          <BannerBlue />
        </div>
      </div>
      <div className="w-[1163px] mx-auto h-[250px] mt-24 flex gap-24">
        <div className="flex flex-col justify-around items-center w-[330px] h-full">
          <img className="w-[70px] h-[46px]" src="truck.png" alt="" />
          <h1 className="text-[#22262A] text-2xl font-semibold">
            FREE SHIPPING
          </h1>
          <p className="text-[#22262A] text-sm text-center opacity-50 font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor minim veniam, quis nostrud reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur
          </p>
        </div>
        <div className="flex flex-col justify-around items-center w-[330px] h-full">
          <img className="w-[48px] h-[54px]" src="refund.png" alt="" />
          <h1 className="text-[#22262A] text-2xl font-semibold">100% REFUND</h1>
          <p className="text-[#22262A] text-sm text-center opacity-50 font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor minim veniam, quis nostrud reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur
          </p>
        </div>
        <div className="flex flex-col justify-around items-center w-[330px] h-full">
          <img className="w-[47px] h-[62px]" src="support.png" alt="" />
          <h1 className="text-[#22262A] text-2xl font-semibold">
            SUPPORT 24/7
          </h1>
          <p className="text-[#22262A] text-sm text-center opacity-50 font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor minim veniam, quis nostrud reprehenderit in voluptate
            velit esse cillum dolore eu fugiat nulla pariatur
          </p>
        </div>
      </div>
      <div className="flex justify-center text-center h-[34px] w-full mt-14 text-2xl font-semibold">
        FEATURED PRODUCTS
      </div>
      <div className="w-[1300px] h-[212px] mx-auto flex items-center gap-2 mb-48 mt-11">
        <IoIosArrowBack className="w-[45px] h-[83px] text-[#000000] ms-2" />
        <div className="flex justify-between w-[1200px]">
          <FeaturedPdts />
          <FeaturedPdts />
          <FeaturedPdts />
        </div>
        <IoIosArrowForward className="w-[45px] h-[83px] text-[#000000] me-2" />
      </div>
    </div>
  );
}
