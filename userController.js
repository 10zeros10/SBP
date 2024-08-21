import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BASE_API_URL;
const CACHE_EXPIRY = 5 * 60 * 1000; // Cache expiry set to 5 minutes

const headers = {
  'Content-Type': 'application/json',
};

const cache = {
  userDetails: {},
};

const cacheUtilities = {
  isCacheValid(userId) {
    const now = new Date().getTime();
    return cache.userDetails[userId] && cache.userDetails[userId].expiry > now;
  },
  updateCache(userId, data) {
    const now = new Date().getTime();
    cache.userDetails[userId] = { data: data, expiry: now + CACHE_EXPIRY };
  },
  clearCache() {
    cache.userDetails = {};
  },
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
      cacheUtilities.clearCache();
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async fetchUserDetails(userId) {
    if (cacheUtilities.isCacheValid(userId)) {
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
      cacheUtilities.updateCache(userId, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },

  async fetchMultipleUserDetails(userIds) {
    const userDetails = {};
    const now = new Date().getTime();
    const fetchQueue = userIds.filter(id => !cache.userDetails[id] || cache.userDetails[id].expiry < now);

    if (fetchQueue.length === 0) {
      userIds.forEach(id => userDetails[id] = cache.userDetails[id].data);
      return userDetails;
    }

    try {
      const userToken = localStorage.getItem('userToken');
      const authHeaders = { ...headers, 'Authorization': `Bearer ${userToken}` };
      const response = await axios.post(`${BASE_URL}/users/details`, { userIds: fetchQueue }, { headers: authHeaders });

      response.data.forEach(userDetail => {
        cacheUtilities.updateCache(userDetail.userId, userDetail);
        userDetails[userDetail.userId] = userDetail;
      });

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