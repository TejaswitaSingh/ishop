import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { formatPriceINR } from "../../helper";
import ApiService from "../../services/apiService";
import { emptyCart } from "../../redux/reducers/cartSlice";
import { FaMoon, FaSun } from "react-icons/fa";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import axios from "axios";

export default function CheckOut() {
  const { errors, isLoading, Razorpay } = useRazorpay();
  const user = useSelector((state) => state.user.data);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

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

  async function handlePlaceOrder() {
    if (!address) {
      setError("Please select a shipping address");
      return;
    }

    if (paymentMethod === null) {
      setError("Please select a payment method");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const shippingDetails = {
        name: user.name,
        contact: user.contact || user.email,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country || 'India'
      };

      const orderData = {
        user_id: user._id,
        order_total: cart.total,
        payment_mode: paymentMethod,
        shipping_details: shippingDetails,
        product_details: cart.data.map(item => ({
          product_id: item.productId,
          qty: item.qty,
          price: item.finalPrice,
          total: item.finalPrice * item.qty
        }))
      };

      const response = await ApiService.placeOrder(orderData);
      
      if (response.data.status === 1) {
        if(paymentMethod === 0){
          // For COD orders
          dispatch(emptyCart());
          localStorage.removeItem("cart-data");
          localStorage.removeItem("cart-total");
          localStorage.removeItem("original-total");
          setSuccess(true);
          
          // Fetch order details for confirmation
          const orderDetailsResponse = await ApiService.getOrderDetails(response.data.order_id);
          setOrderDetails(orderDetailsResponse.data);
        } else {
          // For online payment
          handlePayment(response.data.razorpay_order.order_id, response.data.razorpay_order.receipt);
        }
      } else {
        setError(response.data.msg || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setError(error.response?.data?.msg || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.shipping_address?.length > 0) {
      setAddresses(user.shipping_address);
    }
  }, [user]);

  // razorpay
  const handlePayment = async (order_id,receipt) => {
      const options = {
      key: "rzp_test_JN5YP7U5LXeCQ3", // Enter the Key ID generated from the Dashboard
      currency: "INR",
      name: "TeeJay",
      description: "Unleashing monstrous deals daily!",
      image: "tj.jpg",
      order_id: order_id, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
      handler: 
      async function (response) {
        console.log("Payment Success Response",response);
        try{
          const res=await axios.post("http://localhost:5000/order/payment-success",{
            order_id,
            razorpay_response:response,
            user_id:user?.data?._id
          });
          console.log("Payment API Response:",res.data);
          notify(res.data.msg,res.data.status);
          if(res.data.status===1){
            navigator(`/thankYou/${res.data.order_id}`);
            dispatch(emptyCart())
          }
        }catch(error){
          console.log("Payment Success API error",error);
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.contact,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
  
    const rzp1 = new Razorpay(options);
  
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
  
    rzp1.open();
  };
  // razorpay

  if (success) {
    return (
      <div className="w-full flex justify-center items-center py-10 bg-surface-light dark:bg-surface-dark min-h-screen">
        <div className="w-full max-w-[1200px] bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg text-center mx-4">
          <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-4">Order Placed Successfully!</h2>
          {orderDetails && (
            <div className="mb-4 text-left">
              <p className="text-text-light dark:text-text-dark">Order ID: {orderDetails.order_id}</p>
              <p className="text-text-light dark:text-text-dark">Total Amount: {formatPriceINR(orderDetails.order_total)}</p>
              <p className="text-text-light dark:text-text-dark">Payment Mode: {orderDetails.payment_mode === 0 ? 'Cash on Delivery' : 'Online Payment'}</p>
            </div>
          )}
          <p className="text-text-light dark:text-text-dark mb-4">Thank you for your order. We will process it shortly.</p>
          <Link to="/" className="text-primary-light dark:text-primary-dark hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center py-10 bg-surface-light dark:bg-surface-dark min-h-screen">
      <div className="w-full max-w-[1200px] bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg mx-4">
        {/* Theme Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-primary-light dark:hover:bg-primary-dark transition-colors"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>

        {/* Row 1: Layout for Order Summary and Address Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Addresses */}
          <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
              Select Address
            </h2>
            {addresses.length > 0 ? (
              <div>
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 border-b border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-surface-light dark:hover:bg-surface-dark ${
                      address?.postalCode === addr.postalCode
                        ? "bg-surface-light dark:bg-surface-dark"
                        : ""
                    }`}
                  >
                    <span className="text-text-light dark:text-text-dark">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}, {addr.city},{" "}
                      {addr.state} - {addr.postalCode}, {addr.country}
                    </span>
                    <button
                      onClick={() => setAddress(addr)}
                      className="text-primary-light dark:text-primary-dark text-sm"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-light dark:text-text-dark">No addresses available.</p>
            )}
            <div className="mt-4">
              <Link to="/add-address" className="text-primary-light dark:text-primary-dark underline">
                Add New Address
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
              Order Summary
            </h2>
            <div className="mb-4">
              <div className="flex justify-between text-lg text-text-light dark:text-text-dark">
                <span>Items ({cart.data.length})</span>
                <span>{formatPriceINR(cart.original_total)}</span>
              </div>
              <div className="flex justify-between text-lg text-text-light dark:text-text-dark">
                <span>Savings</span>
                <span className="text-green-600 dark:text-green-400">
                  -{formatPriceINR(cart.original_total - cart.total)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 text-text-light dark:text-text-dark">
                <span>Total</span>
                <span>{formatPriceINR(cart.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Payment Method */}
        <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mt-8">
          <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
            Payment Method
          </h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <label className="flex items-center gap-2 text-text-light dark:text-text-dark">
              <input
                type="radio"
                name="paymentMethod"
                value={1}
                checked={paymentMethod === 1}
                onChange={() => setPaymentMethod(1)}
                className="text-primary-light dark:text-primary-dark"
              />
              Online Payment
            </label>
            <label className="flex items-center gap-2 text-text-light dark:text-text-dark">
              <input
                type="radio"
                name="paymentMethod"
                value={0}
                checked={paymentMethod === 0}
                onChange={() => setPaymentMethod(0)}
                className="text-primary-light dark:text-primary-dark"
              />
              Cash on Delivery (COD)
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Row 3: Place Order Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`bg-primary-light dark:bg-primary-dark text-white py-3 px-6 rounded-lg w-full sm:w-1/2 text-xl font-semibold hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
