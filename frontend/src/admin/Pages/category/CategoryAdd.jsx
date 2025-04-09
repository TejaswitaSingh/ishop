import React, { useContext, useRef } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import { MainContext } from '../../../Context';
import { useSelector } from 'react-redux';

export default function CategoryAdd() {
  const admin = useSelector((state)=>state.admin)
  const {notify ,API_BASE_URL,CATEGORY_URL}= useContext(MainContext)
  const categoryName=useRef();
  const categorySlug=useRef();

  function generateSlug() {
    let slug=categoryName.current.value
      slug = slug.toLowerCase()  // Convert to lowercase
        .trim()  // Remove leading/trailing spaces
        .replace(/\s+/g, '-')  // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, '')  // Remove any non-alphanumeric characters (except hyphens)
        .replace(/--+/g, '-')  // Replace multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, '');  // Remove leading or trailing hyphens

        categorySlug.current.value=slug
}


    const handleSubmit=(e)=>{
      e.preventDefault();
      let formData=new FormData()
      formData.append("name",categoryName.current.value);
      formData.append("slug",categorySlug.current.value);
      formData.append("category_image",e.target.category_image.files[0])

      axios.post(API_BASE_URL + CATEGORY_URL +"/create",formData,{
        headers:{
          Authorization:`Bearer ${admin?.token}` 
        }
      }).then(
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
            <Link to="/admin/category" className="text-blue-600 hover:underline">
              Category
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Category</h2>

        {/* Category Name */}
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-gray-700 font-medium mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            ref={categoryName}
            onChange={generateSlug}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter category name"
          />
        </div>

        {/* Slug */}
        <div className="mb-4">
          <label htmlFor="slug" className="block text-gray-700 font-medium mb-2">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            readOnly
            ref={categorySlug}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter slug"
          />
        </div>

        {/* Image */}
        <div className="mb-4">
          <label htmlFor="category_image" className="block text-gray-700 font-medium mb-2">
            Category Image
          </label>
          <input
            type="file"
            id="category_image"
            name="category_image"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Create Category
        </button>
      </form>
    </div>
  );
}