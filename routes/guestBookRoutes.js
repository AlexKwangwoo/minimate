const express = require('express');
const guestBookController = require('../controllers/guestBookController');

const router = express.Router();

router
  .route('/')
  .get(guestBookController.getAllGuestBook)
  .post(guestBookController.createGuestBook);

router
  .route('/:id')
  // .patch(guestBookController.updatePhotoInside)
  .delete(guestBookController.deleteGuestBook);

// router.route('/:id/comment').post(guestBookController.addComment);

// router
//   .route('/:id/comment/:commentId')
//   .patch(guestBookController.updatePhotoComment)
//   .delete(guestBookController.deletePhotoComment);

module.exports = router;
