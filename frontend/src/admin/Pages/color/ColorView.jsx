import React, {useContext, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../../../Context";
import axios from "axios";
import Swal from 'sweetalert2';

export default function ColorView() {
const {colorHandler,COLOR_URL,color,API_BASE_URL,notify}=useContext(MainContext)

    useEffect(
        ()=>{
          colorHandler()
        },[]
    )

    function statusHandler(id){
        axios.patch(API_BASE_URL + COLOR_URL + `/status/${id}`).then(
          (response)=>{
              if(response.data.status==1){
                colorHandler()
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
          axios.delete(API_BASE_URL+COLOR_URL+"/delete/" + id).then(
            (response)=>{
              if(response.data.status==1){
                colorHandler()
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
      <h1 className="text-2xl font-bold mb-6 text-center">Color View</h1>
      <div className="mb-4 text-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <Link to={"/admin/color/add"}>Add Color +</Link>
        </button>
      </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Color  Code</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              Array.isArray(color)
              &&
              color.map((col,i) => { 
              return(
                <tr key={i}>
                <td className="px-4 py-2 border">{col.name}</td>
                <td style={{background:col.colorCode}} className="px-4 py-2 border">{col.colorCode}</td>
                <td className="px-4 py-2 border">
                  {
                    col.status ?
                    <button onClick={()=>statusHandler(col._id)} className="px-4 py-1 rounded bg-green-500 text-white hover:bg-green-60">
                        Active
                    </button>
                    :
                    <button onClick={()=>statusHandler(col._id)} className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600">
                        Inactive
                    </button>
                  }
              </td>
                <td className="px-4 py-2 border flex justify-center gap-2">
                <Link to={`/admin/color/edit/${col._id}`}>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    Edit
                  </button>
                </Link>
                  <button
                    onClick={() => deleteHandler(col._id)}
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
