import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../../../Context";
import Select from "react-select";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProductAdd = () => {
  const {
    notify,
    category,
    categoryHandler,
    colorHandler,
    COLOR_URL,
    color,
    PRODUCT_URL,
    API_BASE_URL,
  } = useContext(MainContext);

  const [selColors, SetSelColors] = useState([]);
  const [longDescription, setLongDescription] = useState("");

  const productName = useRef();
  const productSlug = useRef();
  const originalPrice = useRef();
  const discountPercentage = useRef();
  const finalPrice = useRef();

  const finalPriceCalc = () => {
    let op = originalPrice.current.value;
    let disp = discountPercentage.current.value;
    let final = Math.floor(op - op * (disp / 100));
    finalPrice.current.value = final;
  };

  function generateSlug() {
    let slug = productName.current.value;
    slug = slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

    productSlug.current.value = slug;
  }

  const submitHandler = (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append("name", productName.current.value);
    form.append("slug", productSlug.current.value);
    form.append("originalPrice", originalPrice.current.value);
    form.append("discountPercentage", discountPercentage.current.value);
    form.append("finalPrice", finalPrice.current.value);
    form.append("categoryId", e.target.category.value);
    form.append("shortDescription", e.target.shortDescription.value);
    form.append("longDescription", longDescription);
    form.append("thumbnail", e.target.thumbnail.files[0]);
    form.append("colors", JSON.stringify(selColors));

    axios
      .post(API_BASE_URL + PRODUCT_URL + "/create", form)
      .then((response) => {
        if (response.data.status === 1) {
          e.target.reset(); // Reset the form fields

          // Clear the ref-based inputs
          productName.current.value = "";
          productSlug.current.value = "";
          originalPrice.current.value = "";
          discountPercentage.current.value = "";
          finalPrice.current.value = "";

          // Reset state values
          SetSelColors([]);
          setLongDescription("");
        }
        notify(response.data.msg, response.data.status);
      })
      .catch((error) => {
        notify("Internal server error", 0);
      });
  };

  useEffect(() => {
    colorHandler();
    categoryHandler();
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-100 h-fit">
      <div className="w-full p-6 bg-white rounded-md shadow-md">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-gray-600">
          <Link to="/admin" className="text-blue-500 hover:underline">
            Dashboard /
          </Link>
          <Link to="/admin/product" className="text-blue-500 hover:underline">
            Product /
          </Link>
          <span className="font-semibold text-gray-800"> Add</span>
        </nav>

        <h1 className="text-2xl font-bold mb-6">Add Product</h1>
        <form className="space-y-6" onSubmit={submitHandler}>
          {/* Name and Slug in one row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                ref={productName}
                onChange={generateSlug}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Slug</label>
              <input
                type="text"
                name="slug"
                ref={productSlug}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Short and Long Description */}
          <div>
            <label className="text-gray-700">Short Description</label>
            <textarea
              name="shortDescription"
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div>
            <label className="text-gray-700">Long Description</label>
            <ReactQuill
              theme="snow"
              value={longDescription}
              onChange={setLongDescription}
            />
          </div>

          {/* Prices (Original, Discount, Final) */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700">Original Price</label>
              <input
                type="number"
                name="originalPrice"
                ref={originalPrice}
                onChange={finalPriceCalc}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-700">Discount Percentage</label>
              <input
                type="number"
                name="discountPercentage"
                ref={discountPercentage}
                onChange={finalPriceCalc}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700">Final Price</label>
              <input
                type="number"
                name="finalPrice"
                ref={finalPrice}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>
          </div>

          {/* Category and Colors */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-gray-700">Category</label>
              <Select
                options={category.map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))}
                name="category"
              />
            </div>
            {/* Color Dropdown */}
            <div>
              <label className="block text-gray-700">Colors</label>
              <Select
                onChange={(color) => {
                  const selectedColors = color.map((o) => o.value);
                  SetSelColors(selectedColors);
                }}
                options={color.map((col) => ({
                  value: col._id,
                  label: col.name,
                }))}
                isMulti
                name="colors"
                closeMenuOnSelect={false}
              />
              <p className="text-sm text-gray-500 mt-1">
                Hold Ctrl (Windows) or Command (Mac) to select multiple colors.
              </p>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-gray-700">Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-800 text-white p-3 rounded-md hover:bg-blue-600"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductAdd;
