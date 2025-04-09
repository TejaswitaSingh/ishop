import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CheckOut() {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [addresses, setAddresses] = useState([
    "Address 1",
    "Address 2",
    "Address 3", // Sample data for addresses
  ]);

  return (
    <div className="w-full flex justify-center items-center py-10 bg-gray-100">
      <div className="w-[1200px] bg-white p-6 rounded-xl shadow-lg">

        {/* Row 1: Layout for Order Summary and Address Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column: Addresses */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Address</h2>
            {addresses.length > 0 ? (
              <div>
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-50"
                  >
                    <span>{address}</span>
                    <button
                      onClick={() => setAddress(address)}
                      className="text-blue-600 text-sm"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No addresses available.</p>
            )}
            <div className="mt-4">
              <Link
                to="/add-address"
                className="text-blue-600 underline"
              >
                Add New Address
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="mb-4">
              <div className="flex justify-between text-lg">
                <span>Items (0)</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Savings</span>
                <span className="text-green-600">- ₹0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3">
                <span>Total</span>
                <span>₹0.00</span>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Payment Method */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Method</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="Credit Card"
                checked={paymentMethod === "Credit Card"}
                onChange={() => setPaymentMethod("Credit Card")}
                className="text-blue-500"
              />
              Credit Card
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === "PayPal"}
                onChange={() => setPaymentMethod("PayPal")}
                className="text-blue-500"
              />
              PayPal
            </label>
          </div>
        </div>

        {/* Row 3: Place Order Button */}
        <div className="flex justify-center mt-8">
          <button
            // OnClick logic can be implemented here
            className="bg-blue-600 text-white py-3 px-6 rounded-lg w-full sm:w-1/2 text-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
