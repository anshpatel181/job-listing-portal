import { CiCircleRemove } from "react-icons/ci";
import { useState, useEffect } from "react";
import { getProfile, updateSeekerProfile } from "../services/profileService";
import { DashboardNavbar } from "../components/DashboardNavbar";
import { toast } from "react-toastify";
import FullScreenLoader from "../components/loaders/FullScreenLoader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaFileDownload } from "react-icons/fa";

export const SeekerProfile = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [seekerDetails, setSeekerDetails] = useState({
    fName: "",
    email: "",
    phoneNo: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
  });
  const [downloadUrl, setDownloadUrl] = useState("")

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient()

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500";

  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  const { data, isPending } = useQuery({
    queryKey: ["seekerProfile"],
    queryFn: getProfile
  })
  
  useEffect(() => {
    if (data) {
      
      setSeekerDetails({
        fName: data.fullName || "",
        email: data.email || "",
        phoneNo: data.phoneNo || "",
        location: data.location || "",
        skills: data.skills || "",
        experience: data.experience || "",
        education: data.education || "",
      })
    }
  }, [data]);

  const updateProfileMutation = useMutation({
    mutationFn: (profileData) => updateSeekerProfile(profileData),
    onSuccess: () => {
      toast.success("Profile Updated Successfully")
      queryClient.invalidateQueries({ queryKey: ["seekerProfile"] })
      setIsSaving(false)
    },
    onError: () => {
      toast.error("Failed to save profile")
      setIsSaving(false)
    }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSeekerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true)

    const formData = new FormData();
    if (resumeFile) formData.append("resumeFile", resumeFile)

    formData.append("fullName", seekerDetails.fName)
    formData.append("email", seekerDetails.email)
    formData.append("phoneNo", seekerDetails.phoneNo)
    formData.append("location", seekerDetails.location)
    formData.append("skills", seekerDetails.skills)
    formData.append("experience", seekerDetails.experience)
    formData.append("education", seekerDetails.education)
    updateProfileMutation.mutate(formData)
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      setResumeFile(null);
      return;
    }
    setResumeError("");
    setResumeFile(file);
  };

  // we have intercept the url to force cloudinary downloads
  useEffect(() => {
    if (data?.resumeUrl) {
      const url = data.resumeUrl.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );

      setDownloadUrl(url);
    }
  }, [data]);

  if (isPending) {
    return <FullScreenLoader />
  }

  return (
    <>
      <DashboardNavbar />

      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Job Seeker Profile
            </h1>
            <p className="text-sm text-slate-500">
              Keep your profile updated to get better job matches
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-4">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="fName">Full Name</label>
                <input
                  className={inputClass}
                  placeholder="John Doe"
                  name="fName"
                  id="fName"
                  value={seekerDetails.fName || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input
                  className={inputClass}
                  placeholder="john@example.com"
                  name="email"
                  id="email"
                  value={seekerDetails.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="phoneNo">Phone Number</label>
                <input
                  className={inputClass}
                  placeholder="+91 9876543210"
                  name="phoneNo"
                  id="phoneNo"
                  value={seekerDetails.phoneNo}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="lc">Location</label>
                <input
                  className={inputClass}
                  placeholder="City, Country"
                  name="location"
                  id="lc"
                  value={seekerDetails.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-4">
              Professional Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass} htmlFor="skills">Skills</label>
                <input
                  className={inputClass}
                  placeholder="React, Node.js, MongoDB"
                  name="skills"
                  id="skills"
                  value={seekerDetails.skills}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="exp">Experience</label>
                <input
                  className={inputClass}
                  placeholder="2 years"
                  name="experience"
                  id="exp"
                  value={seekerDetails.experience}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="edu">Education</label>
                <input
                  className={inputClass}
                  id="edu"
                  placeholder="B.Tech Computer Science"
                  name="education"
                  value={seekerDetails.education}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-4">Resume</h2>
            <label className={labelClass}>{data?.resumeUrl ? "Change Resume" : "Upload Resume"} (PDF only)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
              className="block text-sm text-slate-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100" 
            />

            {resumeError && (
              <p className="text-red-500 text-sm mt-2">{resumeError}</p>
            )}

            {resumeFile && (
              <div className="mt-3 flex justify-between items-center bg-slate-50 border rounded-lg px-4 py-2">
                <span className="text-sm">{resumeFile.name}</span>
                <button
                  type="button"
                  onClick={() => setResumeFile(null)}
                  className="text-red-500 hover:text-red-600"
                >
                  <CiCircleRemove size={20} />
                </button>
              </div>
            )}

            <p className="mt-2 ">Uploaded Resume</p>
            {data?.resumeUrl && (
              <div className="my-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="truncate max-w-[250px]">{data?.fileName}</span>
                </div>

                <div>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Download <FaFileDownload size={16} className="inline-flex mr-2 mb-1 hover:underline"/> 
                  </a>
                  <a
                    href={data.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Resume ↗
                  </a>
                </div>
              </div>
            )}
          </div>

          {message && (
            <p className="text-sm font-medium text-green-600">{message}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 rounded-lg font-semibold transition
                ${isSaving
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              {isSaving && resumeFile ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Uploading resume to cloud...
                </div>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
