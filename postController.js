const fetch = require('node-fetch');
require('dotenv').config();

const BLOG_POSTS_API_BASE_URL = process.env.BLOG_POSTS_API_URL;

const createBlogPost = async (postDetails) => {
  try {
    const response = await fetch(`${BLOG_POSTS_API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postDetails),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating blog post:', error);
  }
};

const fetchBlogPosts = async (postId = '') => {
  try {
    const response = await fetch(`${BLOG_POSTS_API_BASE_URL}/posts/${postId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
};

const updateBlogPost = async (postId, postUpdates) => {
  try {
    const response = await fetch(`${BLOG_POSTS_API_BASE_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postUpdates),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating blog post:', error);
  }
};

const deleteBlogPost = async (postId) => {
  try {
    const response = await fetch(`${BLOG_POSTS_API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting blog post:', error);
  }
};

module.exports = {
  createBlogPost,
  fetchBlogPosts,
  updateBlogPost,
  deleteBlogPost,
};