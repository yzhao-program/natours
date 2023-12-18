const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get(
  '/forgotpassword',
  authController.isLoggedIn,
  viewsController.getForgotPasswordForm
);
router.get(
  '/resetpassword',
  authController.isLoggedIn,
  viewsController.getResetPasswordForm
);
router.get('/me', authController.protect, viewsController.getAccount);

router.get(
  '/my-tours',
  // bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours
);

router.get(
  '/my-tours/:slug',
  authController.isLoggedIn,
  viewsController.getMyTour
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
