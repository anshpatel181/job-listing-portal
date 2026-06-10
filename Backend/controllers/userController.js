import User from "../models/User.js";

export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSaved = user.savedJobs.some(
      (id) => id.toString() === jobId
    );

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter(
        (id) => id.toString() !== jobId
      );
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();

    res.status(200).json({
      message: isSaved ? "Job removed from saved" : "Job saved",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save job" });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedJobs");

    res.status(200).json(user.savedJobs);
  } catch (error) {    
    res.status(500).json({ message: "Failed to fetch saved jobs" });
  }
};
