import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './website/Pages/Home'
import Profile from './website/Pages/Profile'
import Layout from './website/Pages/Layout'
import Store from './website/Pages/Store'
import AdminLayout from './admin/Pages/AdminLayout'
import Dashboard from './admin/Pages/Dashboard'
import CategoryView from './admin/Pages/category/CategoryView'
import CategoryAdd from './admin/Pages/category/CategoryAdd'
import ProductView from './admin/Pages/products/ProductView'
import ProductAdd from './admin/Pages/products/ProductAdd'
import CategoryEdit from './admin/Pages/category/CategoryEdit'
import ColorView from './admin/Pages/color/ColorView'
import ColorAdd from './admin/Pages/color/ColorAdd'
import ColorEdit from './admin/Pages/color/ColorEdit'
import MultipleImages from './admin/Pages/products/MultipleImages'
import AdminLogin from './admin/Pages/AdminLogin'
import Cart from './website/Pages/Cart'
import ProductEdit from './admin/Pages/products/ProductEdit'
import { useDispatch } from 'react-redux'
import { lstoCart } from './redux/reducers/cartSlice'
import RegisterUser from './website/Pages/Registeruser'
import LoginUser from './website/Pages/LoginUser'
import { lsToUser } from './redux/reducers/userSlice'
import CheckOut from './website/Pages/CheckOut'




export default function App() {
  const dispatcher=useDispatch()
  useEffect(
    () => {
      dispatcher(lstoCart())
      dispatcher(lsToUser())
  }, 
  [])
  const router=createBrowserRouter(
    [
      // website routes
      {
        path: '/',
        element:<Layout/>,
        children:[
          {
            path:"/",
            element:<Home/>
          },
          {
            path:"/profile",
            element:<Profile/>
          },
          {
            path:"/store/:categorySlug?",
            element:<Store/>
          },
          {
            path:"/cart",
            element:<Cart/>
          },
          {
            path:"/checkout",
            element:<CheckOut/>
          },
        ]
      },
      {
        path:"/register",
        element:<RegisterUser/>
      },
      {
        path:"/login",
        element:<LoginUser/>
      },
      // admin routes
      {
        path:"/admin",
        element:<AdminLayout/>,
        children:[
          {
            path:"/admin",
            element:<Dashboard/>
          },
          {
            path:"category",
            element:<CategoryView/>
          },
          {
            path:"category/add",
            element:<CategoryAdd/>
          },
          {
            path:"category/edit/:categoryId",
            element:<CategoryEdit/>
          },
          {
            path:"product",
            element:<ProductView/>
          },
          {
            path:"product/add",
            element:<ProductAdd/>
          },
          {
            path:"product/edit/:productId",
            element:<ProductEdit/>
          },
          {
            path:"product/multiple-image/:productId",
            element:<MultipleImages/>
          },
          {
            path:"color",
            element:<ColorView/>
          },
          {
            path:"color/add",
            element:<ColorAdd/>
          },
          {
            path:"color/edit/:colorId",
            element:<ColorEdit/>
          }
        ]
      },
      {
        path:"admin/login",
        element:<AdminLogin/>
      }
    ]
  )
  return (
    <RouterProvider router={router}/>
  )
}
