const express = require('express');
const aws = require('aws-sdk');
const keys = require("../config/keys");
const router = express.Router();

//TODO: needs to standardize the exports of the routes
// const imageUpload = require('../services/imageUpload');
// const singleUpload = imageUpload.single('image');

const S3_BUCKET = 'bbprofileimage';

aws.config.update({
  secretAccessKey: keys.amazonSecretAccessKey,
  accessKeyId: keys.amazonAccessKeyId,
  region: 'us-east-2'
});

const s3 = new aws.S3();

router.post('/imageUpload', (req, res) => {
  const s3 = new aws.S3();  // Create a new instance of S3
  console.log(req.body);
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
// Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read'
  };
// Make a request to the S3 API to get a signed URL which we can use to upload our file
s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      res.json({success: false, error: err})
    }
    console.log(data);
    // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    // Send it all back
    res.json({success:true, data:{returnData}});
  });
});

module.exports = router;
