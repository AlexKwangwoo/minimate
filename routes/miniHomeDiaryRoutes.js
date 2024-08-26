const express = require('express');
const miniHomeDiaryController = require('../controllers/miniHomeDiaryController');

const router = express.Router();

router
  .route('/')
  .get(miniHomeDiaryController.getAllMiniHomeDiaries)
  .post(miniHomeDiaryController.createDiary);

// router
//   .route('/:id')
//   .patch(miniHomeDiaryController.updatePhotoInside)
//   .delete(miniHomeDiaryController.deleteMiniHomePhoto);

// router.route('/:id/comment').post(miniHomeDiaryController.addComment);

// router
//   .route('/:id/comment/:commentId')
//   .patch(miniHomeDiaryController.updatePhotoComment)
//   .delete(miniHomeDiaryController.deletePhotoComment);

module.exports = router;
