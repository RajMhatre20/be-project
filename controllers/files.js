const path = require("path");
const File = require("../models/file");
const fs = require("fs");

// @desc      Upload a file
// @route     POST /api/files/upload
// @access    Private
exports.uploadFile = async (req, res) => {
  try {
    const { originalname, filename, mimetype, size } = req.file;
    const hashValue = req.body.hashValue;
    const file = new File({
      fileName: originalname,
      filePath: filename,
      fileType: mimetype,
      fileSize: size,
      uploadedBy: req.user._id,
      hashValue: hashValue,
    });
    await file.save();
    res.status(201).json({ success: true, data: file });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// @desc      Get all files uploaded by the user
// @route     GET /api/files/myfiles
// @access    Private
exports.getMyFiles = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user._id });
    res.status(200).json({ success: true, data: files });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// @desc      Download a file by ID
// @route     GET /api/files/:id/download
// @access    Private
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }
    const filePath = path.join(__dirname, "../uploads", file.filePath);
    res.json(file);
    res.download(filePath);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// @desc      Get a file by ID
// @route     GET /api/files/:id
// @access    Private
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }
    res.status(200).json({ success: true, data: file });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// @desc      Delete a file by ID
// @route     DELETE /api/files/:id
// @access    Private
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });
    if (!file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }
    const filePath = path.join(__dirname, "../uploads", file.filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
    await file.remove();
    res
      .status(200)
      .json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
