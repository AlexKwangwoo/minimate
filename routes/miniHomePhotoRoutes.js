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

router
  .route('/:id')
  .patch(miniHomePhotoController.updatePhotoInside)
  .delete(miniHomePhotoController.deleteMiniHomePhoto);

router.route('/:id/comment').post(miniHomePhotoController.addComment);

router
  .route('/:id/comment/:commentId')
  .patch(miniHomePhotoController.updatePhotoComment)
  .delete(miniHomePhotoController.deletePhotoComment);

module.exports = router;
