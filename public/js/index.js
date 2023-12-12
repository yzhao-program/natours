/* eslint-disable */
import { displayMap } from './mapLeaflet';
import { login, logout } from './login';
import { forgotPassword } from './forgotPassword';
import { updateSettings } from './updateSettings';
import { signup } from './signup';
import { bookTour } from './stripe';

// DOM ELEMENTS
const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const forgotPasswordForm = document.querySelector('.form--forgotpassword');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPhotoUpload = document.querySelector('.form__upload');
const userPasswordForm = document.querySelector('.form-user-password');
const signupForm = document.querySelector('.form--signup');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (leaflet) {
  const locations = JSON.parse(leaflet.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (forgotPasswordForm)
  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    await forgotPassword(email);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    // form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });

if (userPhotoUpload) {
  userPhotoUpload.addEventListener('change', async (e) => {
    const form = new FormData();
    form.append('photo', document.getElementById('photo').files[0]);

    const newImage = await updateSettings(form, 'photo');

    if (newImage) {
      document
        .querySelector('.nav__user-img')
        .setAttribute('src', `/img/users/${newImage}`);
      document
        .querySelector('.form__user-photo')
        .setAttribute('src', `/img/users/${newImage}`);
    }
  });
}

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    signup(name, email, password, confirmPassword);
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
