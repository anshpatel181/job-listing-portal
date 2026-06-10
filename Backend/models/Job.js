import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    jobTitle: { type: String, required: true, trim: true },

    jobDesc: { type: String, required: true },

    jobRes: { type: String, required: true },

    jobQual: { type: String, required: true },

    jobLoc: { type: String, required: true, index: true },

    minSalary: { type: Number, required: true },

    maxSalary: { type: Number, required: true },

    jobType: { type: String, required: true, index: true },

    status: { type: String, enum: ["active", "closed"], default: "active", index: true },
  },
  { timestamps: true },
);

jobSchema.index({ jobTitle: 'text', jobDesc: 'text' }) //this is a text index in which jobTitle and jobDesc will be broken into individual words and then stop words will be removed like we, are, a, who and then it applied stemming which means it chops the words down to their root form like "developing becomes develop", "applications become applic" now all this root words are added into one giant dictionary which will be stored in mongodb memory mapping words to Job IDs.
jobSchema.index({ employer: 1, createdAt: -1}) 

export default mongoose.model("Job", jobSchema);

// in this model we have added index: true to status, jobType, and jobLoc, so now mongodb creates a standard index and that index will look like this:
// for status, index will look like: active: [Job 1, Job 3, Job 4], closed: [Job 2, Job5]
// For Job Type, index will look like: Full-time: [Job 1, Job 3, Job 4], Part-time: [Job 2, Job5], Internship: [Job 6, Job7]
// For Job location, index will look like: Bangalore: [Job 5], Mumbai: [Job 3, Job 4], Pune: [Job 1, Job 2]
