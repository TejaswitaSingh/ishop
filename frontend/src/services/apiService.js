import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';
const USER_URL = '/user';
const ORDER_URL = '/order';

class ApiService {
  // User related APIs
  static async loginUser(credentials) {
    return axios.post(`${API_BASE_URL}${USER_URL}/login`, credentials);
  }

  static async registerUser(userData) {
    return axios.post(`${API_BASE_URL}${USER_URL}/register`, userData);
  }

  static async moveCartToDB(userId, cartData) {
    return axios.post(`${API_BASE_URL}${USER_URL}/move-to-db/${userId}`, { cartData });
  }

  static async getCartFromDB(userId) {
    return axios.get(`${API_BASE_URL}${USER_URL}/get-cart/${userId}`);
  }

  static async addToCartDB(userId, productId) {
    return axios.post(`${API_BASE_URL}${USER_URL}/add-to-cart`, {
      userId,
      productId
    });
  }

  static async updateCartQty({ userId, productId, qty }) {
    return axios.patch(`${API_BASE_URL}${USER_URL}/update-cart-qty`, {
      userId,
      productId,
      qty
    });
  }

  static async removeFromCart(userId, productId) {
    return axios.delete(`${API_BASE_URL}${USER_URL}/remove-from-cart/${userId}/${productId}`);
  }

  // Product related APIs
  static async getProducts() {
    return axios.get(`${API_BASE_URL}/product`);
  }

  static async getProductById(id) {
    return axios.get(`${API_BASE_URL}/product/${id}`);
  }

  // Category related APIs
  static async getCategories() {
    return axios.get(`${API_BASE_URL}/category`);
  }

  // Order related APIs
  static async placeOrder(orderData) {
    return axios.post(`${API_BASE_URL}${ORDER_URL}/place_order`, orderData);
  }

  static async getOrderHistory(userId) {
    return axios.get(`${API_BASE_URL}${ORDER_URL}/history/${userId}`);
  }

  static async getOrderDetails(orderId) {
    return axios.get(`${API_BASE_URL}${ORDER_URL}/${orderId}`);
  }

  // Add more API methods as needed
}

export default ApiService; 