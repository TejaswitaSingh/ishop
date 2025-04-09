import React, { useContext, useState } from "react";
import { MainContext } from "../../Context";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux"
import { login } from "../../redux/reducers/adminSlice";


const AdminLogin = () => {
  const {notify,ADMIN_URL, API_BASE_URL}=useContext(MainContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const loginHandler=(e)=>{
    e.preventDefault();
    const data={
      email:e.target.email.value,
      password:e.target.password.value
    }
    axios.post(API_BASE_URL+ADMIN_URL+"/login",data).then(
      (response)=>{
          if(response.data.status==1){
            e.target.reset();
            navigate("/admin")
            dispatch(login({
              data:response.data.admin,
              token:response.data.token
            })
          )
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <form onSubmit={loginHandler} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
