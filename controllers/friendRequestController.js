const factory = require('./handlerFactory');
const FriendRequest = require('../models/friendRequestModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getAllFriendRequests = factory.getAll(FriendRequest);
exports.getFriendRequest = factory.getOne(FriendRequest);
exports.createFriendRequest = factory.createOne(FriendRequest);
exports.updateFriendRequest = factory.updateOne(FriendRequest);
exports.deleteFriendRequest = factory.deleteOne(FriendRequest);

exports.createFriendRequest = catchAsync(async (req, res, next) => {
  // console.log('req.body.sender', req.body.sender);
  // console.log('req.body.receiver', req.body.receiver);
  const friendRequestExist = await FriendRequest.find({
    $or: [
      {
        $and: [
          {
            sender: req.body.sender
          },
          {
            receiver: req.body.receiver
          }
        ]
      },
      {
        $and: [
          {
            sender: req.body.receiver
          },
          {
            receiver: req.body.sender
          }
        ]
      }
    ]
  });

  //   $and:[
  //     {$or:[
  //          {"first_name" : "john"},
  //          {"last_name" : "john"}
  //     ]},
  //     {"phone": "12345678"}
  // ]});

  console.log('friendRequestExist', friendRequestExist);

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

exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
  const friendRequestExist = await FriendRequest.find({
    _id: req.params.id //accepter -> request receiver
  });

  if (friendRequestExist.length === 0) {
    return next(new AppError('The Request does not exist', 404));
  }

  if (!friendRequestExist[0].receiver._id.equals(req.body.accepter)) {
    return next(new AppError('Only This Request Reciever Can Accept It', 406));
  }

  // const newMessage = { title: 'new title', msg: 'new Message' };
  // const result = await Contact.findById(id);
  // result.messages.push(newMessage);
  // await result.save();

  const sender = await User.findByIdAndUpdate(friendRequestExist[0].sender._id);
  const senderFilteredBestFriend = sender.best_friends.filter(
    each => !friendRequestExist[0].receiver._id.equals(each.friend)
  );
  senderFilteredBestFriend.push({
    friend: friendRequestExist[0].receiver._id,
    friend_nick_name: friendRequestExist[0].receiver_nick_name,
    my_nick_name: friendRequestExist[0].sender_nick_name
  });
  sender.best_friends = senderFilteredBestFriend;
  sender.save({ validateBeforeSave: false });

  //---------------------------------------------------------------
  const receiver = await User.findByIdAndUpdate(
    friendRequestExist[0].receiver._id
  );
  const receiverFilteredBestFriend = receiver.best_friends.filter(
    each => !friendRequestExist[0].sender._id.equals(each.friend)
  );
  receiverFilteredBestFriend.push({
    friend: friendRequestExist[0].sender._id,
    friend_nick_name: friendRequestExist[0].sender_nick_name,
    my_nick_name: friendRequestExist[0].receiver_nick_name
  });
  receiver.best_friends = receiverFilteredBestFriend;
  receiver.save({ validateBeforeSave: false });

  // const sender = await User.findByIdAndUpdate(
  //   friendRequestExist[0].sender._id,
  //   {
  //     //$push 여러번 업데이트 될수있다
  //     // $setOnInsert: {
  //     //   friend: ObjectID(articleId),
  //     //   creationDate: new Date()
  //     // },
  //     $addToSet: {
  //       best_friends: {
  //         friend: friendRequestExist[0].receiver._id,
  //         friend_nick_name: friendRequestExist[0].receiver_nick_name,
  //         my_nick_name: friendRequestExist[0].sender_nick_name
  //       }
  //     }
  //   },
  //   { safe: true, upsert: true, new: true },
  //   function(err, model) {
  //     console.log(err);
  //   }
  //   // {
  //   //   new: true,
  //   //   runValidators: true
  //   // }
  // ).exec();

  // const receiver = await User.findByIdAndUpdate(
  //   friendRequestExist[0].receiver._id,
  //   {
  //     //$push 여러번 업데이트 될수있다
  //     $addToSet: {
  //       best_friends: {
  //         friend: friendRequestExist[0].sender._id,
  //         friend_nick_name: friendRequestExist[0].sender_nick_name,
  //         my_nick_name: friendRequestExist[0].receiver_nick_name
  //       }
  //     }
  //   },
  //   { safe: true, upsert: true, new: true },
  //   function(err, model) {
  //     console.log(err);
  //   }
  //   // {
  //   //   new: true,
  //   //   runValidators: true
  //   // }
  // ).exec();

  // exports.deleteTravel = asyncHandler(async (req, res, next) => {
  //   const travel = await Travel.findByIdAndDelete(req.params.id);
  //   travel.cities.map(cityId => {
  //     City.findByIdAndUpdate(
  //       cityId,
  //       { travels: travels.filter(id => id !== travel._id) },
  //       {
  //         new: true,
  //         runValidators: true,
  //       }
  //     );
  //   });

  //   res.status(200).json({ success: true, data: {} });
  // });

  await FriendRequest.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: 'success',
    data: { sender, receiver }
  });
});
