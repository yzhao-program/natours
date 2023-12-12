/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

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