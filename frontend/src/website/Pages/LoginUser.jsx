import React, { useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MainContext } from '../../Context';
import { login } from '../../redux/reducers/userSlice';
import { dbToCart } from '../../redux/reducers/cartSlice';
import ApiService from '../../services/apiService';

function LoginUser() {
  const { notify } = useContext(MainContext);
  const [searchParams] = useSearchParams();
  const navigator = useNavigate();
  const dispatcher = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await ApiService.loginUser(formData);
        
        if (response.data.status === 1) {
          e.target.reset();
          setFormData({
            password: '',
            email: '',
          });
          setErrors({});

          dispatcher(login({
            data: response.data.user,
            token: response.data.token
          }));

          // Get local cart data
          const localCart = JSON.parse(localStorage.getItem("cart-data")) || [];
          
          // If there are items in local cart, merge them with DB cart
          if (localCart.length > 0) {
            // First, send local cart to DB
            const moveToDbResponse = await ApiService.moveCartToDB(response?.data?.user._id,localCart); 
            

            if (moveToDbResponse.data.status === 1) {
              console.log("✅ Local cart merged with DB cart");
            } else {
              console.error("❌ Failed to merge local cart with DB cart");
            }
          }
          
          // Then fetch the merged cart from DB
          const resp = await ApiService.getCartFromDB(response.data.user._id);
          const latestCart = resp.data.dbCartData;

          if (Array.isArray(latestCart)) {
            
            let original_total = 0;
            let final_total = 0;

            const data = latestCart.map((lc) => {
              original_total += lc.product_id.originalPrice * lc.qty;
              final_total += lc.product_id.finalPrice * lc.qty;
              return {
                productId: lc.product_id._id,
                qty: lc.qty,
                finalPrice: lc.product_id.finalPrice,
                originalPrice: lc.product_id.originalPrice
              };
            });

            dispatcher(dbToCart({
              data,
              total: final_total,
              original_total: original_total
            }));

            // Update localStorage with merged cart
            localStorage.setItem("cart-data", JSON.stringify(data));
            localStorage.setItem("cart-total", JSON.stringify(final_total));
            localStorage.setItem("original-total", JSON.stringify(original_total));
            
          } else {
            console.error("❌ Invalid cart data received from DB:", latestCart);
            notify("Failed to fetch merged cart. Please try again.", 0);
          }
        }

        notify(response.data.msg, response.data.status);
      } catch (error) {
        console.log(error);
        notify("An error occurred during login. Please try again.", 0);
      }
    }
  };

  useEffect(() => {
    if (user && user.token) {
      if (searchParams.get("ref") === "checkout") {
        navigator("/checkout");
      } else {
        navigator("/");
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to={`/register?${searchParams.toString()}`} className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginUser;
