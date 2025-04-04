const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/UserModel");
const authMiddleware = require("../middleware/authn");
const upload = require("../middleware/multer");

// ✅ GET All Users (Exclude Sensitive Data)
router.get("", async (req, res) => {
    try {
      // Extract query parameters
      let { page, limit, search } = req.query;
      
      page = parseInt(page) || 1;  // Default page = 1
      limit = parseInt(limit) || process.env.LIMIT || 10; // Default limit = 10
      
      // Calculate the number of documents to skip
      const skip = (page - 1) * limit;
  
      // Build dynamic filter object for search
      let filter = {};
      if (search) {
        filter = {
          $or: [
            { name: { $regex: search, $options: "i" } },   // Search in name
            { email: { $regex: search, $options: "i" } },  // Search in email
            { location: { $regex: search, $options: "i" } } // Search in location
          ]
        };
      }
  
      // Get total users count based on filter
      const totalUsers = await User.countDocuments(filter);
  
      // Fetch paginated and filtered users
      const users = await User.find(filter)
        .select("-password -phone -createdAt -updatedAt")
        .skip(skip)
        .limit(limit);
  
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
  
      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / limit);
  
      // Send response with pagination details
      res.json({
        data: users,
        totalUsers,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  

  router.get("/profile", authMiddleware, async (req, res) => {
    try {
      // Extract query parameters
      let { page, limit, search } = req.query;
      
      page = parseInt(page) || 1;  // Default page = 1
      limit = parseInt(limit) || process.env.LIMIT || 10; // Default limit = 10
      
      // Calculate the number of documents to skip
      const skip = (page - 1) * limit;
  
      // Build dynamic filter object for search
      let filter = { _id: { $ne: req.user.id } };

      if (search) {
        filter = {
          $or: [
            { name: { $regex: search, $options: "i" } },   // Search in name
            { email: { $regex: search, $options: "i" } },  // Search in email
            { location: { $regex: search, $options: "i" } } // Search in location
          ]
        };
      }
  
      // Get total users count based on filter
      const totalUsers = await User.countDocuments(filter);
  
      // Fetch paginated and filtered users
      const users = await User.find(filter)
        .select("-password -phone -createdAt -updatedAt")
        .skip(skip)
        .limit(limit);
  
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
  
      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / limit);
  
      // Send response with pagination details
      res.json({
        data: users,
        totalUsers,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
  

// ✅ UPDATE Profile
router.put("/update", authMiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, phone, location, age, profileImage } = req.body;

    const newProfileImage = req.file ? req.file.path : profileImage

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // Make sure authMiddleware sets this correctly
      { name, phone, location, age, email, profileImage: newProfileImage },
      { new: true }
    ).select("-password -createdAt -updatedAt"); // Exclude sensitive data

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", updatedUser});
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ DELETE Profile
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "User profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ RESET Password
router.put("/reset-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS) || 5);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
