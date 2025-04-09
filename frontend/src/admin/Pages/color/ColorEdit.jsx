import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import { MainContext } from '../../../Context';

export default function ColorEdit() {
  const { notify, API_BASE_URL, colorHandler, COLOR_URL, color } = useContext(MainContext);
  const { colorId } = useParams();

  // Controlled state for inputs
  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("#000000");

  // Fetch color details when component mounts or colorId changes
  useEffect(() => {
    colorHandler(colorId);
  }, [colorId]);

  // Update input values when color data is received
  useEffect(() => {
    if (color) {
      setColorName(color.name || "");
      setColorCode(color.colorCode || "#000000");
    }
  }, [color]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: colorName,
      colorCode: colorCode
    };

    axios.put(API_BASE_URL + COLOR_URL + "/update/" + colorId, data)
      .then((response) => {
        if (response.data.status === 1) {
          setColorName("");  // Clear inputs after update
          setColorCode("#000000");
        }
        notify(response.data.msg, response.data.status);
      })
      .catch(() => {
        notify("Internal server error", 0);
      });
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center p-4">
      {/* Breadcrumbs */}
      <nav className="mb-4 w-full max-w-lg" aria-label="Breadcrumb">
        <ol className="flex items-center text-sm text-gray-600 space-x-2">
          <li>
            <Link to="/admin" className="text-blue-600 hover:underline">DashBaord</Link>
          </li>
          <li><span className="text-gray-400">/</span></li>
          <li>
            <Link to="/admin/color" className="text-blue-600 hover:underline">Color</Link>
          </li>
          <li><span className="text-gray-400">/</span></li>
          <li><span className="text-gray-500">Edit</span></li>
        </ol>
      </nav>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Color</h2>

        {/* Color Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Color Name</label>
          <input
            name="name"
            type='text'
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter color name"
          />
        </div>

        {/* Color Code */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Color Code</label>
          <input
            type="color"
            name="colorCode"
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
            className="w-full h-10 px-2 py-1 rounded-lg"
          />
          <div style={{ background: colorCode }} className='w-10 h-4 rounded-full my-4'></div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Update Color
        </button>
      </form>
    </div>
  );
}
