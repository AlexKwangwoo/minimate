const express = require('express');
const miniHomeController = require('../controllers/miniHomeController');

const router = express.Router();

router.route('/').post(miniHomeController.createMiniHome);

router.route('/url/:username').get(miniHomeController.getMiniHomeByUrl);

router
  .route('/:id')
  .get(miniHomeController.getMiniHome)
  // .patch(miniHomeController.updateMiniHome)
  .delete(miniHomeController.deleteMiniHome);

router.route('/:id/textHistory').post(miniHomeController.addTextHistory);
router
  .route('/:id/textHistory/:textHistoryId')
  .patch(miniHomeController.updateTextHistory)
  .delete(miniHomeController.deleteTextHistory);

router
  .route('/:id/bestFriendComment')
  .post(miniHomeController.addBestFriendComment);

router
  .route('/:id/bestFriendComment/:commentId')
  .patch(miniHomeController.updateBestFriendComment)
  .delete(miniHomeController.deleteBestFriendComment);

// router.route('/:id/addView').patch(miniHomeController.updateViewMiniHome);

module.exports = router;
