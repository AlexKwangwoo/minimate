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
const MiniHomePhoto = require('../models/miniHomePhotoModel');

exports.getAllMiniHomePhotos = factory.getAll(MiniHomePhoto);

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

exports.uploadPhotoImagesToFolder = upload.array('images', 1);
exports.insertPhotoImagesLinks = (req, res, next) => {
  if (!req.files) return next();
  const images = [];
  req.files.forEach(file => {
    images.push(file.location);
  });
  req.body.images = images;
  next();
};

exports.updatePictureToPhotoFolder = catchAsync(async (req, res, next) => {
  // console.log('req.body.images', req.body.images);
  const doc = await MiniHomePhoto.create({
    ...req.body,
    photo_url: req.body.images[0]
  });

  res.status(200).json({
    status: 'success',
    data: doc
  });
});

exports.deleteMiniHomePhoto = factory.deleteOne(MiniHomePhoto);
