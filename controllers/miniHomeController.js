const factory = require('./handlerFactory');
const MiniHome = require('../models/miniHomeModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// exports.getAllMiniHomes = factory.getAll(MiniHome);
exports.getMiniHome = factory.getOne(MiniHome);
exports.createMiniHome = factory.createOne(MiniHome);
exports.updateMiniHome = factory.updateOne(MiniHome);
exports.deleteMiniHome = factory.deleteOne(MiniHome);

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
