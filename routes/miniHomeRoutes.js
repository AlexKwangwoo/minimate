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

router.route('/:id/item').post(miniHomeController.addItemToMiniHome);
router
  .route('/:id/item/:subimgId')
  .patch(miniHomeController.updateItemInMiniHome)
  .delete(miniHomeController.deleteItemFromMiniHome);

router.route('/:id/photoFolder').post(miniHomeController.addPhotoFolder);
router
  .route('/:id/photoFolder/:photoFolderId')
  .patch(miniHomeController.updatePhotoFolder)
  .delete(miniHomeController.deletePhotoFolder);

router
  .route('/:id/bannnerPhoto')
  .patch(
    miniHomeController.uploadPhotoImages,
    miniHomeController.insertUserImagesLinks,
    miniHomeController.updatePictureToBanner
  )
  .delete(miniHomeController.deletePictureToBanner);

// router.route('/:id/addView').patch(miniHomeController.updateViewMiniHome);

router.route('/:id/diaryFolder').post(miniHomeController.addDiaryFolder);
router
  .route('/:id/diaryFolder/:diaryFolderId')
  .patch(miniHomeController.updateDiaryFolder)
  .delete(miniHomeController.deleteDiaryFolder);

module.exports = router;
