import React, { useContext } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducers/cartSlice";
import { MainContext } from "../../Context";
import axios from "axios";

export default function ProductCard({ product }) {
  const { API_BASE_URL, USER_URL } = useContext(MainContext);
  const user = useSelector((state) => state.user);
  const dispatcher = useDispatch();
  if (!product) {
    return null;
  }

  async function addCardButton(productData) {
    if (user && user.data && user.data._id) {
      try {
        // Make API call to save cart to DB
        const res = await axios.post(API_BASE_URL + USER_URL + "/add-to-cart", {
          userId: user.data._id,
          productId: productData.productId,
        });
        console.log("✅ Cart saved to DB:", res.data);
        
        // After successful API call, update Redux state
        dispatcher(addToCart(productData));
      } catch (err) {
        console.log("❌ Failed to save cart:", err);
      }
    } else {
      // If user is not logged in, only update Redux state
      dispatcher(addToCart(productData));
    }
  }

  // Determine star ratings
  const isTopSelling = product.topSelling; // Assuming topSelling is a boolean
  const starCount = isTopSelling ? 5 : 3.5; // 5 for top selling, 3.5 otherwise

  return (
    <div className="w-[250px] h-[450px] border-[3px] border-[#F6F7F8] p-4 flex flex-col justify-between">
      <img
        className="w-full h-[153px] object-cover"
        src={`http://localhost:5000/product/${product.thumbnail}`}
        alt={product.name}
      />
      <div className="bg-[#F6F7F8] h-[1px] w-full mt-4"></div>
      <div className="text-sm text-center mt-3 text-[#262626] font-semibold">
        {product.name}
      </div>

      {/* ⭐️ Star Rating */}
      <div className="flex text-[#FFC600] justify-center mt-3 gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          if (index < Math.floor(starCount)) {
            return <FaStar key={index} className="text-[#FFC600]" />;
          } else if (index === Math.floor(starCount) && starCount % 1 !== 0) {
            return <FaStarHalfAlt key={index} className="text-[#FFC600]" />;
          } else {
            return <FaStar key={index} className="text-gray-300" />;
          }
        })}
      </div>

      {/* Price */}
      <div className="text-base flex font-medium justify-center mt-2 gap-2">
        <span className="text-[#FF4858]">₹{product.finalPrice}</span>
        <span className="line-through text-[#C1C8CE]">
          ₹{product.originalPrice}
        </span>
      </div>

      {/* Colors Available */}
      <div className="flex flex-wrap">
        {product.colors.map((col, i) => (
          <div
            key={col._id || col.colorCode || i}
            className="h-[20px] w-[20px] rounded-full m-3"
            style={{ background: col.colorCode }}
          ></div>
        ))}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() =>
          addCardButton({
            productId: product._id,
            finalPrice: product.finalPrice,
            originalPrice: product.originalPrice,
          })
        }
        className="mt-4 bg-[#33A0FF] text-white py-2 rounded-lg w-full hover:bg-[#2678BF] transition duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
}
