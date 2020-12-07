/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';
let alertEl = document.querySelector('.alert');

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/log-in',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');


      window.setTimeout(() => {
        location.assign('/');
      }, 1500);


    }
  } catch (err) {
    showAlert('error', err.response.data.message);
     
    alertEl = document.querySelector('.alert');
    
    setTimeout(() => {
      hideAlert(alertEl)
    }, 500)
    
  
  }  
};

export const logout = async () => {
  
  try {
  
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/log-out'
    });
  
  
    if ((res.data.status = 'success')) location.assign("/");
  
  } catch (err) {
    
    console.log(err.response);
    
    showAlert(alertEl, 'error', 'Error logging out! Try again.');
    
    setTimeout(() => {
      hideAlert(alertEl)
    }, 500)
  }
};
