const express = require('express');
const miniHomePhotoController = require('../controllers/miniHomePhotoController');

const router = express.Router();

router
  .route('/')
  .get(miniHomePhotoController.getAllMiniHomePhotos)
  .post(
    miniHomePhotoController.uploadPhotoImagesToFolder,
    miniHomePhotoController.insertPhotoImagesLinks,
    miniHomePhotoController.updatePictureToPhotoFolder
  );

router.route('/:id').delete(miniHomePhotoController.deleteMiniHomePhoto);

module.exports = router;
