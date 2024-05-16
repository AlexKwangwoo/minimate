const factory = require('./handlerFactory');
const FriendRequest = require('../models/friendRequestModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllFriendRequests = factory.getAll(FriendRequest);
exports.getFriendRequest = factory.getOne(FriendRequest);
exports.createFriendRequest = factory.createOne(FriendRequest);
exports.updateFriendRequest = factory.updateOne(FriendRequest);
exports.deleteFriendRequest = factory.deleteOne(FriendRequest);

exports.createFriendRequest = catchAsync(async (req, res, next) => {
  const friendRequestExist = await FriendRequest.find({
    $and: [
      {
        sender: req.body.sender
      },
      {
        receiver: req.body.receiver
      }
    ]
  }).find({
    $and: [
      {
        sender: req.body.receiver
      },
      {
        receiver: req.body.sender
      }
    ]
  });

  if (friendRequestExist.length >= 1) {
    return next(
      new AppError('You already have a request with this receiver', 406)
    );
  }

  const doc = await FriendRequest.create(req.body);

  res.status(201).json({
    status: 'success',
    data: doc
  });
});
