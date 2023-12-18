const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  tourSlug: {
    type: String,
    require: [true, 'Booking must have a tour slug'],
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.'],
  },
  startDate: {
    type: Date,
    require: [true, `Booking must have a start date of the tour`],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.index({ tourSlug: 1 }, { unique: true });
bookingSchema.index({ user: 1 });

// Virtual populate
bookingSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: 'tour',
});

bookingSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: '-__v' }).populate({
    path: 'tour',
    select: '-__v -price -startDates',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
