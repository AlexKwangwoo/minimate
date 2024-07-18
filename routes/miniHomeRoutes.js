const express = require('express');
const miniHomeController = require('../controllers/miniHomeController');

const router = express.Router();

router.route('/').post(miniHomeController.createMiniHome);
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

module.exports = router;
