import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_API_URL;
const headers = {
  'Content-Type': 'application/json',
};

// Enhanced caching object with expiry
const cache = {
  userDetails: {},
};

const CACHE_EXPIRY = 5 * 60 * 1000; // Cache expiry set to 5 minutes

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
    // Check cache first including expiry
    const now = new Date().getTime();
    if (cache.userDetails[userId] && cache.userDetails[userId].expiry > now) {
      console.log('Returning cached user details for userId:', userId);
      return cache.userDetails[userId].data;
    }

    try {
      const userToken = localStorage.getItem('userToken');
      const authHeaders = {
        ...headers,
        'Authorization': `Bearer ${userToken}`,
      };
      const response = await axios.get(`${BASE_URL}/user/${userId}`, { headers: authHeaders });
      // Store in cache with expiry
      cache.userDetails[userId] = { data: response.data, expiry: now + CACHE_EXPIRY };
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },

  // Pseudocode for batch fetching users, assuming the API supports it
  async fetchMultipleUserDetails(userIds) {
    const userDetails = {};
    const fetchQueue = userIds.filter(id => !cache.userDetails[id] || cache.userDetails[id].expiry < new Date().getTime());

    if (fetchQueue.length === 0) {
      userIds.forEach(id => {
        userDetails[id] = cache.userDetails[id].data;
      });
      return userDetails;
    }

    try {
      const userToken = localStorage.getItem('userToken');
      const authHeaders = { ...headers, 'Authorization': `Bearer ${userToken}` };
      // Assuming the API supports fetching details of multiple users in one request
      const response = await axios.post(`${BASE_URL}/users/details`, { userIds: fetchQueue }, { headers: authHeaders });

      // Update cache and compile results
      const now = new Date().getTime();
      response.data.forEach(userDetail => {
        cache.userDetails[userDetail.userId] = { data: userDetail, expiry: now + CACHE_EXPIRY };
        userDetails[userDetail.userId] = userDetail;
      });

      // Fill in details from cache for those not in fetchQueue
      userIds.filter(id => !fetchQueue.includes(id)).forEach(id => {
        userDetails[id] = cache.userDetails[id].data;
      });

      return userDetails;
    } catch (error) {
      console.error('Error fetching multiple user details:', error);
      throw error;
    }
  },
};

export default userManagement;