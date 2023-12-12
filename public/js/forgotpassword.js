/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Email was sent successfully! Please check your email inbox. This page will be redirected to the login page in a few seconds.'
      );
      window.setTimeout(() => {
        location.assign('/login');
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
