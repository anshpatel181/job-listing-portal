const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/auth';

export const registerUser = async (userData) => {
  console.log("userData", userData);
  
  console.log(BASE_URL);
  
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  console.log("Response", response);
  

  return response.json();
};

export const loginUser = async (loginData) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  return response.json();
};
