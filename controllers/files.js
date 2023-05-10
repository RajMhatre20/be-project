const path = require("path");
const File = require("../models/file");
const fs = require("fs");
const { createCipheriv } = require("crypto");
const crypto = require("crypto");

// Define the encryption & decryption parameters
const algorithm = "aes-256-cbc";
const key = process.env.ED_KEY;
const iv = Buffer.alloc(16, 0); // Initialization
// encryptFile
const encryptFile = (filename) => {
  //encryption
  // Read the file contents
  const fileData = fs.readFileSync("uploads/" + filename);

  // Create the cipher and encrypt the data
  const cipher = createCipheriv(algorithm, key, iv);
  const encryptedData = Buffer.concat([
    cipher.update(fileData),
    cipher.final(),
  ]);

  // Write the encrypted data to a new file
  const encryptedFilePath = "uploads/" + filename + ".enc";
  fs.writeFileSync(encryptedFilePath, encryptedData);
};

const decryptFile = (file) => {
  // Read the encrypted file contents
  const encryptedFilePath = "uploads/" + file.filePath + ".enc";
  const encryptedData = fs.readFileSync(encryptedFilePath);

  // Create the decipher object
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  // Decrypt the data
  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
};

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
    File.find({ hashValue: hashValue }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (data.length) {
          File.updateOne(
            { _id: data[0]._id },
            { $push: { uploadedBy: req.user._id } },
            function (err) {
              if (err) console.log(err);
              else console.log("Value added successfully");
            }
          );
          res.status(201).json({ success: true, data: file, exists:true });
        } else {
          file.save();
          //encrypt the original file
          encryptFile(filename);
          res.status(201).json({ success: true, data: file });
        }
      }
      // Delete the original file from disk
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
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

    const decryptedData = decryptFile(file);
    res.send(decryptedData);
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
    file.uploadedBy.pull(req.user._id);
    await file.save();
    if (file.uploadedBy.length < 1) {
      const filePath = path.join(
        __dirname,
        "../uploads",
        file.filePath + ".enc"
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          throw err;
        }
      });
      await file.remove();
    }
    res
      .status(200)
      .json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};