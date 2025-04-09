import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { MainContext } from "../../../Context";
import Select from "react-select";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProductEdit = () => {
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

  const { id } = useParams();
  const [selColors, SetSelColors] = useState([]);
  const [longDescription, setLongDescription] = useState("");
  const [productData, setProductData] = useState(null);

  const productName = useRef();
  const productSlug = useRef();
  const originalPrice = useRef();
  const discountPercentage = useRef();
  const finalPrice = useRef();
  const categorySelect = useRef();
  const shortDescription = useRef();

  useEffect(() => {
    axios.get(`${API_BASE_URL + PRODUCT_URL}/edit/${id}`).then((response) => {
      if (response.data.status === 1) {
        const data = response.data.product;
        setProductData(data);
        productName.current.value = data.name;
        productSlug.current.value = data.slug;
        originalPrice.current.value = data.originalPrice;
        discountPercentage.current.value = data.discountPercentage;
        finalPrice.current.value = data.finalPrice;
        setLongDescription(data.longDescription);
        SetSelColors(data.colors.map((color) => color._id));
      }
    });
    colorHandler();
    categoryHandler();
  }, [id]);

  const finalPriceCalc = () => {
    let op = originalPrice.current.value;
    let disp = discountPercentage.current.value;
    let final = Math.floor(op - op * (disp / 100));
    finalPrice.current.value = final;
  };

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
    if (e.target.thumbnail.files[0]) {
      form.append("thumbnail", e.target.thumbnail.files[0]);
    }
    form.append("colors", JSON.stringify(selColors));

    axios
      .post(`${API_BASE_URL + PRODUCT_URL}/update/${id}`, form)
      .then((response) => {
        notify(response.data.msg, response.data.status);
      })
      .catch(() => {
        notify("Internal server error", 0);
      });
  };

  if (!productData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 h-fit">
      <div className="w-full p-6 bg-white rounded-md shadow-md">
        <nav className="mb-4 text-sm text-gray-600">
          <Link to="/admin" className="text-blue-500 hover:underline">
            Dashboard /
          </Link>
          <Link to="/admin/product" className="text-blue-500 hover:underline">
            Product /
          </Link>
          <span className="font-semibold text-gray-800"> Edit</span>
        </nav>

        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <form className="space-y-6" onSubmit={submitHandler}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input type="text" name="name" ref={productName} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-700">Slug</label>
              <input type="text" name="slug" ref={productSlug} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div>
            <label className="text-gray-700">Short Description</label>
            <textarea name="shortDescription" ref={shortDescription} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
          </div>
          <div>
            <label className="text-gray-700">Long Description</label>
            <ReactQuill theme="snow" value={longDescription} onChange={setLongDescription} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700">Original Price</label>
              <input type="number" name="originalPrice" ref={originalPrice} onChange={finalPriceCalc} className="w-full p-2 border border-gray-300 rounded-md" min="1" />
            </div>
            <div>
              <label className="block text-gray-700">Discount Percentage</label>
              <input type="number" name="discountPercentage" ref={discountPercentage} onChange={finalPriceCalc} className="w-full p-2 border border-gray-300 rounded-md" min="0" />
            </div>
            <div>
              <label className="block text-gray-700">Final Price</label>
              <input type="number" name="finalPrice" ref={finalPrice} className="w-full p-2 border border-gray-300 rounded-md" min="1" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Thumbnail</label>
            <input type="file" name="thumbnail" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>

          <button type="submit" className="w-full bg-blue-800 text-white p-3 rounded-md hover:bg-blue-600">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
