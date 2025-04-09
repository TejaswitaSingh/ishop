import React from "react";
import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white shadow-md border-t container">
      <div className="h-[0.5px] bg-slate-300 w-full"></div>
      <div className="pt-10 mx-20 gap-40 grid grid-cols-3">
        <div>
          <div className="text-[#C1C8CE] text-[32px] font-bold">iSHOP</div>
          <p className="text-[#22262A] pt-5 text-xs">
            iSHOP is your one-stop destination for fashion, gadgets, and
            essentials, offering top-quality products at unbeatable prices.
            Enjoy a seamless shopping experience with exciting deals and the
            latest trends. Shop now and discover something amazing!
          </p>
        </div>
        <div>
          <div className="text-[#22262A] text-lg font-bold pt-3">Follow Us</div>
          <p className="text-[#22262A] pt-5 text-xs">
            Stay updated with our latest collections, exclusive deals, and
            special offers! Follow us on social media for updates and exciting
            content.
          </p>
          <div className="flex gap-8 mt-3">
            <FaFacebookF color="#385C8E" /> <FaTwitter color="#03A9F4" />
          </div>
        </div>
        <div>
          <div className="text-[#22262A] text-lg font-bold pt-3">
            Contact Us
          </div>
          <div className="text-[#22262A] pt-5 text-xs">
  <p>Address: iShop, Building 124, Jaipur, India</p>
  <p>Call us: +91 9999999999</p>
  <p>Email: support@ishop.com</p>
</div>
        </div>
      </div>
      <div className="h-[0.5px] bg-slate-300 w-full mt-7"></div>
      <div className="pt-10 mx-20 gap-20 grid grid-cols-6">
        <div>
          <div className="text-[#22262A] text-lg font-bold pt-3">
            Infomation
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          About Us
          </div>
          <div className="text-[#22262A] text-sm pt-2 ">
            Infomation
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Privacy Policy
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Terms & Conditions
          </div>
        </div>
        <div>
          <div className="text-[#22262A] text-lg font-bold pt-3">
          Service
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          About Us
          </div>
          <div className="text-[#22262A] text-sm pt-2 ">
            Infomation
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Privacy Policy
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Terms & Conditions
          </div>
        </div>
        <div>
          <div className="text-[#22262A] text-lg font-bold pt-3">
          Extras
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          About Us
          </div>
          <div className="text-[#22262A] text-sm pt-2 ">
            Infomation
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Privacy Policy
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Terms & Conditions
          </div>
        </div>
        <div>
          <div className="text-[#22262A] text-lg font-bold pt-3">
          My Account
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          About Us
          </div>
          <div className="text-[#22262A] text-sm pt-2 ">
            Infomation
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Privacy Policy
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Terms & Conditions
          </div>
        </div>
        <div>
          <div className="text-[#22262A] text-lg font-bold pt-3">
          Userful Links
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          About Us
          </div>
          <div className="text-[#22262A] text-sm pt-2 ">
            Infomation
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Privacy Policy
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Terms & Conditions
          </div>
        </div>
        <div>
          <div className="text-[#22262A] text-lg font-bold pt-3">
          Our Offers
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          About Us
          </div>
          <div className="text-[#22262A] text-sm pt-2 ">
            Infomation
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Privacy Policy
          </div>
          <div className="text-[#22262A] text-sm pt-2">
          Terms & Conditions
          </div>
        </div>
      </div>
      <div className="h-[0.5px] bg-slate-300 w-full mt-7"></div>
      <div className="flex flex-row-reverse gap-4 me-11 mt-6">
        <img className="w-[38px] h-[25px]" src="avi.png" alt="" />
        <img className="w-[38px] h-[25px]" src="awu.jpg" alt="" />
        <img className="w-[38px] h-[25px]" src="amc.png" alt="" />
        <img className="w-[38px] h-[25px]" src="app.png" alt="" />
      </div>
      <div className="h-[0.5px] bg-slate-300 w-full mt-7"></div>
    </footer>
  );
};

export default Footer;
