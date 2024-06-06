const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const History = require('../models/historyModel');
const Cart = require('../models/cartModel');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getAllHistories = factory.getAll(History);
exports.getHistory = factory.getOne(History);
// exports.createHistory = factory.createOne(History);
exports.updateHistory = factory.updateOne(History);
exports.deleteHistory = factory.deleteOne(History);

exports.createHistory = catchAsync(async (req, res, next) => {
  const cartExist = await Cart.find({
    _id: req.body.cartId
  });

  if (cartExist.length === 0) {
    return next(new AppError('This cart does not exist', 404));
  }

  if (!cartExist[0].user._id.equals(req.user.id)) {
    return next(new AppError('This cart is not yours', 404));
  }

  if (cartExist[0].total_price > req.user.point) {
    return next(new AppError('You do not have enough point', 404));
  }
  // const doc = await ReviewRoom.create(req.body);

  // eslint-disable-next-line camelcase
  const shop_item_restructured = [];

  console.log('cartExist', cartExist[0].shop_items);

  cartExist[0].shop_items.forEach(each => {
    const temp = {
      item_name: each.item_name,
      item_price: each.item_price,
      category: each.category ? each.category.name : null
    };
    shop_item_restructured.push(temp);
  });

  const historyObject = {
    user: cartExist[0].user._id,
    shop_items: shop_item_restructured,
    total_price: cartExist[0].total_price,
    total_qty: cartExist[0].total_qty
  };

  const doc = await History.create(historyObject);
  await Cart.findByIdAndDelete(req.body.cartId);
  await User.findByIdAndUpdate(
    req.user.id,
    { point: req.user.point - cartExist[0].total_price },
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
