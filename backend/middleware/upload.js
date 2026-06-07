const multer = require('multer');

const storage = multer.memoryStorage();

const createUpload = ({ allowedTypes, message, fileSize }) =>
  multer({
    storage,
    limits: { fileSize },
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        const error = new Error(message);
        error.statusCode = 400;
        cb(error, false);
      }
    },
  });

const uploadDocument = createUpload({
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  message: 'Only PDF and Word documents are allowed',
  fileSize: 5 * 1024 * 1024,
});

const uploadImage = createUpload({
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  message: 'Only JPG, PNG, and WEBP images are allowed',
  fileSize: 2 * 1024 * 1024,
});

module.exports = { uploadDocument, uploadImage };
