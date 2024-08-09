const factory = require('./handlerFactory');
const MiniHome = require('../models/miniHomeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');
const MiniHomePhoto = require('../models/miniHomePhotoModel');
const GuestBook = require('../models/guestBookModal');

exports.getAllGuestBook = factory.getAll(GuestBook);
// exports.createGuestBook = factory.createOne(GuestBook);
exports.deleteGuestBook = factory.deleteOne(GuestBook);

exports.createGuestBook = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne(
    {
      _id: req.body.miniHome
    },
    function(err, miniHome) {
      // if (err) { ... }
      if (!miniHome) {
        // no user found, do sth
        return next(new AppError('Can not find the minihome', 404));
      }
    }
  );

  if (foundMiniHome) {
    // { $elemMatch: { award: 'National Medal', year: 1975 } }
    // !! owner 아이디를 직접 url에 받아서 할수있으나 쿼리 공부를 위해 이렇게 owner를 찾아봄!!

    const foundOwner = await User.findOne({
      _id: foundMiniHome.owner
    }).populate({
      path: 'best_friends',
      // -room만 쓰면 안됨..
      select: 'friend friend_nick_name my_nick_name',
      populate: [
        // {
        //   path: 'room',
        //   model: 'Room',
        //   select: ''
        // },
        {
          path: 'friend',
          model: 'User',
          select: 'username'
        }
      ],
      options: {
        limit: 6,
        sort: { createdAt: -1 } //-1도됨 createdAt는 내가 입력한 model에서 가져오는것임
        // skip: 0
      }
    });

    const foundIamHisBestFriend = foundOwner.best_friends.filter(each =>
      each.friend.equals(req.body.friendId)
    )[0];

    if (!foundIamHisBestFriend && foundMiniHome.owner !== req.body.friendId) {
      return next(
        new AppError(
          'This is not best friend, only best friend can write the book',
          404
        )
      );
    }
    // return next(new AppError('bye', 404));

    const temp = {
      miniHome: req.body.miniHome,
      friendId: req.body.friendId,
      friend_name: foundIamHisBestFriend.friend.username,
      friend_nick_name: foundIamHisBestFriend.friend_nick_name,
      friend_img: foundIamHisBestFriend.friend_nick_name.minime_img,
      content: req.body.content,
      privacy_scope: req.body.privacy_scope
    };

    const doc = await GuestBook.create(temp);
    res.status(201).json({
      status: 'success',
      data: doc
    });
  } else {
    return next(new AppError('Can not find the minihome', 404));
  }
});

exports.updateGuestBookInside = catchAsync(async (req, res, next) => {
  const foundGuestBook = await GuestBook.findOne({
    _id: req.params.id
  });

  if (foundGuestBook) {
    ['privacy_scope', 'content'].forEach(each => {
      if (req.body[each]) {
        foundGuestBook[each] = req.body[each];
      }
    });

    foundGuestBook.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome photo', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundGuestBook
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const foundGuestBook = await GuestBook.findOne({
    _id: req.params.id
  });

  // { $elemMatch: { award: 'National Medal', year: 1975 } }
  // !! owner 아이디를 직접 url에 받아서 할수있으나 쿼리 공부를 위해 이렇게 owner를 찾아봄!!
  console.log('foundGuestBookfoundGuestBook', foundGuestBook);
  const foundMiniHome = await MiniHome.findOne({
    _id: foundGuestBook.miniHome
  });

  const foundOwner = await User.findOne({ _id: foundMiniHome.owner }).populate({
    path: 'best_friends',
    // -room만 쓰면 안됨..
    select: 'friend friend_nick_name my_inck_name',
    populate: [
      // {
      //   path: 'room',
      //   model: 'Room',
      //   select: ''
      // },
      {
        path: 'friend',
        model: 'User',
        select: 'username'
      }
    ],
    options: {
      limit: 6,
      sort: { createdAt: -1 } //-1도됨 createdAt는 내가 입력한 model에서 가져오는것임
      // skip: 0
    }
  });

  const foundIamHisBestFriend = foundOwner.best_friends.filter(each =>
    each.friend.equals(req.body.friendId)
  )[0];

  if (!foundIamHisBestFriend && foundMiniHome.owner !== req.body.friendId) {
    return next(
      new AppError(
        'This is not best friend, only best friend can send a comment',
        404
      )
    );
  }
  // return next(new AppError('bye', 404));

  if (foundGuestBook) {
    const temp = [
      {
        friendId: req.body.friendId,
        friend_name: foundIamHisBestFriend.friend.username,
        friend_nick_name: foundIamHisBestFriend.friend_nick_name,
        text: req.body.text,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    const temp2 = [...foundGuestBook.comment];

    temp.push(...temp2);
    foundGuestBook.comment = temp;
    foundGuestBook.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome guest book', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundGuestBook
  });
});

exports.updateGuestBookComment = catchAsync(async (req, res, next) => {
  const foundGuestBook = await GuestBook.findOne({
    _id: req.params.id
  });

  let findIndex;

  if (foundGuestBook) {
    foundGuestBook.comment.forEach((each, index) => {
      if (each._id.equals(req.params.commentId)) {
        // eslint-disable-next-line no-unused-expressions
        findIndex = index;
      }
    });
  } else {
    return next(new AppError('Can not find minihome photo', 404));
  }

  if (findIndex >= 0) {
    foundGuestBook.comment[findIndex].text = req.body.text;
    foundGuestBook.comment[findIndex].updatedAt = new Date();

    foundGuestBook.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('This text commentId ID does not exist', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundGuestBook
  });
});

exports.deleteGuestBookComment = catchAsync(async (req, res, next) => {
  const foundGuestBook = await GuestBook.findOne({
    _id: req.params.id
  });

  if (foundGuestBook) {
    const temp = foundGuestBook.comment.filter(each => {
      return !each._id.equals(req.params.commentId);
    });
    foundGuestBook.comment = temp;
    foundGuestBook.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome photo', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundGuestBook
  });
});
