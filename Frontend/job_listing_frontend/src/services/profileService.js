// const API_URL = "http://localhost:5000/api/profile";
const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/profile';

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getProfile = async () => {
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
};

export const updateProfile = async (profileData) => {
  const response = await fetch(BASE_URL, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
};
