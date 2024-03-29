const Stripe = require('stripe');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Email = require('../utils/email');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const { tourId, startDateString } = req.body;
  const tour = await Tour.findById(tourId);
  if (!tour) return next(new AppError('Tour not found!', 404));
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  // console.log(tour);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get(
    //   'host'
    // )}/my-tours/?tour=${tourId}&user=${req.user.id}&price=${
    //   tour.price
    // }&startDateString=${startDateString}&tourSlug=${tour.slug}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: tourId,
    mode: 'payment',
    metadata: {
      startDateString: startDateString,
      tourSlug: tour.slug,
      userId: req.user.id,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
          },
        },
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
//   const { tour, user, price, startDateString, tourSlug } = req.query;

//   if (!tour || !user || !price || !startDateString || !tourSlug) return next();

//   const userObject = await User.findById(user);
//   if (!userObject) {
//     return next(new AppError(`There is no user with this id: ${user}`, 404));
//   }

//   const startDate = new Date(startDateString);
//   await Booking.create({ tour, user, price, startDate, tourSlug });

//   const myToursUrl = `${req.protocol}://${req.get('host')}/my-tours`;

//   await new Email(userObject, myToursUrl).sendBookingConfirmation();

//   res.redirect(req.originalUrl.split('?')[0]);
// });

exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const tour = session.client_reference_id;
    const price = session.amount_total / 100;

    const {
      startDateString,
      tourSlug: tourSlugWithoutBookingTime,
      userId: user,
    } = session.metadata;

    const userObject = await User.findById(user);
    if (!userObject) {
      return next(new AppError(`There is no user with this id: ${user}`, 404));
    }

    const startDate = new Date(startDateString);
    const tourSlug = `${tourSlugWithoutBookingTime}-${Date.now().toString()}`;

    await Booking.create({ tour, user, price, startDate, tourSlug });

    const myToursUrl = `${req.protocol}://${req.get('host')}/my-tours`;

    await new Email(userObject, myToursUrl).sendBookingConfirmation();
  }

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
