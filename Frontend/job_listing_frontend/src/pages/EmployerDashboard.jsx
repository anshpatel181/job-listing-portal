import { NavLink } from "react-router-dom";
import { FaBriefcase, FaPlusCircle, FaBuilding } from "react-icons/fa";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { useState, useEffect } from "react";
import InlineLoader from "../components/loaders/InlineLoader";

export const EmployerDashboard = () => {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/applications/employer/stats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <DashboardNavbar />

      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome back 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your hiring activity and job postings
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {isLoading ? (
              <div className="col-span-3">
                <InlineLoader />
              </div>
            ) : (
              [
                {
                  label: "Active Jobs",
                  value: stats.totalJobs || 0,
                  color: "text-blue-600",
                },
                {
                  label: "Total Applications",
                  value: stats.totalApplications || 0,
                  color: "text-indigo-600",
                },
                {
                  label: "Jobs Expiring Soon",
                  value: "1",
                  color: "text-amber-600",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-xl p-6
                             shadow-sm hover:shadow-md transition"
                >
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <h3 className={`text-3xl font-bold mt-2 ${stat.color}`}>
                    {stat.value}
                  </h3>
                </div>
              ))
            )}

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <NavLink
              to="/employer/jobs/new"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                         rounded-xl p-6
                         shadow-lg hover:shadow-xl hover:-translate-y-1
                         transition-all duration-300"
            >
              <FaPlusCircle className="text-4xl mb-4 opacity-90" />
              <h2 className="text-lg font-semibold mb-1">
                Post a Job
              </h2>
              <p className="text-sm text-blue-100">
                Create a new job listing and reach candidates
              </p>
            </NavLink>

            <NavLink
              to="/employer/jobs"
              className="bg-white border border-slate-200 rounded-xl p-6
                         shadow-sm hover:shadow-lg hover:-translate-y-1
                         hover:border-blue-500 transition-all duration-300"
            >
              <FaBriefcase className="text-3xl text-blue-600 mb-4" />
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Manage Jobs
              </h2>
              <p className="text-sm text-slate-500">
                View, edit, or delete your job postings
              </p>
            </NavLink>

            <NavLink
              to="/employer/profile"
              className="bg-white border border-slate-200 rounded-xl p-6
                         shadow-sm hover:shadow-lg hover:-translate-y-1
                         hover:border-indigo-500 transition-all duration-300"
            >
              <FaBuilding className="text-3xl text-indigo-600 mb-4" />
              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                Company Profile
              </h2>
              <p className="text-sm text-slate-500">
                View and update your company information
              </p>
            </NavLink>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <p className="text-slate-600 text-sm">
              💡 Tip: Job posts with clear responsibilities and salary ranges
              receive up to{" "}
              <span className="font-semibold text-slate-800">
                40% more applications
              </span>.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};