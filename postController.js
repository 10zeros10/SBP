const fetch = require('node-fetch');
require('dotenv').config();

const BLOG_POSTS_API_BASE_URL = process.env.BLOG_POSTS_API_URL;

const doFetchRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    return await response.json(); 
  } catch (error) {
    console.error(`Error performing the request: ${error}`);
    throw error; 
  }
};

const createBlogPost = (postDetails) => {
  return doFetchRequest(`${BLOG_POSTS_API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postDetails),
  });
};

const fetchBlogPosts = (postId = '') => {
  return doFetchRequest(`${BLOG_POSTS_API_BASE_URL}/posts/${postId}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
};

const updateBlogPost = (postId, postUpdates) => {
  return doFetchRequest(`${BLOG_POSTS_API_BASE_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postUpdates),
  });
};

const deleteBlogPost = (postId) => {
  return doFetchRequest(`${BLOG_POSTS_API_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
  });
};

module.exports = {
  createBlogPost,
  fetchBlogPosts,
  updateBlogPost,
  deleteBlogPost,
};