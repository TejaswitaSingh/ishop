import React, { createContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
const MainContext = createContext();

export default function Context(props) {
    // urls
    const API_BASE_URL = "http://localhost:5000";
    const CATEGORY_URL = "/category";
    const COLOR_URL = "/color";
    const PRODUCT_URL = "/product";
    const ADMIN_URL = "/admin";
    const USER_URL = "/user";
    // urls

    // states
    const [category, setCategory] = useState([]);
    const [color, setColor] = useState([]);
    const [product, setProduct] = useState([]);
    // states

    const notify = (msg, flag) =>
    toast(msg, { type: flag ? "success" : "error" });

    // functions//
    //category
    function categoryHandler(category_id = null) {
    let url=null;
    if(category_id == null){
        url = API_BASE_URL + CATEGORY_URL;
    }else{
        url= API_BASE_URL + CATEGORY_URL + `/${category_id}`;
    }
    axios.get(url).then((success) => {
        setCategory(success.data.category);
        })
        .catch((error) => {
        console.log(error);
        });
    }
    //category

    //color
    function colorHandler(color_id = null) {
        let url=null;
        if(color_id == null){
            url = API_BASE_URL + COLOR_URL;
        }else{
            url= API_BASE_URL + COLOR_URL + `/${color_id}`;
        }
        axios.get(url).then((success) => {
            setColor(success.data.color);
            })
            .catch((error) => {
            console.log(error);
            });
        }
    //color

    //product
    function productHandler(product_id = null,limit=0,categorySlug=null,productColor=null) {
        let url=null;
        if(product_id == null){
            url = API_BASE_URL + PRODUCT_URL;
        }else{
            url= API_BASE_URL + PRODUCT_URL + `/${product_id}`;
        }
        const query = new URLSearchParams();
        query.append("limit", limit);
        query.append("categorySlug", categorySlug);
        query.append("productColor", productColor);

        axios.get(url+"?"+query).then((success) => {
            setProduct(success.data.product);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    //product
    // functions//
    return (
    <MainContext.Provider
        value={{ notify,USER_URL,ADMIN_URL,PRODUCT_URL,productHandler,product, category,categoryHandler,colorHandler,COLOR_URL,color,  API_BASE_URL, CATEGORY_URL }}
    >
        {props.children}
        <ToastContainer />
    </MainContext.Provider>
    );
}
export { MainContext };
