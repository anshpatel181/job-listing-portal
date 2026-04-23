import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { toast } from "react-toastify";
import InlineLoader from "../components/loaders/InlineLoader";

export const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/applications/my",
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
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <>
      <DashboardNavbar />

      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Applied Jobs
            </h1>
            <p className="text-sm text-slate-500">
              Track the jobs you've applied for
            </p>
          </div>

          <div className="space-y-4">

            {loading ? (
              <InlineLoader />
            ) : applications.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">
                  No applications yet
                </h2>
                <p className="text-slate-500 mb-4">
                  Start applying to jobs to see them here
                </p>

                <NavLink
                  to="/jobs"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Jobs
                </NavLink>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white border border-slate-200 rounded-xl p-6
                             shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    <div>
                      <h2 className="text-lg font-semibold text-slate-800">
                        {app.job?.jobTitle}
                      </h2>

                      <p className="text-sm text-slate-600 mt-1">
                        📍 {app.job?.jobLoc} • 💼 {app.job?.jobType}
                      </p>

                      <p className="text-sm text-slate-500">
                        💰 ₹{app.job?.minSalary} – ₹{app.job?.maxSalary}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Applied on{" "}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${app.status === "applied"
                            ? "bg-blue-100 text-blue-700"
                            : app.status === "shortlisted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {app.status.toUpperCase()}
                      </span>

                      <NavLink
                        to={`/jobs/${app.job?._id}`}
                        className="text-blue-600 text-sm font-medium hover:underline"
                      >
                        View Job
                      </NavLink>
                    </div>

                  </div>
                </div>
              ))
            )}

          </div>

        </div>
      </div>
    </>
  );
};
