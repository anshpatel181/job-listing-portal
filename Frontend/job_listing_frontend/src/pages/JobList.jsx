import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { searchJobs } from "../services/jobService";
import { getSavedJobs, toggleSaveJob } from "../services/userService";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { toast } from "react-toastify";
import InlineLoader from "../components/loaders/InlineLoader";
import EmptyState from "../components/common/EmptyState";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns";

export const JobList = () => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient()

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const urlJobKeyword = searchParams.get("keyword") || "";
  const urlJobLocation = searchParams.get("location") || "";
  const urlJobType = searchParams.get("jobType") || "all";

  useEffect(() => {
    const keywordTimer = setTimeout(() => {
      setDebouncedKeyword(keyword);

      if (urlJobKeyword !== keyword) {
        setSearchParams({ page: currentPage, keyword, location: urlJobLocation, jobType: urlJobType })
      }
    }, 1000);

    return () => clearTimeout(keywordTimer);
  }, [keyword]);

  useEffect(() => {
    const locationTimer = setTimeout(() => {

      setDebouncedLocation(location)
      
      if (urlJobLocation !== location) {
        setSearchParams({ page: currentPage, keyword: urlJobKeyword, location, jobType: urlJobType })
      }
    }, 1000)

    return () => clearTimeout(locationTimer)
  }, [location])

  const {data, isPending, isError, error} = useQuery({
    queryKey: ["jobs", debouncedKeyword, debouncedLocation, jobType, urlJobType, currentPage],
    queryFn: () => searchJobs({ keyword: debouncedKeyword, location: debouncedLocation, type: jobType, limit: 5, currentPage }),
  })

  if(isError) {
    toast.error("Failed to load jobs")
    console.log(error);
  }

  const {data: savedJobs, isPending: savedPending, isError: savedError} = useQuery({
    queryKey: ["savedJobs"],
    queryFn: getSavedJobs,
    select: (data) => data.map((job) => job._id)
  })

  const isJobSaved = (jobId) => savedJobs?.includes(jobId)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= data.totalPages) {
      setSearchParams({ page: newPage, keyword: urlJobKeyword, location: urlJobLocation, type: urlJobType })
    }
  }

  const handleJobTypeChange = (e) => {
    setJobType(e.target.value)
    setSearchParams({page: currentPage, keyword: urlJobKeyword, location: urlJobLocation, jobType: e.target.value})
  }

  const saveJobMutation = useMutation({
    mutationFn: (jobId) => toggleSaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["savedJobs"]})
    },
    onError: () => {
      toast.error("Failed to Save Job")
    }
  })

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-8">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Find Your Next Job
            </h1>
            <p className="text-slate-500 mt-1">
              Search and filter jobs that match your skills and goals
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="🔍 Keyword (e.g. React)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="📍 Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={jobType}
                onChange={handleJobTypeChange}
                className="border border-slate-300 rounded-lg px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>

              <button
                onClick={() => {
                  setKeyword("");
                  setLocation("");
                  setJobType("");
                }}
                className="border border-slate-300 rounded-lg px-4 py-2 text-sm
                           hover:bg-slate-50 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Showing <span className="font-medium">{data?.jobs.length || 0} </span>
            job{data?.jobs.length !== 1 && "s"}
          </p>

          <div className="space-y-5">
            {isPending ? (<InlineLoader />) : data?.jobs.length > 0 ? (
              data?.jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6
                             shadow-sm hover:shadow-md hover:-translate-y-0.5
                             transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-6">

                    <div className="space-y-2 max-w-3xl">
                      <h2 className="text-xl font-semibold text-slate-800">
                        {job.jobTitle}
                      </h2>

                      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        <span>📍 {job.jobLoc}</span>
                        <span>💼 {job.jobType}</span>
                        <span>💰 ₹{job.minSalary} – ₹{job.maxSalary}</span>
                      </div>

                      <p className="text-slate-600 text-sm line-clamp-2">
                        Posted {formatDistanceToNow(new Date(job.createdAt), {addSuffix: true} )}
                      </p>
                    </div>

                    <div className="flex lg:flex-col justify-between lg:items-end gap-4">
                      <NavLink
                        to={`/jobs/${job._id}`}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg
                                   hover:bg-blue-700 transition text-sm font-medium"
                      >
                        View Details
                      </NavLink>

                      <button
                        onClick={() => saveJobMutation.mutate(job._id)}
                        className={`text-sm font-medium transition ${isJobSaved(job._id) ? "text-red-500" : "text-slate-500 hover:text-blue-600"}
                       ` }
                      >
                        ❤️ {isJobSaved(job._id) ? "Saved" : "Save"} 
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
              : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">
                    <EmptyState
                      icon={<FaSearch />}
                      title="No jobs match your search"
                      description="Try adjusting your filters or searching with different keywords."
                      actionText="Clear Filters"
                      actionLink="/jobs"
                    />
                  </h2>
                  <p className="text-slate-500">
                    Try adjusting your search filters or keywords
                  </p>
                </div>
              )}
          </div>
          {
            data?.jobs.length > 0 && !isPending && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className={` border-2 px-4 py-2 inline-flex items-center gap-1 transition rounded ${currentPage <= 1 ? "bg-slate-300 text-slate-500 cursor-not-allowed border-transparent" : "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 cursor-pointer shadow-sm"}`}> <FaArrowLeft className="w-3 h-3" /> Prev</button>
                <p className="text-slate-600 font-medium px-4">Page {currentPage} of {data.totalPages}</p>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= data.totalPages} className={`border-2 px-4 py-2 inline-flex items-center gap-1 transition rounded ${currentPage >= data.totalPages ? "bg-slate-300 text-slate-500 cursor-not-allowed border-transparent" : "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 cursor-pointer shadow-sm"}`}>Next <FaArrowRight className="w-3 h-3" /> </button>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
};
