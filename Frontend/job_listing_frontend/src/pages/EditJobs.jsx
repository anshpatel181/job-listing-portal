import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyJobs, updateJob } from "../services/jobService";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { toast } from "react-toastify";
import FullScreenLoader from "../components/loaders/FullScreenLoader";

export const EditJobs = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false);

    const [jobInput, setJobInput] = useState({
        jobTitle: "",
        jobDesc: "",
        jobRes: "",
        jobQual: "",
        jobLoc: "",
        minSalary: "",
        maxSalary: "",
        jobType: "",
    });

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const jobs = await getMyJobs();                
                const job = jobs.jobs.find((j) => j._id.toString() === id.toString());
                
                if (!job) {
                    toast.error("Job not found");
                    navigate("/employer/jobs");
                    return;
                }

                setJobInput({
                    jobTitle: job.jobTitle || "",
                    jobDesc: job.jobDesc || "",
                    jobRes: job.jobRes || "",
                    jobQual: job.jobQual || "",
                    jobLoc: job.jobLoc || "",
                    minSalary: job.minSalary || "",
                    maxSalary: job.maxSalary || "",
                    jobType: job.jobType || "",
                });
            } catch (error) {
                toast.error("Failed to load job");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id, navigate]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const {
        jobTitle,
        jobDesc,
        jobRes,
        jobQual,
        jobLoc,
        minSalary,
        maxSalary,
        jobType,
    } = jobInput;

    const isSalaryInvalid =
        minSalary && maxSalary && Number(minSalary) > Number(maxSalary);

    const isFormValid =
        jobTitle &&
        jobDesc &&
        jobRes &&
        jobQual &&
        jobLoc &&
        minSalary &&
        maxSalary &&
        jobType &&
        !isSalaryInvalid;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateJob(id, jobInput);
            navigate("/employer/jobs");
        } catch (error) {
            toast.error("Failed to update job");
        } finally {
            setSaving(false);
        }
    };


    const inputClass =
        "w-full border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500";

    if (loading) {
        return <FullScreenLoader />;
    }

    return (
        <div>
            <DashboardNavbar />
            <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
                <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">

                    <p className="text-sm text-slate-500 mb-2">
                        Employer / Jobs / Edit
                    </p>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">
                            Edit Job Listing
                        </h1>
                        <p className="text-sm text-slate-500">
                            Update the details below and save changes
                        </p>
                    </div>

                    {success && (
                        <div className="mb-6 bg-green-100 text-green-700 p-3 rounded-lg text-sm">
                            Job updated successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <section>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Job Details
                            </h2>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium mb-1">
                                    Job Title
                                </label>
                                <input
                                    className={inputClass}
                                    name="jobTitle"
                                    value={jobTitle}
                                    onChange={handleInputChange}
                                    placeholder="Job Title"
                                    required
                                />

                                <label className="block text-sm font-medium mb-1">
                                    Job Description
                                </label>
                                <textarea
                                    rows="4"
                                    className={inputClass}
                                    name="jobDesc"
                                    value={jobDesc}
                                    onChange={handleInputChange}
                                    placeholder="Job Description"
                                    required
                                    maxLength={500}
                                />

                                <p className="text-xs text-slate-500 text-right">
                                    {jobDesc.length}/500
                                </p>

                                <label className="block text-sm font-medium mb-1">
                                    Location
                                </label>
                                <input
                                    className={inputClass}
                                    name="jobLoc"
                                    value={jobLoc}
                                    onChange={handleInputChange}
                                    placeholder="Location"
                                    required
                                />

                                <label className="block text-sm font-medium mb-1">
                                    Job Type
                                </label>
                                <select
                                    value={jobType}
                                    onChange={handleInputChange}
                                    name="jobType"
                                    className="border border-slate-300 rounded-lg px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Job Types</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Requirements
                            </h2>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium mb-1">
                                    Responsibilities
                                </label>
                                <textarea
                                    rows="3"
                                    className={inputClass}
                                    name="jobRes"
                                    value={jobRes}
                                    onChange={handleInputChange}
                                    placeholder="Responsibilities"
                                    required
                                />

                                <label className="block text-sm font-medium mb-1">
                                    Qualifications
                                </label>
                                <textarea
                                    rows="3"
                                    className={inputClass}
                                    name="jobQual"
                                    value={jobQual}
                                    onChange={handleInputChange}
                                    placeholder="Qualifications"
                                    required
                                />
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Compensation
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <label className="block text-sm font-medium mb-1">
                                    Minimum Salary
                                </label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    name="minSalary"
                                    value={minSalary}
                                    onChange={handleInputChange}
                                    placeholder="Minimum Salary"
                                    required
                                />

                                <label className="block text-sm font-medium mb-1">
                                    Maximum Salary
                                </label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    name="maxSalary"
                                    value={maxSalary}
                                    onChange={handleInputChange}
                                    placeholder="Maximum Salary"
                                    required
                                />
                            </div>

                            {isSalaryInvalid && (
                                <p className="text-sm text-red-600 mt-2">
                                    Minimum salary cannot exceed maximum salary
                                </p>
                            )}
                        </section>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving && !isFormValid}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all
                ${isFormValid
                                        ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95"
                                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                    }`}
                            >
                                {saving ? "Updating..." : "Update Job"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
