import React, {useContext, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../../../Context";
import axios from "axios";
import Swal from 'sweetalert2';

export default function CategoryView() {
const {category,categoryHandler,CATEGORY_URL,API_BASE_URL,notify}=useContext(MainContext)

    useEffect(
        ()=>{
            categoryHandler()
        },[]
    )

    function statusHandler(id){
        axios.patch(API_BASE_URL + CATEGORY_URL + `/status/${id}`).then(
          (response)=>{
              if(response.data.status==1){
                categoryHandler()
              }
              notify(response.data.msg,response.data.status)
          }
        ).catch(
          (error)=>{
            notify("Internal server error",0)
          }
        )
    }

    const deleteHandler=(id)=>{

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
          axios.delete(API_BASE_URL+CATEGORY_URL+"/delete/" + id).then(
            (response)=>{
              if(response.data.status==1){
                categoryHandler()
              }
              notify(response.data.msg,response.data.status)
            }
          ).catch(
            (error)=>{
    
            }
          )
        }
      });
    }



  return (
    <div className="p-5">
      <div className="flex justify-around">
      <h1 className="text-2xl font-bold mb-6 text-center">Category View</h1>
      <div className="mb-4 text-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <Link to={"/admin/category/add"}>Add Category +</Link>
        </button>
      </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Slug</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              Array.isArray(category)
              &&
            category.map((cat,i) => { 
              return(
                <tr key={i}>
                <td className="px-4 py-2 border">{cat.name}</td>
                <td className="px-4 py-2 border">{cat.slug}</td>
                <td className="px-4 py-2 border">
                  <img
                    src={API_BASE_URL + CATEGORY_URL+ "/" + cat.category_image}
                    alt={cat.name}
                    className="w-12 h-12 object-cover mx-auto"
                  />
                </td>
                <td className="px-4 py-2 border">
                  {
                    cat.status ?
                    <button onClick={()=>statusHandler(cat._id)} className="px-4 py-1 rounded bg-green-500 text-white hover:bg-green-60 h-[40px]">
                        Active
                    </button>
                    :
                    <button onClick={()=>statusHandler(cat._id)} className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 h-[40px]">
                        Inactive
                    </button>
                  }
              </td>
                <td className="px-4 py-2 border flex justify-center gap-2">
                <Link to={`/admin/category/edit/${cat._id}`}>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    Edit
                  </button>
                </Link>
                  <button
                    onClick={() => deleteHandler(cat._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              )
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
