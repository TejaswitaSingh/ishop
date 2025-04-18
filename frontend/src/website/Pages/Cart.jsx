import React, { useContext, useEffect } from "react";
import { MainContext } from "../../Context";
import { useSelector, useDispatch } from "react-redux";
import { changeQty, removeFromCart } from "../../redux/reducers/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { formatPriceINR } from "../../helper";

export default function Cart() {
  const { product, productHandler } = useContext(MainContext);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  function isLogin() {
    if (user) {
      navigator("/checkout");
    } else {
      navigator("/login?ref=checkout");
    }
  }

  useEffect(() => {
    productHandler();
  }, []);

  const handleQtyChange = ({ productId, qty, finalPrice, originalPrice }) => {
    if (qty < 1) return;
    dispatch(changeQty({ productId, qty, finalPrice, originalPrice }));
  };

  const handleRemove = ({ productId, finalPrice, originalPrice }) => {
    dispatch(removeFromCart({ productId, finalPrice, originalPrice }));
  };

  return (
    <div className="w-full mb-11 flex flex-col items-center">
      <div className="h-[50px] bg-[#F6F7F8] w-full flex items-center justify-center text-sm font-medium">
        <span>Cart</span>
      </div>

      <div className="flex mt-5 justify-between w-[1200px] px-5">
        <div className="text-lg text-[#22262A] font-semibold w-[400px]">PRODUCT</div>
        <div className="text-lg text-[#22262A] font-semibold flex justify-between w-[750px] px-11">
          <h1>UNIT PRICE</h1>
          <h1>QTY</h1>
          <h1>TOTAL PRICE</h1>
        </div>
      </div>

      <div className="h-[1px] bg-slate-300 w-[1200px] my-4"></div>

      <div className="w-[1200px] px-5">
        {cart?.data?.map((d, i) => {
          const ProductCart = product.find((p) => p._id === d.productId);
          if (!ProductCart) return null;

          return (
            <div key={i} className="flex items-center justify-between mb-5">
              <div className="flex items-center w-[400px] gap-3">
                <button
                  className="text-red-500 text-lg"
                  onClick={() =>
                    handleRemove({
                      productId: ProductCart._id,
                      finalPrice: ProductCart.finalPrice,
                      originalPrice: ProductCart.originalPrice,
                    })
                  }
                >
                  ×
                </button>
                <img
                  src={`http://localhost:5000/product/${ProductCart.thumbnail}`}
                  className="w-16 h-16 object-cover"
                  alt={ProductCart.name}
                />
                <span className="text-[#22262A]">{ProductCart.name}</span>
              </div>

              <div className="flex justify-between items-center w-[750px] px-11">
                <span>{formatPriceINR(ProductCart.originalPrice)}</span>
                <div className="flex items-center border border-gray-300 px-3 py-1 rounded-md">
                  <button
                    onClick={() =>
                      handleQtyChange({
                        productId: ProductCart._id,
                        qty: d.qty - 1,
                        finalPrice: ProductCart.finalPrice,
                        originalPrice: ProductCart.originalPrice,
                      })
                    }
                    className="px-2"
                  >
                    -
                  </button>
                  <span className="px-3">{d.qty}</span>
                  <button
                    onClick={() =>
                      handleQtyChange({
                        productId: ProductCart._id,
                        qty: d.qty + 1,
                        finalPrice: ProductCart.finalPrice,
                        originalPrice: ProductCart.originalPrice,
                      })
                    }
                    className="px-2"
                  >
                    +
                  </button>
                </div>
                <span>
                  {formatPriceINR(ProductCart.originalPrice * d.qty)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-[1px] bg-slate-300 w-[1200px] my-4"></div>

      <div className="w-[1200px] px-5 flex justify-between items-center my-5">
        <div className="flex w-[500px]">
          <input
            type="text"
            placeholder="Voucher code"
            className="border border-gray-300 px-4 py-2 flex-1"
          />
          <button className="bg-blue-500 text-white px-6 py-2">Redeem</button>
        </div>

        <div className="w-[300px] text-right">
          <div className="flex justify-between py-1">
            <span>Original Price</span>
            <span>{formatPriceINR(cart.original_total)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Savings</span>
            <span className="text-green-600">
              -{formatPriceINR(cart.original_total - cart.total)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span>Coupon</span>
            <span>No</span>
          </div>
          <div className="flex justify-between text-xl font-bold py-2">
            <span>TOTAL</span>
            <span>{formatPriceINR(cart.total)}</span>
          </div>
          <button onClick={isLogin} className="bg-blue-500 text-white w-full py-3 mt-3">
            Check out
          </button>
        </div>
      </div>
    </div>
  );
}
