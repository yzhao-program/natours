const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.isEditableReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (req.user.role === 'admin') {
    next();
  }

  if (review.user.id === req.user.id) {
    next();
  }

  return next(new AppError(`You cannot edit someone's else review.`, 401));
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
