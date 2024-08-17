import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_API_URL;
const headers = {
  'Content-Type': 'application/json',
};

// Adding a simple cache object
const cache = {
  userDetails: {},
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
      // Clear user details cache on login to ensure up-to-date data is fetched for newly logged-in user
      cache.userDetails = {};
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async fetchUserDetails(userId) {
    // Check cache first
    if (cache.userDetails[userId]) {
      console.log('Returning cached user details for userId:', userId);
      return cache.userDetails[userId];
    }

    try {
      const userToken = localStorage.getItem('userToken');
      const authHeaders = {
        ...headers,
        'Authorization': `Bearer ${userToken}`,
      };
      const response = await axios.get(`${BASE_URL}/user/${userId}`, { headers: authHeaders });
      // Store in cache
      cache.userDetails[userId] = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },
};

export default userManagement;