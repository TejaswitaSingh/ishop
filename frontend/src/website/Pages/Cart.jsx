import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../Context";
import { useSelector, useDispatch } from "react-redux";
import { changeQty, removeFromCart } from "../../redux/reducers/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { formatPriceINR } from "../../helper";
import ApiService from "../../services/apiService";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Cart() {
  const { product, productHandler, notify } = useContext(MainContext);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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

  const handleQtyChange = async ({ productId, qty, finalPrice, originalPrice }) => {
    if (qty < 1) return;
  
    try {
      if (user) {
        // Update quantity in database
        const response = await ApiService.updateCartQty({
          userId: user._id,
          productId,
          qty
        });

        if (response.data.status === 1) {
          // Update Redux state only after successful DB update
          dispatch(changeQty({ productId, qty, finalPrice, originalPrice }));
          
        } else {
          console.error(response.data.msg || "Failed to update quantity");
        }
      } else {
        // For guest users, just update Redux state
        dispatch(changeQty({ productId, qty, finalPrice, originalPrice }));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      notify("Failed to update quantity. Please try again.", 0);
    }
  };

  const handleRemove = async ({ productId, finalPrice, originalPrice }) => {
    try {
      if (user) {
        // Remove from database first
        const response = await ApiService.removeFromCart(user._id, productId);

        if (response.data.status === 1) {
          // Update Redux state only after successful DB removal
          dispatch(removeFromCart({ productId, finalPrice, originalPrice }));
          
        } else {
          console.log(response.data.msg || "Failed to remove item", 0);
        }
      } else {
        // For guest users, just update Redux state
        dispatch(removeFromCart({ productId, finalPrice, originalPrice }));
      }
    } catch (error) {
      console.error("Error removing item:", error);
      notify("Failed to remove item. Please try again.", 0);
    }
  };
  

  return (
    <div className="w-full mb-11 flex flex-col items-center bg-surface-light dark:bg-surface-dark min-h-screen">
      {/* Theme Toggle Button */}
      <div className="w-full max-w-[1200px] px-4 py-4 flex justify-end">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-primary-light dark:hover:bg-primary-dark transition-colors"
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </div>

      <div className="h-[50px] bg-background-light dark:bg-background-dark w-full flex items-center justify-center text-sm font-medium text-text-light dark:text-text-dark">
        <span>Cart</span>
      </div>

      <div className="flex flex-col md:flex-row mt-5 justify-between w-full max-w-[1200px] px-4 md:px-5">
        <div className="text-lg text-text-light dark:text-text-dark font-semibold w-full md:w-[400px] mb-4 md:mb-0">PRODUCT</div>
        <div className="text-lg text-text-light dark:text-text-dark font-semibold flex flex-col md:flex-row justify-between w-full md:w-[750px] px-0 md:px-11">
          <h1 className="mb-4 md:mb-0">UNIT PRICE</h1>
          <h1 className="mb-4 md:mb-0">QTY</h1>
          <h1>TOTAL PRICE</h1>
        </div>
      </div>

      <div className="h-[1px] bg-slate-300 dark:bg-slate-600 w-full max-w-[1200px] my-4"></div>

      <div className="w-full max-w-[1200px] px-4 md:px-5">
        {cart?.data?.map((d, i) => {
          const ProductCart = product.find((p) => p._id === d.productId);
          if (!ProductCart) return null;

          return (
            <div key={i} className="flex flex-col md:flex-row items-center justify-between mb-5 p-4 bg-background-light dark:bg-background-dark rounded-lg shadow-sm">
              <div className="flex items-center w-full md:w-[400px] gap-3 mb-4 md:mb-0">
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
                  className="w-16 h-16 object-cover rounded"
                  alt={ProductCart.name}
                />
                <span className="text-text-light dark:text-text-dark">{ProductCart.name}</span>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center w-full md:w-[750px] px-0 md:px-11 gap-4 md:gap-0">
                <span className="text-text-light dark:text-text-dark">{formatPriceINR(ProductCart.originalPrice)}</span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-md">
                  <button
                    onClick={() =>
                      handleQtyChange({
                        productId: ProductCart._id,
                        qty: d.qty - 1,
                        finalPrice: ProductCart.finalPrice,
                        originalPrice: ProductCart.originalPrice,
                      })
                    }
                    className="px-2 text-text-light dark:text-text-dark"
                  >
                    -
                  </button>
                  <span className="px-3 text-text-light dark:text-text-dark">{d.qty}</span>
                  <button
                    onClick={() =>
                      handleQtyChange({
                        productId: ProductCart._id,
                        qty: d.qty + 1,
                        finalPrice: ProductCart.finalPrice,
                        originalPrice: ProductCart.originalPrice,
                      })
                    }
                    className="px-2 text-text-light dark:text-text-dark"
                  >
                    +
                  </button>
                </div>
                <span className="text-text-light dark:text-text-dark">
                  {formatPriceINR(ProductCart.originalPrice * d.qty)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-[1px] bg-slate-300 dark:bg-slate-600 w-full max-w-[1200px] my-4"></div>

      <div className="w-full max-w-[1200px] px-4 md:px-5 flex flex-col md:flex-row justify-between items-center my-5 gap-6">
        <div className="flex w-full md:w-[500px]">
          <input
            type="text"
            placeholder="Voucher code"
            className="border border-gray-300 dark:border-gray-600 px-4 py-2 flex-1 rounded-l-lg bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
          />
          <button className="bg-primary-light dark:bg-primary-dark text-white px-6 py-2 rounded-r-lg hover:bg-primary-dark dark:hover:bg-primary-light transition">
            Redeem
          </button>
        </div>

        <div className="w-full md:w-[300px] text-right bg-background-light dark:bg-background-dark p-4 rounded-lg shadow-sm">
          <div className="flex justify-between py-1 text-text-light dark:text-text-dark">
            <span>Original Price</span>
            <span>{formatPriceINR(cart.original_total)}</span>
          </div>
          <div className="flex justify-between py-1 text-text-light dark:text-text-dark">
            <span>Savings</span>
            <span className="text-green-600 dark:text-green-400">
              -{formatPriceINR(cart.original_total - cart.total)}
            </span>
          </div>
          <div className="flex justify-between py-1 text-text-light dark:text-text-dark">
            <span>Coupon</span>
            <span>No</span>
          </div>
          <div className="flex justify-between text-xl font-bold py-2 text-text-light dark:text-text-dark">
            <span>TOTAL</span>
            <span>{formatPriceINR(cart.total)}</span>
          </div>
          <button 
            onClick={isLogin} 
            className="bg-primary-light dark:bg-primary-dark text-white w-full py-3 mt-3 rounded-lg hover:bg-primary-dark dark:hover:bg-primary-light transition"
          >
            Check out
          </button>
        </div>
      </div>
    </div>
  );
}
