const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const renewTourStartDate = require('../utils/renewTourStartDate');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // This is just a trick to automatically renew the tour start date as time goes by
  const newTours = tours.map((tour) => renewTourStartDate(tour));

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: newTours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // This is just a trick to automatically renew the tour start date as time goes by
  const newTour = renewTourStartDate(tour);

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour: newTour,
  });
});

exports.getLoginForm = (req, res) => {
  if (res.locals.user) {
    res.redirect('/');
  } else {
    res.status(200).render('login', {
      title: 'Log into your account',
    });
  }
};

exports.getSignUpForm = (req, res) => {
  if (res.locals.user) {
    res.redirect('/');
  } else {
    res.status(200).render('signup', {
      title: `Create New Account`,
    });
  }
};

exports.getForgotPasswordForm = (req, res) => {
  if (res.locals.user) {
    res.redirect('/');
  } else {
    res.status(200).render('forgotpassword', {
      title: `Input your account email to reset password`,
    });
  }
};

exports.getResetPasswordForm = (req, res) => {
  if (res.locals.user) {
    res.redirect('/');
  } else {
    res.status(200).render('resetpassword', {
      title: `Reset your password`,
      token: req.query.token,
    });
  }
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  const tours = bookings.map((booking) => {
    const { price, tour: bookingTour, startDate } = booking;
    bookingTour.price = price;
    bookingTour.startDates = [startDate];
    return bookingTour;
  });

  // 2) Find tours with the returned IDs
  // const tourIDs = bookings.map((el) => el.tour.id);
  // const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('mybooking', {
    title: 'My Tours',
    tours,
  });
});

exports.getMyTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const booking = await Booking.findOne({ tourSlug: req.params.slug }).populate(
    {
      path: 'reviews',
      fields: 'review rating user',
    }
  );

  if (!booking) {
    return next(new AppError('There is no booking tour with that name.', 404));
  }

  const newTour = booking.tour;
  newTour.price = booking.price;
  newTour.startDates = [booking.startDate];
  newTour.reviews = booking.reviews;
  newTour.booking = true;

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${newTour.name} Tour`,
    tour: newTour,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
