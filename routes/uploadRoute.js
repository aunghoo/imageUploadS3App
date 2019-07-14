const express = require('express');
const router = express.Router();

//TODO: needs to standardize the exports of the routes
const imageUpload = require('../services/imageUpload');

const singleUpload = imageUpload.single('image');

router.post('/imageUpload', (req, res) => {
  singleUpload(req, res, function(err){
    console.log('file location');
    console.log(req.file.location);
    return res.json({'imageUrl': req.file.location});
  });
});

module.exports = router;
