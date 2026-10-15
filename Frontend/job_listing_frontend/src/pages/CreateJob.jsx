import { useState } from "react";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { createJob } from "../services/jobService";
import ButtonLoader from "../components/loaders/ButtonLoader";
import { toast } from "react-toastify";

export const CreateJob = () => {
    const [jobInput, setJobInput] = useState({
        jobTitle: "",
        jobDesc: "",
        jobRes: "",
        minJobQual: "",
        preferredJobQual: "",
        jobLoc: "",
        minSalary: "",
        maxSalary: "",
        jobType: "",
    });

    const [compensationType, setCompensationType] = useState("per month")

    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

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
        minJobQual,
        preferredJobQual,
        jobLoc,
        minSalary,
        maxSalary,
        jobType,
    } = jobInput;

    const isSalaryInvalid =
        minSalary && maxSalary && Number(minSalary) > Number(maxSalary);

    const isFormValid =
        jobTitle.length &&
        jobDesc &&
        jobRes &&
        minJobQual &&
        preferredJobQual &&
        jobLoc &&
        minSalary &&
        maxSalary &&
        jobType &&
        !isSalaryInvalid;

    const handlePublishJobSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const result = await createJob(jobInput);
        const data = await result.json()

        console.log(result)
        console.log(data)
        if (!result.ok) {
            toast.error("Failed to Create job")
        }

        else {
            toast.success("Job Posted Successfully")
        }
        setIsLoading(false)
        setJobInput({
            jobTitle: "",
            jobDesc: "",
            jobRes: "",
            minJobQual: "",
            preferredJobQual: "",
            jobLoc: "",
            minSalary: "",
            maxSalary: "",
            jobType: ""
        })
    }

    const inputClass =
        "w-full border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div>
            <DashboardNavbar />
            <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
                        <p className="text-sm text-slate-500 mb-2">
                            Employer / Jobs / Create
                        </p>

                        <div className="mb-8 border-b border-slate-200 pb-4">
                            <h1 className="text-2xl font-bold text-slate-800">
                                Post a New Job
                            </h1>
                            <p className="text-sm text-slate-500">
                                Fill in the details below to publish a job listing
                            </p>
                        </div>

                        {success && (
                            <div className="mb-6 bg-green-100 text-green-700 p-3 rounded-lg text-sm">
                                Job posted successfully!
                            </div>
                        )}

                        <form className="space-y-8" onSubmit={handlePublishJobSubmit}>
                            <section>
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                    Job Details
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Job Title
                                        </label>
                                        <input
                                            className={inputClass}
                                            placeholder="e.g. Frontend Developer"
                                            name="jobTitle"
                                            value={jobTitle}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            This title will be visible to job seekers
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Job Description
                                        </label>
                                        <textarea
                                            rows="4"
                                            className={inputClass}
                                            placeholder="Describe the role and expectations"
                                            name="jobDesc"
                                            value={jobDesc}
                                            onChange={handleInputChange}
                                            required
                                            maxLength={500}
                                        />
                                        <p className="text-xs text-slate-500 text-right">
                                            {jobDesc.length}/500
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Location
                                        </label>
                                        <input
                                            className={inputClass}
                                            placeholder="e.g. Remote / Bangalore"
                                            name="jobLoc"
                                            value={jobLoc}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Select Job Type</label>
                                        <select
                                            value={jobType}
                                            onChange={handleInputChange}
                                            name="jobType"
                                            className="border border-slate-300 rounded-lg px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500 ml-4"
                                        >
                                            <option value="">All Job Types</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                    Requirements
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Responsibilities
                                        </label>
                                        <textarea
                                            rows="3"
                                            className={inputClass}
                                            placeholder="List key responsibilities (use bullet points)"
                                            name="jobRes"
                                            value={jobRes}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Minimum Qualifications
                                        </label>
                                        <textarea
                                            rows="3"
                                            className={inputClass}
                                            placeholder="Required skills or experience"
                                            name="minJobQual"
                                            value={minJobQual}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Preferred Qualifications (optional)
                                        </label>
                                        <textarea
                                            rows="3"
                                            className={inputClass}
                                            placeholder="Preferred skills or experience"
                                            name="preferredJobQual"
                                            value={preferredJobQual}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                    Compensation <span className="text-sm text-gray-600/80">(Optional)</span>
                                    <select className="ml-2 text-[13px] font-normal border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500" value={compensationType} onChange={(e) => setCompensationType(e.target.value)}>
                                        <option value="per month">Per Month</option>
                                        <option value="per annum">Per Annum</option>
                                    </select>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Minimum Salary ({compensationType})
                                        </label>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            placeholder="e.g. 40000"
                                            name="minSalary"
                                            value={minSalary}
                                            onChange={handleInputChange}
                                            required
                                            min={0}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Maximum Salary ({compensationType})
                                        </label>
                                        <input
                                            type="number"
                                            className={inputClass}
                                            placeholder="e.g. 80000"
                                            name="maxSalary"
                                            value={maxSalary}
                                            onChange={handleInputChange}
                                            required
                                            min={0}
                                        />
                                    </div>
                                </div>

                                {isSalaryInvalid && (
                                    <p className="text-sm text-red-600 mt-2">
                                        Minimum salary cannot be greater than maximum salary
                                    </p>
                                )}
                            </section>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={!isFormValid || isLoading}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all
                ${isFormValid
                                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95"
                                            : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                        }`}
                                >
                                    {isLoading ? <ButtonLoader /> : "Publish Job"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hidden lg:block">
                        <h2 className="text-lg font-semibold text-slate-800 mb-2">
                            Job Preview
                        </h2>

                        <p className="text-sm text-slate-500 mb-4">
                            This is how your job will appear to job seekers
                        </p>

                        <div className="space-y-2">
                            <p className="text-sm text-slate-700 font-normal">
                                <span className="font-bold text-blue-500">Job Title:</span> {jobTitle || "Job Title"}
                            </p>

                            <p className="text-sm text-slate-700 whitespace-pre-line font-normal">
                                <span className="font-bold text-blue-500">Job Description:</span> {jobDesc || "Job description will appear here."}
                            </p>

                            <p className="text-sm text-slate-700 font-normal">
                                <span className="font-bold text-blue-500">Job Location:</span> {jobLoc || "Location"}
                            </p>

                            <p className="text-sm text-slate-700 whitespace-pre-line font-normal">
                                <span className="font-bold text-blue-500">Job Type:</span> {jobType || "Job Type."}
                            </p>

                            <p className="text-sm text-slate-700 whitespace-pre-line font-normal">
                                <span className="font-bold text-blue-500">Job Responsibilities:</span> <br /> {jobRes || "Job Responsibilities."}
                            </p>

                            <p className="text-sm text-slate-700 whitespace-pre-line font-normal">
                                <span className="font-bold text-blue-500">Minimum Qualifications:</span> <br /> {minJobQual || "Minimum Qualifications."}
                            </p>

                            <p className="text-sm text-slate-700 whitespace-pre-line font-normal">
                                <span className="font-bold text-blue-500">Preferred Qualifications:</span> <br /> {preferredJobQual || "Preferred Qualifications."}
                            </p>

                            <p className="text-sm text-slate-700">
                                <span className="font-bold text-blue-500">Salary Range: </span>
                                {minSalary && maxSalary
                                    ? `₹${minSalary} – ₹${maxSalary} ${compensationType.toUpperCase()}`
                                    : "Salary range"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
