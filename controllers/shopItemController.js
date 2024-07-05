const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const ShopItem = require('../models/shopItemModel');
const Category = require('../models/categoryModel');

const AppError = require('../utils/appError');

exports.getAllShopItems = factory.getAll(ShopItem);
exports.getShopItem = factory.getOne(ShopItem);
// exports.createShopItem = factory.createOne(ShopItem);
exports.updateShopItem = factory.updateOne(ShopItem);
exports.deleteShopItem = factory.deleteOne(ShopItem);

exports.createShopItem = catchAsync(async (req, res, next) => {
  const cateExist = await Category.find({
    _id: req.body.category
  });

  if (cateExist.length === 0) {
    return next(new AppError('This category does not exist', 404));
  }

  const doc = await ShopItem.create(req.body);

  res.status(201).json({
    status: 'success',
    data: doc
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
    cb(null, `shopitem/${name}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  // 파일 확장자 체크 ex) image/png
  console.log('file', file);
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

// field 의 키는 images 로 해서 프론트엔드에서 보내줘야함!!
exports.uploadRoomImages = upload.array('images', 10);
exports.insertRoomImagesLinks = (req, res, next) => {
  if (!req.files) return next();
  const images = [];
  req.files.forEach(file => {
    images.push(file.location);
  });
  req.body.images = images;
  next();
};

exports.updatePictureToRoom = catchAsync(async (req, res, next) => {
  console.log(' req.body', req.body);
  const doc = await ShopItem.findByIdAndUpdate(
    req.params.id,
    { item_img: req.body.images[0] },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: doc
  });
});

exports.getAllShopItemsByCateName = catchAsync(async (req, res, next) => {
  const cate = await Category.findOne({
    name: { $regex: req.query.name, $options: 'i' }
  });
  const doc = await ShopItem.find({ category: cate._id });

  res.status(200).json({
    status: 'success',
    data: doc
  });
});
