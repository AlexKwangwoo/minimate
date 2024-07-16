const factory = require('./handlerFactory');
const MiniHome = require('../models/miniHomeModel');
const catchAsync = require('../utils/catchAsync');

// exports.getAllMiniHomes = factory.getAll(MiniHome);
exports.getMiniHome = factory.getOne(MiniHome);
exports.createMiniHome = factory.createOne(MiniHome);
exports.updateMiniHome = factory.updateOne(MiniHome);
exports.deleteMiniHome = factory.deleteOne(MiniHome);

exports.updateTextHistory = catchAsync(async (req, res, next) => {
  // console.log('req.body.sender', req.body.sender);
  // console.log('req.body.receiver', req.body.receiver);
  console.log('req.params.id ', req.params.id);
  console.log('req.params.textHistoryId ', req.params.textHistoryId);

  const foundMiniHome = await MiniHome.find({
    _id: req.params.id
  });

  console.log('foundMiniHome', foundMiniHome);
  // if (foundMiniHome.length > 1) {
  // }

  //   $and:[
  //     {$or:[
  //          {"first_name" : "john"},
  //          {"last_name" : "john"}
  //     ]},
  //     {"phone": "12345678"}
  // ]});

  // if (friendRequestExist.length >= 1) {
  //   return next(
  //     new AppError('You already have a request with this receiver', 406)
  //   );
  // }

  // const doc = await FriendRequest.create(req.body);

  res.status(201).json({
    status: 'success',
    data: null
  });
});
