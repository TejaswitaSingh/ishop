import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineAutoGraph } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { IoIosColorFilter } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
import { useSelector,useDispatch} from "react-redux";
import { login,logout,lsToAdmin } from "../../redux/reducers/adminSlice";

export default function SideMenu() {

    const admin=useSelector((state)=>state.admin.data);
    const dispatcher=useDispatch()
    const location=useLocation()
    const navigate =useNavigate()

    function getAdmin(){
        const lsAdmin=localStorage.getItem("admin");
        if(lsAdmin){
            const lsToken=localStorage.getItem("admin-token");
            const adminStamp=localStorage.getItem("adminTimeStamp");
            const currentTime=new Date().getTime()
            const rem=currentTime-adminStamp;
            if(rem>(3600000)){
                navigate("admin/login")
                dispatcher(logout())
                return undefined
            }else{
                return {lsAdmin,lsToken}
            }
        }else{
            return {lsAdmin:null}
        }
    }

    useEffect(
        ()=>{
            const {lsAdmin,lsToken}= getAdmin()
            if(lsAdmin){
                dispatcher(
                    lsToAdmin(
                        {
                            data:JSON.parse(lsAdmin),
                            token:lsToken
                        }
                    )
                )
            }
        },
        []
    )


    useEffect(
        ()=>{
            const lsAdmin= getAdmin()
            if(admin==null && lsAdmin==undefined){
                navigate("/admin/login")
            }
        },
        [admin,location.pathname]
    )


const menu = [
    {
        title: "DashBoard",
        icon: <MdOutlineAutoGraph />,
        link: "/admin",
    },
    {
        title: "Category",
        icon: <TbCategoryPlus />,
        link: "/admin/category",
    },
    {
        title: "Product",
        icon: <MdOutlineProductionQuantityLimits />,
        link: "/admin/product",
    },
    {
        title: "Color",
        icon: <IoIosColorFilter />,
        link: "/admin/color",
    }
];
return (
    <div className="bg-[#111c43] h-[100vh]">
    <h1 className="w-full text-center border-b border-[#ffffff1a] text-white font-bold text-[30px] ">
        <span className="text-[#FF4252]">i</span>
        SHOP
    </h1>
    <ul className="mt-10 flex flex-col gap-10 text-white text-[20px]">

        {
        menu.map((item, index) => (
        <li key={index} className="flex items-center p-3 hover:bg-[#374991]">
            <Link to={item.link} className="flex items-center gap-3">
                {item.icon}
                <span className="hover:translate-x-2 duration-300">{item.title}</span>
            </Link>
        </li>
        ))
        }
                <li onClick={()=>dispatcher(logout())} className="flex cursor-pointer items-center p-3 hover:bg-[#374991]">
            <div className="flex items-center gap-3">
                <BiLogOutCircle />
                <span className="hover:translate-x-2 duration-300">Logout</span>
            </div>
        </li>

    </ul>
    </div>
    );
}
