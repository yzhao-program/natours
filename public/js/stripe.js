/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId, startDateString) => {
  try {
    // 1) Get checkout session from API
    const session = await axios({
      method: 'POST',
      url: `/api/v1/bookings/checkout-session`,
      data: { tourId, startDateString },
    });
    // console.log(session);

    const stripe = Stripe(
      'pk_test_51MVpSkJAl7U5yZWAeFQ30kH4aUjTEUQpxutLuH0VoeRMftEOJm68VtEllcqXwAgrlhcGrb5vDyGCZdOMlpbCAG8e00UiSqbMw5'
    );

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
