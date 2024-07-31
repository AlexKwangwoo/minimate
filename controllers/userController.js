const multer = require('multer');
// const sharp = require('sharp');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const History = require('../models/historyModel');

// ****** s3 쓰고싶으면 노션노트에 저장해뒀음!
// 이거는 sharp에서 저장장소 지정해줄것임 이거는 컴퓨터에 저장이고..
// const multerStorage = multer.diskStorage({
//   // multer 깃헙에 나온거를 가져온것임
//   // cb 는 콜백임!
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // mimetype 은 파일 확장자의 키
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

// 이거는 메모리에 저장될것임!

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

exports.uploadUserImages = upload.array('images', 1);
exports.insertUserImagesLinks = (req, res, next) => {
  if (!req.files) return next();
  const images = [];
  req.files.forEach(file => {
    images.push(file.location);
  });
  req.body.images = images;
  next();
};

exports.updatePictureToUser = catchAsync(async (req, res, next) => {
  console.log('req.body.images', req.body.images);
  const doc = await User.findByIdAndUpdate(
    req.user.id,
    { minime_img: req.body.images[0] },
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

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  // allowedFields 안에있는 필드들을 제외하고 월래의값으로 유지시킬것임.. 바꾸길 원하지 않는다
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  // 다른건 파라미터로 업데이트때 받아오지만.. 이거는 파라미터에 보통 포함안시키기에.. 인터셉터 해서 넣어줌!
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log('req.file', req.file);
  console.log('req.body', req.body);

  console.log('come?');
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  console.log('req.body', req.body);
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename; //multerStorage에서 filename 정해줌!

  // 3) Update user document
  // save를할경우 pre("save") 에서 password를 체크하기떄문에.. findByIdAndUpdate를 이용해야함!
  console.log('filteredBody update me', filteredBody);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, //new 업데이트된 오브젝트를 리턴할것임
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not defined! Please use /signup instead'
//   });
// };

// exports.getUser = factory.getOne(User);
// exports.getAllUsers = factory.getAll(User);

// // Do NOT update passwords with this!
// exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);

// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not defined! Please use /signup instead'
//   });
// };

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.getUser = factory.getOne(User, {
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
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.updateUserState = catchAsync(async (req, res, next) => {
  console.log(' req.user.id', req.user.id);
  console.log(' req.body.active', req.body.active);
  const doc = await User.findByIdAndUpdate(
    req.user.id,
    {
      active: req.body.active
    },
    { returnOriginal: false }
  ).select({
    username: 1,
    active: 1
  });

  const updatedDoc = await doc.populate({
    path: 'promotion',
    //-를붙이고 owner 안해주면 계속 방이유저찾고 유저가 방찾고 무한루프돌게됨!
    // room에서 owner도 find pre를 통해 오너를 계속찾아주기에!
    select: 'active'
  });

  res.status(200).json({
    status: 'success',
    data: doc
  });
});

exports.myWishlist = catchAsync(async (req, res, next) => {
  // const query = User.findById(req.user.id, { fields: 'name' });
  const query = User.findById(req.user.id, 'wishlist');
  const doc = await query;
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.updateMyWishlist = catchAsync(async (req, res, next) => {
  const data = await User.findById(req.user.id, 'wishlist');
  const myWishList = data.wishlist;

  const newList = [];
  let checkItHas = 0;
  myWishList.forEach(each => {
    if (each.id !== req.body.wishlistId) {
      newList.push(each.id);
    } else if (each.id === req.body.wishlistId) {
      checkItHas += 1;
    }
  });

  if (checkItHas === 0) {
    newList.push(req.body.wishlistId);
  }

  console.log('myWishList', myWishList);
  console.log('newList', newList);

  const doc = await User.findByIdAndUpdate(
    req.user.id,
    {
      wishlist: newList
    },
    { returnOriginal: false }
  );

  // const updatedDoc = await doc.populate({
  //   path: 'wishlist',
  //   //-를붙이고 owner 안해주면 계속 방이유저찾고 유저가 방찾고 무한루프돌게됨!
  //   // room에서 owner도 find pre를 통해 오너를 계속찾아주기에!
  //   select: 'name id -amenities -category -owner'
  // });

  res.status(200).json({
    status: 'success'
    // data: {
    //   updatedDoc
    // }
  });
});

exports.updateMyPromotion = catchAsync(async (req, res, next) => {
  const doc = User.findByIdAndUpdate(
    req.user.id,
    {
      promotion: req.body.promotion
    },
    { returnOriginal: false }
  );

  const updatedDoc = await doc.populate({
    path: 'promotion',
    //-를붙이고 owner 안해주면 계속 방이유저찾고 유저가 방찾고 무한루프돌게됨!
    // room에서 owner도 find pre를 통해 오너를 계속찾아주기에!
    select: 'name'
  });

  res.status(200).json({
    status: 'success',
    data: updatedDoc
  });
});

exports.getUserItems = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  const foundHistory = await History.find({
    user: req.params.userId
  });

  const temp = [];
  foundHistory.forEach(each => {
    temp.push(...each.shop_items);
  });

  const doc = temp;

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

// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not defined! Please use /signup instead'
//   });
// };

// exports.getUser = factory.getOne(User);
// exports.getAllUsers = factory.getAll(User);

// // Do NOT update passwords with this!
// exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);
