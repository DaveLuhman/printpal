const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Setting destination for file upload');
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log(`Saving file as: ${filename}`);
    cb(null, filename);
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.stl', '.3mf', '.step', '.obj'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(fileExt)) {
    console.log(`File type ${fileExt} is allowed`);
    cb(null, true);
  } else {
    console.log(`File type ${fileExt} is not allowed`);
    cb(new Error('Invalid file type. Only STL, 3MF, STEP, and OBJ files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max file size
});

module.exports = upload;