const fetch = require('node-fetch');
require('dotenv').config();

const BASE_URL = process.env.BLOG_POSTS_API_URL;

const createPost = async (postBody) => {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
  }
};

const readPosts = async (postId = '') => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error reading posts:', error);
  }
};

const updatePost = async (postId, updateBody) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateBody),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating post:', error);
  }
};

const deletePost = async (postId) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

module.exports = {
  createPost,
  readPosts,
  updatePost,
  deletePost,
};