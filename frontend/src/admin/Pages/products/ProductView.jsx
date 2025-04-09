import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../../../Context";
import axios from "axios";
import Swal from "sweetalert2";
import { GrMultiple } from "react-icons/gr";
import { MdOutlineReadMore } from "react-icons/md";

export default function ProductView() {
  const {
    notify,
    PRODUCT_URL,
    productHandler,
    product,
    API_BASE_URL,
    category,
    categoryHandler,
  } = useContext(MainContext);

  useEffect(() => {
    productHandler();
  }, []);

  function statusHandler(id, flag) {
    axios
      .patch(API_BASE_URL + PRODUCT_URL + `/status`, { id, flag })
      .then((response) => {
        if (response.data.status == 1) {
          productHandler();
        }
        notify(response.data.msg, response.data.status);
      })
      .catch((error) => {
        notify("Internal server error", 0);
      });
  }

  const deleteHandler = (id) => {
    
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        axios
          .delete(API_BASE_URL + PRODUCT_URL + "/delete/" + id)
          .then((response) => {
            if (response.data.status == 1) {
              productHandler();
            }
            notify(response.data.msg, response.data.status);
          })
          .catch((error) => {});
      }
    });
  };

  const viewAllDetails = (prod) => {
    console.log(prod);
  
    let mainImage = API_BASE_URL + PRODUCT_URL + "/" + prod?.thumbnail; // Set default main image
  
    // Generate color circles dynamically
    const colorCircles = prod?.colors?.length
      ? prod.colors
          .map(
            (col) =>
              `<div 
                class="h-6 w-6 rounded-full border border-gray-300 shadow-md cursor-pointer" 
                style="background: ${col.colorCode};">
              </div>`
          )
          .join("")
      : `<p class="text-gray-500">No colors available.</p>`;
  
    // Generate product images dynamically
    const productImages = prod?.images?.length
      ? prod.images
          .map(
            (img) =>
              `<img src="${API_BASE_URL + PRODUCT_URL + "/" + img}" 
                     onclick="document.getElementById('mainProductImage').src='${API_BASE_URL + PRODUCT_URL + "/" + img}'"
                     class="w-20 h-20 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform">`
          )
          .join("")
      : `<p class="text-gray-500">No additional images available.</p>`;
  
    Swal.fire({
      html: `
        <div class="p-6 max-w-[700px] mx-auto">
          <div class="flex flex-col md:flex-row gap-6">
            
            <!-- Product Image -->
            <div class="md:w-1/2 w-full">
              <img id="mainProductImage" src="${mainImage}" 
                   alt="${prod?.name}" 
                   class="rounded-lg shadow-lg w-full h-64 object-cover transition-all duration-300">
  
              <!-- Image Gallery -->
              <div class="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                ${productImages}
              </div>
            </div>
  
            <!-- Product Details -->
            <div class="md:w-1/2 w-full">
              <h2 class="text-2xl font-bold text-gray-800">${prod?.name}</h2>
              <p class="text-gray-500 text-sm mt-1">#${prod?.slug}</p>
  
              <div class="mt-3">
                <span class="text-xl font-semibold text-red-500">₹${prod?.finalPrice}</span>
                <span class="text-gray-400 line-through ml-2">₹${prod?.originalPrice}</span>
                <span class="ml-2 text-green-500 font-semibold">${prod?.discountPercentage}% OFF</span>
              </div>
  
              <!-- Colors -->
              <div class="mt-4 text-center">
                <strong class="text-gray-700 block mb-2">Available Colors:</strong>
                <div class="flex justify-center gap-2">
                  ${colorCircles}
                </div>
              </div>
  
              <!-- Short Description -->
              <div class="mt-4">
                <strong class="text-gray-700 block mb-1">Short Description:</strong>
                <p class="text-gray-700 text-sm bg-gray-100 p-2 rounded-lg border border-gray-300">
                  ${prod?.shortDescription || "No short description available."}
                </p>
              </div>
  
              <!-- Long Description -->
              <div class="mt-4">
                <strong class="text-gray-700 block mb-1">Detailed Description:</strong>
                <div class="max-h-[150px] overflow-y-auto text-sm text-gray-700 p-2 border border-gray-300 rounded-lg bg-gray-100">
                  ${prod?.longDescription || "No additional details available."}
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      customClass: {
        popup: "w-full md:w-[800px] rounded-lg shadow-xl",
      },
    });
  };
  
  


  return (
    <div className="p-5">
      <div className="flex justify-around">
        <h1 className="text-2xl font-bold mb-6 text-center">Product View</h1>
        <div className="mb-4 text-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <Link to={"/admin/product/add"}>Add Product +</Link>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 text-center">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Top Selling</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(product) &&
              product.map((prod, i) => {
                return (
                  <tr key={i}>
                    <td className="px-4 py-2 border">{prod.name}</td>
                    <td className="px-4 py-2 border">
                      <del>₹{prod.originalPrice}</del>
                      <span className="text-red-600">
                        ({prod.discountPercentage}%)
                      </span>
                      <span>₹{prod.finalPrice}</span>
                    </td>
                    <td className="px-4 py-2 border">
                      {prod?.categoryId?.name}
                    </td>
                    <td className="px-4 py-2 border">
                      <img
                        src={API_BASE_URL + PRODUCT_URL + "/" + prod.thumbnail}
                        alt={prod.name}
                        className="w-12 h-12 object-cover mx-auto"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      {prod.status ? (
                        <button
                          onClick={() => statusHandler(prod._id, 1)}
                          className="px-4 py-1 rounded bg-green-500 text-white hover:bg-green-60"
                        >
                          Active
                        </button>
                      ) : (
                        <button
                          onClick={() => statusHandler(prod._id, 1)}
                          className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          Inactive
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {prod.stock ? (
                        <button
                          onClick={() => statusHandler(prod._id, 2)}
                          className="px-4 py-1 rounded bg-green-500 text-white hover:bg-green-60"
                        >
                          In
                        </button>
                      ) : (
                        <button
                          onClick={() => statusHandler(prod._id, 2)}
                          className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          Out
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {prod.topSelling ? (
                        <button
                          onClick={() => statusHandler(prod._id, 3)}
                          className="px-4 py-1 rounded bg-green-500 text-white hover:bg-green-60"
                        >
                          Yes
                        </button>
                      ) : (
                        <button
                          onClick={() => statusHandler(prod._id, 3)}
                          className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          No
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2 border flex justify-center gap-2">
                    <Link to={`/admin/product/edit/${prod._id}`}>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                        Edit
                      </button>
                      </Link>
                      <button
                        onClick={() => deleteHandler(prod._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <Link to={`/admin/product/multiple-image/` + prod._id}>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                          <GrMultiple />
                        </button>
                      </Link>

                      <button
                        onClick={() => viewAllDetails(prod)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        <MdOutlineReadMore />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
