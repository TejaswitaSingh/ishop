import React, { useContext, useEffect, useState } from "react";
import BannerBlue from "../Components/BannerBlue";
import { MainContext } from "../../Context";
import { IoMdArrowDropdown } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { FcMenu } from "react-icons/fc";
import ProductCard from "../Components/ProductCard";
import Pagination from "../Components/Pagination";
import { Link, useParams, useSearchParams } from "react-router-dom";

export default function Store() {
  const {
    category,
    categoryHandler,
    colorHandler,
    color,
    productHandler,
    product,
  } = useContext(MainContext);

  const [limit, setLimit] = useState(10);
  const [productColor, setProductColor] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams();

  useEffect(() => {
    categoryHandler();
    colorHandler();

    const initialLimit = Number(searchParams.get("limit")) || 10;
    const initialColor = searchParams.get("productColor");

    setLimit(initialLimit);
    if (initialColor) {
      setProductColor(initialColor);
    }
  }, []);

  useEffect(() => {
    const query = { limit };
    if (productColor) query.productColor = productColor;

    setSearchParams(query);
    productHandler(productColor, limit, categorySlug); // ✅ FIXED LINE
  }, [limit, productColor, categorySlug]);

  return (
    <>
      <div className="h-[50px] bg-[#F6F7F8] w-full flex items-center justify-center text-[#33A0FF] text-sm gap-5 font-medium">
        <span>Store</span>/ <span>Store</span>
      </div>

      <div className="grid grid-cols-5 h-auto pt-16">
        {/* Sidebar */}
        <div>
          {/* Categories */}
          <div className="bg-[#F6F7F8] ms-11 w-[270px]">
            <div className="text-[#22262A] text-lg font-semibold p-4">CATEGORIES</div>
            <Link to={`/store`} className="cursor-pointer">
              <div className="flex justify-between">
                <div className="text-[#262626] text-sm font-semibold p-4">All</div>
              </div>
            </Link>

            {category.map((cat, i) => (
              <Link to={`/store/${cat.slug}`} key={i} className="cursor-pointer">
                <div className="flex justify-between">
                  <div className="text-[#262626] text-sm font-semibold p-4 h-[40px]">
                    {cat.name}
                  </div>
                  <div className="opacity-50 text-[#262626] text-sm font-semibold p-4 h-[40px]">
                    ({cat.productCount})
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Prices */}
          <div className="bg-[#F6F7F8] ms-11 w-[270px] mt-11 h-[144px]">
            <div className="text-[#22262A] text-lg font-semibold p-4">PRICES</div>
            <div className="flex justify-between">
              <div className="text-[#262626] text-sm font-semibold p-4">Range:</div>
              <div className="text-[#262626] text-sm font-semibold p-4">$13.99 - $25.99</div>
            </div>
            <div className="flex justify-between">
              <input type="range" className="w-[235px] mx-auto" />
            </div>
          </div>

          {/* Colors */}
          <div className="bg-[#F6F7F8] ms-11 w-[270px] mt-11">
            <div className="text-[#22262A] text-lg font-semibold p-4">COLOR</div>
            <div className="flex justify-between flex-wrap">
              {color.map((col, i) => (
                <div
                  key={i}
                  onClick={() => setProductColor(col._id)}
                  className="h-[20px] w-[20px] rounded-full m-3 cursor-pointer"
                  style={{ background: col.colorCode }}
                  title={col.name}
                ></div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="bg-[#F6F7F8] ms-11 w-[270px] mt-11">
            <div className="text-[#22262A] text-lg font-semibold p-4">BRAND</div>
            {["Apple", "LG", "Samsung", "Siemens"].map((brand, i) => (
              <div key={i} className="flex justify-between">
                <div className="text-[#262626] text-sm font-semibold p-4">{brand}</div>
                <div className="opacity-50 text-[#262626] text-sm font-semibold p-4">99</div>
              </div>
            ))}
          </div>

          {/* More */}
          <div className="bg-[#F6F7F8] ms-11 w-[270px] mt-11">
            <div className="text-[#22262A] text-sm font-semibold p-4 text-center">MORE</div>
          </div>
        </div>

        {/* Main Products Area */}
        <div className="col-span-4 mx-14 overflow-hidden">
          <BannerBlue />

          {/* Filters Bar */}
          <div className="h-[58px] bg-[#F6F7F8] mt-6 flex justify-between p-5">
            <div className="flex items-center gap-5 text-[17px]">
              <div>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="bg-transparent border border-[#ffffff] p-2 rounded-lg"
                >
                  {[2, 4, 5, 10].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                Sort by Name <IoMdArrowDropdown />
              </div>
              <div className="flex items-center gap-3">
                Show 12 <IoMdArrowDropdown />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CgMenuGridR className="h-[35px] w-[35px] text-[#2678BF]" />
              <FcMenu className="h-[35px] w-[35px] text-[#C1C8CE] opacity-50" />
            </div>
          </div>

          {/* Products Grid */}
          <div className="mt-6 flex gap-8 flex-wrap">
            {product?.length > 0 ? (
              product.map((prod, i) =>
                prod ? (
                  <ProductCard key={prod._id || i} product={prod} />
                ) : null
              )
            ) : (
              <p>No products available</p>
            )}
          </div>

          {/* Pagination */}
          <div className="w-full mt-11 h-[56px] bg-[#F6F7F8] flex justify-center items-center mb-[500px]">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <Pagination totalPages={5} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
