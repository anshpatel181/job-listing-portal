import Profile from "../models/Profile.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.status(200).json(null);
    }

    res.json(profile);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    const updateData = { ...req.body, role, userId };

    if (req.file) {

      const fileUrl = req.file.path
      const fileName = req.file.originalname
      
      if (role === 'employer') {
        updateData.logoUrl = fileUrl;
        updateData.fileName = fileName
      } else if (role === 'job_seeker') {
        updateData.resumeUrl = fileUrl;
        updateData.fileName = fileName
      }
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    );
    
    res.json(updatedProfile);

  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
