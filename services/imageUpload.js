const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const keys = require("../config/keys");

aws.config.update({
  secretAccessKey: keys.amazonSecretAccessKey,
  accessKeyId: keys.amazonAccessKeyId,
  region: 'us-west-1'
});

const s3 = new aws.S3();

const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bbprofileimage',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'Some profile picture'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = imageUpload;
