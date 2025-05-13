import React, { useContext, useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaCartShopping } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducers/userSlice";
import { emptyCart } from "../../redux/reducers/cartSlice";
import ApiService from "../../services/apiService";
import { MainContext } from "../../Context";
import SearchBar from "./SearchBar";
import { debounce } from "lodash"; // Import lodash debounce function

const Header = () => {
  const cart = useSelector((state) => state.cart.data);
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product } = useContext(MainContext);

  const logoutHandler = async () => {
    dispatch(logout());
    dispatch(emptyCart());

    localStorage.removeItem("user-data");
    localStorage.removeItem("cart-data");
    localStorage.removeItem("cart-total");
    localStorage.removeItem("original-total");

    navigate("/");
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Debounced search effect
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = product.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query, product]);

  const handleSearchChange = debounce((e) => {
    setQuery(e.target.value);
  }, 500); // Debounce time of 500ms

  return (
    <header className="w-full">
      <div className="flex">
        <div className="h-10 m-auto">
          <div className="flex w-48 justify-around my-auto h-full">
            <div className="flex items-center gap-2 text-black text-sm">
              EN <IoMdArrowDropdown />
            </div>
            <div className="flex items-center gap-2 text-black text-sm">
              $ <IoMdArrowDropdown />
            </div>
          </div>
        </div>

        <div className="flex items-center border border-slate-300 rounded-lg w-64 h-10 px-2 m-2">
          <input
            className="w-full h-full outline-none bg-transparent"
            type="text"
            placeholder="Search..."
          />
          <FaSearch className="text-slate-500" />
        </div>

        <div className="h-10 m-auto">
          <div className="flex justify-around my-auto h-full w-96">
            <div className="flex items-center gap-2 text-black text-sm">
              <CgProfile className="text-xl" />
              Hi {user ? user.name : "Guest"}
            </div>

            <div>
              {!user ? (
                <Link to="/login?ref=header">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                      font-medium rounded-lg text-sm px-5 py-1.5 mt-1 focus:outline-none 
                      dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition"
                  >
                    Log-In
                  </button>
                </Link>
              ) : (
                <button
                  onClick={logoutHandler}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                    font-medium rounded-lg text-sm px-5 py-1.5 mt-1 focus:outline-none 
                    dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition"
                >
                  Log-Out
                </button>
              )}
            </div>

            <Link to="/cart" className="mt-2.5">
              <div className="flex items-center gap-2 text-black text-sm">
                <FaCartShopping className="text-lg" />
                <span className="text-[red] font-bold">{cart.length}</span>{" "}
                Items
              </div>
            </Link>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              ₹20000
            </div>
          </div>
        </div>
      </div>

      <div className="h-[0.5px] bg-slate-300 w-full"></div>

      <div className="bg-white w-full h-36">
        <div className="flex justify-center pt-11 text-[#FF4252] text-[32px] font-bold">
          iSHOP
        </div>
        <nav>
          <ul className="text-sm font-medium flex justify-center gap-8 pt-3 text-[#22262A]">
            <li className="hover:text-sky-500">
              <Link className="hover:underline hover:decoration-sky-500" to="/">
                HOME
              </Link>
            </li>
            <li className="hover:text-sky-500">
              <Link
                className="hover:underline hover:decoration-sky-500"
                to="/store"
              >
                STORE
              </Link>
            </li>
            <li className="hover:text-sky-500">
              <Link className="hover:underline hover:decoration-sky-500" to="#">
                IPHONE
              </Link>
            </li>
            <li className="hover:text-sky-500">
              <Link className="hover:underline hover:decoration-sky-500" to="#">
                IPAD
              </Link>
            </li>
            <li className="hover:text-sky-500">
              <Link className="hover:underline hover:decoration-sky-500" to="#">
                MACBOOK
              </Link>
            </li>
            <li className="hover:text-sky-500">
              <Link className="hover:underline hover:decoration-sky-500" to="#">
                ACCESSORIES
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
