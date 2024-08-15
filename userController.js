import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.BASE_API_URL;
const headers = {
  'Content-Type': 'application/json',
};
const userManagement = {
  async register(userData) {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData, { headers });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  async login(credentials) {
    try {
      const response = await axios.post(`${BASE_URL}/login`, credentials, { headers });
      localStorage.setItem('userToken', response.data.token); 
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  async fetchUserDetails(userId) {
    try {
      const userToken = localStorage.getItem('userToken'); 
      const authHeaders = {
        ...headers,
        'Authorization': `Bearer ${userToken}`,
      };
      const response = await axios.get(`${BASE_URL}/user/${userId}`, { headers: authHeaders });
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },
};
export default userManagement;