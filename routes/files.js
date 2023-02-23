const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { protect } = require("../middleware/auth");
const { uploadFile, getMyFiles, deleteFile, downloadFile, getFile } = require("../controllers/files");


router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/getmyfiles", protect, getMyFiles);
router.get("/:id/download", protect, downloadFile);
router.get("/:id", protect, getFile);
router.delete("/:id", protect, deleteFile);

module.exports = router;
