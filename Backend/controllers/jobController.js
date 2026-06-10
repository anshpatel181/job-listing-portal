import { cacheService } from "../config/redisClient.js";
import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      employer: req.user.id,
      ...req.body,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to create job" });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const status = req.query.status || "all";

    let query = { employer: req.user.id };

    if (status !== "all") {
      query.status = status;
    }

    if (search) {
      query.jobTitle = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      jobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("ERROR: ", error.message);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(job, req.body);
    await job.save();

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
};

export const getFilteredJobs = async (req, res) => {
  try {
    const { keyword, location, type, limit, currentPage } = req.query;

    let query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (location) {
      query.jobLoc = { $regex: `^${location}`, $options: "i" };
    }

    if (type) {
      query.jobType = type;
    }

    let skip = currentPage * 5 - 5;

    const [totalJobs, jobs] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().select("jobTitle jobLoc jobType minSalary maxSalary createdAt"),
    ]);
    
    res
      .status(200)
      .json({ jobs, totalJobs, totalPages: Math.ceil(totalJobs / 5) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

export const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.status = job.status === "active" ? "closed" : "active";
    await job.save();

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job status" });
  }
};
