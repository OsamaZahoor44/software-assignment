import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL

export const signupUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error during signup');
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error during login');
  }
};
