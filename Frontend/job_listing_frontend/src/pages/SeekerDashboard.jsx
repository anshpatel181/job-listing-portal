import { NavLink } from "react-router-dom";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { useEffect, useState } from "react";
import { searchJobs } from "../services/jobService";
import { getSavedJobs } from "../services/userService";

export const SeekerDashboard = () => {

  const [allJobs, setAllJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL

  const profileCompletion = 70;

  const stats = {
    applications: 5,
    savedJobs: 3,
    profileViews: 12,
  };

  useEffect(() => {
    const fetchAllJobs = async () => {
      const res = await searchJobs();
      setAllJobs(res.jobs);
    }

    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/applications/my`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error("Failed to fetch applications");
        }

        setApplications(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchApplications();

    const fetchSavedJobs = async () => {
      try {
        const res = await getSavedJobs();
        setSavedJobs(res || []);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        setJobs([]);
      }
    };

    fetchSavedJobs();

    fetchAllJobs();
  }, []);

  return (
    <>
      <DashboardNavbar />

      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Welcome back 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Track your progress and discover new opportunities
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-slate-800">
                Profile Completion
              </h2>
              <span className="text-sm font-medium text-blue-600">
                {profileCompletion}%
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-slate-500">
                Complete your profile to improve job matches
              </p>
              <NavLink
                to="/seeker/profile"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Update Profile →
              </NavLink>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
              <h3 className="text-3xl font-bold text-blue-600">
                {applications.length}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Applications Sent
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
              <h3 className="text-3xl font-bold text-green-600">
                {savedJobs.length}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Saved Jobs
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition">
              <h3 className="text-3xl font-bold text-purple-600">
                {stats.profileViews}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Profile Views
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4">
              Recommended Jobs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {allJobs.slice(0, 6).map((job, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl p-5
                             hover:shadow-md hover:-translate-y-1
                             transition-all"
                >
                  <div className="space-y-2 max-w-3xl">
                    <h2 className="text-xl font-semibold text-slate-800">
                      {job.jobTitle}
                    </h2>

                    <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                      <span>📍 {job.jobLoc}</span>
                      <span>💼 {job.jobType}</span>
                      <span>💰 ₹{job.minSalary} – ₹{job.maxSalary}</span>
                    </div>
                  </div>

                  <NavLink
                    to={`/jobs/${job._id}`}
                    className="inline-block mt-4 text-sm font-medium
                               text-blue-600 hover:underline"
                  >
                    View Job →
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <NavLink to={"/jobs"} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              View more jobs
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};
