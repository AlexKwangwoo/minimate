const express = require('express');
const friendRequestController = require('../controllers/friendRequestController');

const router = express.Router();
router
  .route('/')
  .get(friendRequestController.getAllFriendRequests)
  .post(friendRequestController.createFriendRequest);

router
  .route('/:id')
  .get(friendRequestController.getFriendRequest)
  .patch(friendRequestController.updateFriendRequest)
  .delete(friendRequestController.deleteFriendRequest);

router.route('/accept/:id').patch(friendRequestController.acceptFriendRequest);

module.exports = router;
