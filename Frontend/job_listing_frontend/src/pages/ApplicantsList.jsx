import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DashboardNavbar } from "../components/DashboardNavbar";
import InlineLoader from "../components/loaders/InlineLoader";
import EmptyState from "../components/common/EmptyState";
import { FaUsers } from "react-icons/fa";

export const ApplicantsList = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/api/applications/job/${jobId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.message || "Failed to fetch applicants");
                }

                setApplications(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId]);

    const updateStatus = async (applicationId, status) => {
        try {
            setActionLoadingId(applicationId);

            const res = await fetch(
                `${BASE_URL}/api/applications/${applicationId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            if (!res.ok) {
                toast.error("Failed to update status");
                return;
            }

            setApplications((prev) =>
                prev.map((app) =>
                    app._id === applicationId ? { ...app, status } : app
                )
            );
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <>
            <DashboardNavbar />

            <div className="min-h-screen bg-slate-100 p-6">
                <div className="max-w-5xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold text-slate-800">
                        Job Applicants
                    </h1>

                    <div className="space-y-4">

                        {loading ? (
                            <InlineLoader />
                        ) : applications.length === 0 ? (
                            <div className="bg-white border rounded-xl p-8 text-center">
                                <EmptyState
                                    icon={<FaUsers />}
                                    title="No applicants yet"
                                    description="Share your job post to attract candidates."
                                />
                            </div>
                        ) : (
                            applications.map((app) => (
                                <div
                                    key={app._id}
                                    className="bg-white border border-slate-200 rounded-xl p-6
                             shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h2 className="font-semibold text-slate-800">
                                                {app.seeker.name}
                                            </h2>
                                            <p className="text-sm text-slate-600 break-all">
                                                {app.seeker.email}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Applied on {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

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
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <button
                                            onClick={() =>
                                                updateStatus(app._id, "shortlisted")
                                            }
                                            disabled={
                                                app.status !== "applied" ||
                                                actionLoadingId === app._id
                                            }
                                            className="px-3 py-1 text-xs rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                                        >
                                            {actionLoadingId === app._id ? (
                                                <InlineLoader />
                                            ) : (
                                                "Shortlist"
                                            )}
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateStatus(app._id, "rejected")
                                            }
                                            disabled={
                                                app.status !== "applied" ||
                                                actionLoadingId === app._id
                                            }
                                            className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                                        >
                                            {actionLoadingId === app._id ? (
                                                <InlineLoader />
                                            ) : (
                                                "Reject"
                                            )}
                                        </button>
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