// const API_URL = "http://localhost:5000/api/jobs";
const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/jobs';

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createJob = async (jobData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData),
  });

  if (!res.ok) {
    throw new Error("Failed to create job");
  }

  return res.json();
};

export const getMyJobs = async () => {
  const res = await fetch(`${BASE_URL}/my`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
};

export const updateJob = async (jobId, jobData) => {
  const res = await fetch(`${BASE_URL}/${jobId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData),
  });

  if (!res.ok) {
    throw new Error("Failed to update job");
  }

  return res.json();
};

export const deleteJob = async (jobId) => {
  const res = await fetch(`${BASE_URL}/${jobId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to delete job");
  }

  return res.json();
};

export const searchJobs = async (filters) => {
  const params = new URLSearchParams(filters);

  const res = await fetch(
    `${BASE_URL}?${params.toString()}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch jobs");
  }

  return data;
};

export const toggleJobStatus = async (id) => {
  const res = await fetch(
    `${BASE_URL}/${id}/status`,
    {
      method: "PATCH",
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) {
    throw new Error("Failed to toggle job status");
  }

  return res.json();
};
