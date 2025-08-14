// // const multer = require('multer');
// // const path = require('path');
// // const fs = require('fs');

// // // In multer.js
// // const uploadDir = path.join(__dirname, '../public/uploads');
// // // Create upload directory if it doesn't exist
// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir, { recursive: true });
// // }

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     // Make sure this path matches your static files path
// //     cb(null, path.join(__dirname, '../public/uploads'));
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
// //   }
// // });

// // // File filter to only accept images
// // const fileFilter = (req, file, cb) => {
// //   const filetypes = /jpeg|jpg|png|gif/;
// //   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// //   const mimetype = filetypes.test(file.mimetype);

// //   if (extname && mimetype) {
// //     return cb(null, true);
// //   } else {
// //     cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
// //   }
// // };

// // const upload = multer({ 
// //   storage: storage,
// //   limits: { 
// //     fileSize: 5 * 1024 * 1024 // 5MB
// //   },
// //   fileFilter: fileFilter
// // });

// // module.exports = upload;





// // config/multer.js
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Ensure upload directory exists
// const uploadDir = path.join(__dirname, '../public/uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     const ext = path.extname(file.originalname);
//     cb(null, `avatar-${uniqueSuffix}${ext}`);
//   }
// });

// const upload = multer({ 
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (extname && mimetype) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
//     }
//   }
// });

// module.exports = upload;


// // config/multer.js
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const uploadDir = path.join(__dirname, '../public/uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     const ext = path.extname(file.originalname);
//     cb(null, `avatar-${uniqueSuffix}${ext}`);
//   }
// });
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
//     if (extname && mimetype) return cb(null, true);
//     cb(new Error('Only image files are allowed!'));
//   }
// });
// module.exports = upload;












// config/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
  }
});

module.exports = upload;