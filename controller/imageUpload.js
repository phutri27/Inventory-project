const cloudinary = require('../cloudy')

function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

module.exports = uploadImage