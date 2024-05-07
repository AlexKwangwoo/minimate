const express = require('express');
const shopItemController = require('../controllers/shopItemController');

const router = express.Router();
router
  .route('/')
  .get(shopItemController.getAllShopItems)
  .post(shopItemController.createShopItem);

router
  .route('/:id')
  .get(shopItemController.getShopItem)
  .patch(shopItemController.updateShopItem)
  .delete(shopItemController.deleteShopItem);

router
  .route('/:id/image')
  .patch(
    shopItemController.uploadRoomImages,
    shopItemController.insertRoomImagesLinks,
    shopItemController.updatePictureToRoom
  );

module.exports = router;
