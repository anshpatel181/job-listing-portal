const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/users';

export const toggleSaveJob = async (jobId) => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/save-job/${jobId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if(!res.ok) {
    throw new Error(data.message || "Failed to Save job")
  }
  
  return data;
};

export const getSavedJobs = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
  `${BASE_URL}/saved-jobs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return res.json();
};
