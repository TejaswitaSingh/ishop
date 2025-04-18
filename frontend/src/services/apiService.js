import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';
const USER_URL = '/user';

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

  // Add more API methods as needed
}

export default ApiService; 