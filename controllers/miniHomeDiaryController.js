const factory = require('./handlerFactory');
const MiniHome = require('../models/miniHomeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');
const MiniHomeDiary = require('../models/miniHomeDiaryModel');

exports.getAllMiniHomeDiaries = factory.getAll(MiniHomeDiary);
exports.createDiary = factory.createOne(MiniHomeDiary);

//
//

//
// exports.updateDiaryToDiaryFolder = catchAsync(async (req, res, next) => {
//   // console.log('req.body.images', req.body.images);
//   const doc = await MiniHomeDiary.create({
//     ...req.body
//   });

//   res.status(200).json({
//     status: 'success',
//     data: doc
//   });
// });

// exports.updatePhotoInside = catchAsync(async (req, res, next) => {
//   const foundMiniHomePhoto = await MiniHomePhoto.findOne({
//     _id: req.params.id
//   });

//   if (foundMiniHomePhoto) {
//     ['photo_title', 'photo_privacy_scope', 'content'].forEach(each => {
//       if (req.body[each]) {
//         foundMiniHomePhoto[each] = req.body[each];
//       }
//     });

//     foundMiniHomePhoto.save({ validateBeforeSave: false });
//   } else {
//     return next(new AppError('Can not find minihome photo', 404));
//   }

//   res.status(201).json({
//     status: 'success',
//     data: foundMiniHomePhoto
//   });
// });

// exports.deleteMiniHomePhoto = factory.deleteOne(MiniHomePhoto);

// exports.addComment = catchAsync(async (req, res, next) => {
//   const foundMiniHomePhoto = await MiniHomePhoto.findOne({
//     _id: req.params.id
//   });

//   // { $elemMatch: { award: 'National Medal', year: 1975 } }
//   // !! owner 아이디를 직접 url에 받아서 할수있으나 쿼리 공부를 위해 이렇게 owner를 찾아봄!!
//   const foundMiniHome = await MiniHome.findOne({
//     photo_folder: { $elemMatch: { _id: foundMiniHomePhoto.photo_folder_id } }
//   });

//   const foundOwner = await User.findOne({ _id: foundMiniHome.owner }).populate({
//     path: 'best_friends',
//     // -room만 쓰면 안됨..
//     select: 'friend friend_nick_name my_nick_name',
//     populate: [
//       // {
//       //   path: 'room',
//       //   model: 'Room',
//       //   select: ''
//       // },
//       {
//         path: 'friend',
//         model: 'User',
//         select: 'username'
//       }
//     ],
//     options: {
//       limit: 6,
//       sort: { createdAt: -1 } //-1도됨 createdAt는 내가 입력한 model에서 가져오는것임
//       // skip: 0
//     }
//   });

//   const foundIamHisBestFriend = foundOwner.best_friends.filter(each =>
//     each.friend.equals(req.body.friendId)
//   )[0];

//   if (!foundIamHisBestFriend && foundMiniHome.owner !== req.body.friendId) {
//     return next(
//       new AppError(
//         'This is not best friend, only best friend can send a comment',
//         404
//       )
//     );
//   }
//   // return next(new AppError('bye', 404));

//   if (foundMiniHomePhoto) {
//     const temp = [
//       {
//         friendId: req.body.friendId,
//         friend_name: foundIamHisBestFriend.friend.username,
//         friend_nick_name: foundIamHisBestFriend.friend_nick_name,
//         text: req.body.text,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//     ];
//     const temp2 = [...foundMiniHomePhoto.comment];

//     temp.push(...temp2);
//     foundMiniHomePhoto.comment = temp;
//     foundMiniHomePhoto.save({ validateBeforeSave: false });
//   } else {
//     return next(new AppError('Can not find minihome photo', 404));
//   }

//   res.status(201).json({
//     status: 'success',
//     data: foundMiniHomePhoto
//   });
// });

// exports.updatePhotoComment = catchAsync(async (req, res, next) => {
//   const foundMiniHomePhoto = await MiniHomePhoto.findOne({
//     _id: req.params.id
//   });

//   let findIndex;

//   if (foundMiniHomePhoto) {
//     foundMiniHomePhoto.comment.forEach((each, index) => {
//       if (each._id.equals(req.params.commentId)) {
//         // eslint-disable-next-line no-unused-expressions
//         findIndex = index;
//       }
//     });
//   } else {
//     return next(new AppError('Can not find minihome photo', 404));
//   }

//   if (findIndex >= 0) {
//     foundMiniHomePhoto.comment[findIndex].text = req.body.text;
//     foundMiniHomePhoto.comment[findIndex].updatedAt = new Date();

//     foundMiniHomePhoto.save({ validateBeforeSave: false });
//   } else {
//     return next(new AppError('This text commentId ID does not exist', 404));
//   }

//   res.status(201).json({
//     status: 'success',
//     data: foundMiniHomePhoto
//   });
// });

// exports.deletePhotoComment = catchAsync(async (req, res, next) => {
//   const foundMiniHomePhoto = await MiniHomePhoto.findOne({
//     _id: req.params.id
//   });

//   if (foundMiniHomePhoto) {
//     const temp = foundMiniHomePhoto.comment.filter(each => {
//       return !each._id.equals(req.params.commentId);
//     });
//     foundMiniHomePhoto.comment = temp;
//     foundMiniHomePhoto.save({ validateBeforeSave: false });
//   } else {
//     return next(new AppError('Can not find minihome photo', 404));
//   }

//   res.status(201).json({
//     status: 'success',
//     data: foundMiniHomePhoto
//   });
// });
