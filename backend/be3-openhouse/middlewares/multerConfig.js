const multer = require('multer');
const path = require('path');

// Define the folder where the images and posters will be stored
const UPLOAD_DIR = 'uploads';

// Ensure the upload folder exists
const fs = require('fs');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);  // Set the destination folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get the file extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    // Use user_name as the prefix and append file type (methodology, result, etc.) and unique ID
    const user_name = req.body.user_name || 'default'; // Use 'default' if user_name is not provided

    cb(null, `${user_name}-${file.fieldname}-${uniqueSuffix}${ext}`);  // Format: user_name-fieldname-unique-id.extension
  }
});

// Multer file size limits and file type filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 2024 * 1024 // Limit the size of image files to 1MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === 'methodology' || file.fieldname === 'result' || file.fieldname === 'cover_poster') {
      if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        return cb(new Error('Only JPG images are allowed'), false);
      }
    } else if (file.fieldname === 'pdf_poster') {
      if (ext !== '.pdf') {
        return cb(new Error('Only PDF files are allowed for posters'), false);
      }
    }
    cb(null, true);
  }
});

module.exports = upload;
