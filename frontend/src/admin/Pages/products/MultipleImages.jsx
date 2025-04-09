import React, { useContext, useRef } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import { MainContext } from '../../../Context';

export default function MultipleImages() {
    const{productId} =useParams();
    console.log(productId,"productid")
    const {notify,category,categoryHandler,colorHandler,COLOR_URL,color,PRODUCT_URL,API_BASE_URL,CATEGORY_URL,} = useContext(MainContext);
    const handleSubmit=(e)=>{
        e.preventDefault();
        const formData = new FormData();
        for(let img of e.target.productImage.files){
            formData.append("images",img)
        }
        axios.post(API_BASE_URL + PRODUCT_URL + "/multiple-image/"+ productId,
            formData).then(
            (response)=>{
                if(response.data.status==1){
                e.target.reset();
                }
                notify(response.data.msg,response.data.status)
            }
        ).catch(
            (error)=>{
            notify("Internal server error",0)
            }
        )
    }
return (
    <div className="bg-gray-100 flex flex-col items-center p-4">
    {/* Breadcrumbs */}
    <nav className="mb-4 w-full max-w-lg" aria-label="Breadcrumb">
        <ol className="flex items-center text-sm text-gray-600 space-x-2">
        <li>
            <Link to="/admin" className="text-blue-600 hover:underline">
            DashBaord
            </Link>
        </li>
        <li>
          <span className="text-gray-400">/</span>
        </li>
        <li>
          <Link to="/admin/product" className="text-blue-600 hover:underline">
            Product
          </Link>
        </li>
        <li>
          <span className="text-gray-400">/</span>
        </li>
        <li>
          <span className="text-gray-500">Add</span>
        </li>
      </ol>
    </nav>

    {/* Form */}
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add</h2>
      {/* Image */}
      <div className="mb-4">
        <label htmlFor="productImage" className="block text-gray-700 font-medium mb-2">
          Product Images
        </label>
        <input
          type="file"
          id="productImage"
          name="productImage"
          multiple
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        Add Images
      </button>
    </form>
  </div>
  )
}
