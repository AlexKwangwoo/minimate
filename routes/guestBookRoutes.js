const express = require('express');
const guestBookController = require('../controllers/guestBookController');

const router = express.Router();

router
  .route('/')
  .get(guestBookController.getAllGuestBook)
  .post(guestBookController.createGuestBook);

router
  .route('/:id')
  .patch(guestBookController.updateGuestBookInside)
  .delete(guestBookController.deleteGuestBook);

router.route('/:id/comment').post(guestBookController.addComment);

router
  .route('/:id/comment/:commentId')
  .patch(guestBookController.updateGuestBookComment)
  .delete(guestBookController.deleteGuestBookComment);

module.exports = router;
