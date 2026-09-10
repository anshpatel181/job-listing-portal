import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { applyToJob, checkApplied } from "../services/applicationService";
import { toast } from "react-toastify";
import FullScreenLoader from "../components/loaders/FullScreenLoader";
import { JobCard } from "../components/JobCard";
import { useCallback } from "react";
import { FaAlignLeft, FaArrowLeft } from "react-icons/fa";

export const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [loadingApply, setLoadingApply] = useState(false);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/jobs/${id}`);
        const data = await res.json();

        if (!res.ok) {
          toast.error("Job not found");
        }

        setJob(data);
      } catch (error) {
        toast.error("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const verifyApplied = async () => {
      try {
        const res = await checkApplied(id);
        if (res.applied) setApplied(true);
      } catch (err) {
        console.error(err);
      }
    };

    verifyApplied();
  }, [id]);
  
  const handleApply = useCallback(async () => {
    try {
      setLoadingApply(true);
      await applyToJob(job._id);
      setApplied(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingApply(false);
    }
  }, [job]);

  if (!job) {
    return (
      <p className="text-center mt-20 text-slate-500">
        Job not found
      </p>
    );
  }

  if (loading) {
    return <FullScreenLoader />
  }

  return (
    <>
      <DashboardNavbar />

      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">

          <NavLink
            to="/jobs"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <FaArrowLeft className="w-3 h-3" /> Back to Jobs
          </NavLink>

          <JobCard job={job} applied={applied} handleApply={handleApply} loadingApply={loadingApply} />
        </div>
      </div>
    </>
  );
};
