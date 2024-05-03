const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.route('/').get(userController.getAllUsers);

// Protect all routes after this middleware
// 이밑으로는 다 유저로그인 상태에서만 가능!
router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/myProfile', authController.updateMyProfile);

router.get('/me', userController.getMe, userController.getUser);
// router.patch(
//   '/me/picture',
//   userController.uploadUserImages,
//   userController.insertUserImagesLinks,
//   userController.updatePictureToUser
// );

// router
//   .route('/me/wishlist')
//   .get(userController.myWishlist)
//   .patch(userController.updateMyWishlist);

// // router.patch('/me/wishlist', userController.updateMyWishlist);
// router.patch('/me/promotion', userController.updateMyPromotion);

// // multer는 multi form 방식을 지원한다!
// router.patch('/updateMe', userController.updateMe);
// router.delete('/deleteMe', userController.deleteMe);

// // 이밑으로 라우터는 유저만 가능!
// router.use(authController.restrictTo('admin'));

router.route('/state/:id').patch(userController.updateUserState);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
