const express = require('express');
const historyController = require('../controllers/historyController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.use(authController.protect);
router
  .route('/')
  .get(historyController.getAllHistories)
  .post(historyController.createHistory);

router
  .route('/:id')
  .get(historyController.getHistory)
  .delete(historyController.deleteHistory);

module.exports = router;
