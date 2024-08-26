const multer = require('multer');
// const sharp = require('sharp');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const factory = require('./handlerFactory');
const MiniHome = require('../models/miniHomeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');

// exports.getAllMiniHomes = factory.getAll(MiniHome);
// exports.getMiniHome = factory.getOne(MiniHome);
exports.createMiniHome = factory.createOne(MiniHome);
exports.updateMiniHome = factory.updateOne(MiniHome);
exports.deleteMiniHome = factory.deleteOne(MiniHome);

exports.getMiniHome = catchAsync(async (req, res, next) => {
  let foundMiniHome;
  if (req.query.fields) {
    foundMiniHome = MiniHome.findById(req.params.id, req.query.fields);
  } else {
    foundMiniHome = MiniHome.findById(req.params.id);
  }

  console.log('come to get one!!');
  // console.log('???', req.query);
  // console.log('queryquery', query);

  const doc = await foundMiniHome;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  doc.total_view += 1;

  const todayDate = doc.today_view.today_view_date;
  const rightNow = new Date();
  if (
    todayDate.getDay() === rightNow.getDay() &&
    todayDate.getMonth() === rightNow.getMonth() &&
    todayDate.getYear() === rightNow.getYear()
  ) {
    doc.today_view.today_view_number += 1;
  } else {
    doc.today_view.today_view_number = 1;
    doc.today_view.today_view_date = new Date();
  }

  doc.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: doc
  });
});

exports.getMiniHomeByUrl = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  const foundMiniHome = await MiniHome.findOne({
    url: `https://minimate-cy.netlify.app/${req.params.username}`
  });

  console.log('foundMiniHome', foundMiniHome);

  const doc = await foundMiniHome;

  doc.total_view += 1;

  const todayDate = doc.today_view.today_view_date;
  const rightNow = new Date();
  if (
    todayDate.getDay() === rightNow.getDay() &&
    todayDate.getMonth() === rightNow.getMonth() &&
    todayDate.getYear() === rightNow.getYear()
  ) {
    doc.today_view.today_view_number += 1;
  } else {
    doc.today_view.today_view_number = 1;
    doc.today_view.today_view_date = new Date();
  }

  doc.save({ validateBeforeSave: false });

  // 쿼리를 다 짜집기해서 마지막에 await을 붙여줘서 promise를 반환하는것의 값을 받아낸다 즉 paginate까지 모든 함수를
  // 다 거친뒤 promise로 보내버리기때문
  // 사실상 await Tour.find().find(xxx).sort(xxx).select(xxx).skip(xxx).limit(xxx) 라고보면됨
  // await안붙여주면 프로미스 안기다린거기때문에 불러봐야 .query는 프로미스상태임!
  // const doc = await features.query.explain(); 퍼포먼스 검사
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: doc
  });
});

exports.addTextHistory = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  if (foundMiniHome) {
    const temp = [
      {
        text: req.body.text,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    const temp2 = [...foundMiniHome.banner_text_history];

    temp.push(...temp2);
    foundMiniHome.banner_text_history = temp;
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.updateTextHistory = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  let findIndex;

  if (foundMiniHome) {
    foundMiniHome.banner_text_history.forEach((each, index) => {
      if (each._id.equals(req.params.textHistoryId)) {
        // eslint-disable-next-line no-unused-expressions
        findIndex = index;
      }
    });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  if (findIndex >= 0) {
    foundMiniHome.banner_text_history[findIndex].text = req.body.text;
    foundMiniHome.banner_text_history[findIndex].updatedAt = new Date();

    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('This text history ID does not exist', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.deleteTextHistory = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  if (foundMiniHome) {
    const temp = foundMiniHome.banner_text_history.filter(each => {
      return !each._id.equals(req.params.textHistoryId);
    });
    foundMiniHome.banner_text_history = temp;
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.addBestFriendComment = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  const foundOwner = await User.findOne({ _id: foundMiniHome.owner }).populate({
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

  if (!foundIamHisBestFriend) {
    return next(new AppError('This is not best friend', 404));
  }
  // return next(new AppError('bye', 404));

  if (foundMiniHome) {
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
    const temp2 = [...foundMiniHome.best_friend_comment];

    temp.push(...temp2);
    foundMiniHome.best_friend_comment = temp;
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.updateBestFriendComment = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  let findIndex;

  if (foundMiniHome) {
    foundMiniHome.best_friend_comment.forEach((each, index) => {
      if (each._id.equals(req.params.commentId)) {
        // eslint-disable-next-line no-unused-expressions
        findIndex = index;
      }
    });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  if (findIndex >= 0) {
    foundMiniHome.best_friend_comment[findIndex].text = req.body.text;
    foundMiniHome.best_friend_comment[findIndex].updatedAt = new Date();

    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('This text commentId ID does not exist', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.deleteBestFriendComment = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  if (foundMiniHome) {
    const temp = foundMiniHome.best_friend_comment.filter(each => {
      return !each._id.equals(req.params.commentId);
    });
    foundMiniHome.best_friend_comment = temp;
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.addItemToMiniHome = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  // return next(new AppError('bye', 404));

  if (foundMiniHome) {
    const temp = [
      {
        img_url: req.body.img_url,
        category: req.body.category,
        item_name: req.body.item_name,
        x_location: req.body.x_location,
        y_location: req.body.y_location,
        enable: req.body.enable
      }
    ];
    const temp2 = [...foundMiniHome.sub_img];

    temp.push(...temp2);
    foundMiniHome.sub_img = temp;
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.updateItemInMiniHome = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  let findIndex;

  if (foundMiniHome) {
    foundMiniHome.sub_img.forEach((each, index) => {
      if (each._id.equals(req.params.subimgId)) {
        // eslint-disable-next-line no-unused-expressions
        findIndex = index;
      }
    });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  // console.log(
  //   ' foundMiniHome.sub_img[findIndex]',
  //   foundMiniHome.sub_img[findIndex]
  // );
  // console.log('req.body', req.body);
  if (findIndex >= 0) {
    // const tempItem = { ...foundMiniHome.sub_img[findIndex]._doc, ...req.body };
    // console.log('tempItem', tempItem);

    Object.keys(req.body).forEach(item => {
      if (foundMiniHome.sub_img[findIndex][item])
        foundMiniHome.sub_img[findIndex][item] = req.body[item];
    });

    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('This text commentId ID does not exist', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.deleteItemFromMiniHome = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  if (foundMiniHome) {
    const temp = foundMiniHome.sub_img.filter(each => {
      return !each._id.equals(req.params.subimgId);
    });
    foundMiniHome.sub_img = temp;
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

// photo Folder --------------------------------

exports.addPhotoFolder = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  // return next(new AppError('bye', 404));

  if (foundMiniHome) {
    const temp = [
      {
        folder_name: req.body.folder_name,
        privacy_scope: req.body.privacy_scope,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    const temp2 = [...foundMiniHome.photo_folder];

    temp.push(...temp2);
    foundMiniHome.photo_folder = temp;
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.updatePhotoFolder = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  let findIndex;

  if (foundMiniHome) {
    foundMiniHome.photo_folder.forEach((each, index) => {
      if (each._id.equals(req.params.photoFolderId)) {
        // eslint-disable-next-line no-unused-expressions
        findIndex = index;
      }
    });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  if (findIndex >= 0) {
    Object.keys(req.body).forEach(item => {
      if (foundMiniHome.photo_folder[findIndex][item])
        foundMiniHome.photo_folder[findIndex][item] = req.body[item];
    });
    foundMiniHome.photo_folder[findIndex].updatedAt = new Date();
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('This text photoFolderId does not exist', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.deletePhotoFolder = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  if (foundMiniHome) {
    const temp = foundMiniHome.photo_folder.filter(each => {
      return !each._id.equals(req.params.photoFolderId);
    });
    foundMiniHome.photo_folder = temp;
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

AWS.config.update({
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'us-east-1'
});
const s3 = new AWS.S3();

const multerStorage = multerS3({
  s3: s3,
  bucket: 'minimate',
  key: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const ext = file.mimetype.split('/')[1];
    cb(null, `users/${name}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  // 파일 확장자 체크 ex) image/png
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadPhotoImages = upload.array('images', 1);
exports.insertUserImagesLinks = (req, res, next) => {
  if (!req.files) return next();
  const images = [];
  req.files.forEach(file => {
    images.push(file.location);
  });
  req.body.images = images;
  next();
};

exports.updatePictureToBanner = catchAsync(async (req, res, next) => {
  // console.log('req.body.images', req.body.images);
  const doc = await MiniHome.findByIdAndUpdate(
    req.params.id,
    { banner_photo: req.body.images[0] },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    results: doc,
    data: {
      data: doc
    }
  });
});

exports.deletePictureToBanner = catchAsync(async (req, res, next) => {
  // console.log('req.body.images', req.body.images);
  const doc = await MiniHome.findByIdAndUpdate(
    req.params.id,
    { banner_photo: null },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(201).json({
    status: 'success',
    data: doc
  });
});

// Diary Folder --------------------------------

exports.addDiaryFolder = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  // return next(new AppError('bye', 404));

  if (foundMiniHome) {
    const temp = [
      {
        folder_name: req.body.folder_name,
        privacy_scope: req.body.privacy_scope,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    const temp2 = [...foundMiniHome.diary_folder];

    temp.push(...temp2);
    foundMiniHome.diary_folder = temp;
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.updateDiaryFolder = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  let findIndex;

  if (foundMiniHome) {
    foundMiniHome.diary_folder.forEach((each, index) => {
      if (each._id.equals(req.params.diaryFolderId)) {
        // eslint-disable-next-line no-unused-expressions
        findIndex = index;
      }
    });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  if (findIndex >= 0) {
    Object.keys(req.body).forEach(item => {
      if (foundMiniHome.diary_folder[findIndex][item])
        foundMiniHome.diary_folder[findIndex][item] = req.body[item];
    });
    foundMiniHome.diary_folder[findIndex].updatedAt = new Date();
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('This text photoFolderId does not exist', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});

exports.deleteDiaryFolder = catchAsync(async (req, res, next) => {
  const foundMiniHome = await MiniHome.findOne({
    _id: req.params.id
  });

  if (foundMiniHome) {
    const temp = foundMiniHome.diary_folder.filter(each => {
      return !each._id.equals(req.params.diaryFolderId);
    });
    foundMiniHome.diary_folder = temp;
    foundMiniHome.save({ validateBeforeSave: false });
  } else {
    return next(new AppError('Can not find minihome', 404));
  }

  res.status(201).json({
    status: 'success',
    data: foundMiniHome
  });
});
