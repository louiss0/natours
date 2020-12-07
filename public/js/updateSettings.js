/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {


  try {
    const endpoint =
      type === 'password'
        ? 'update-my-password'
        : 'update-me';

    const res = await axios({
      method: 'PATCH',
      url:`http://127.0.0.1:3000/api/v1/users/${endpoint}`,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);

  } finally {
    const  alertEl = document.querySelector('.alert');
  
    hideAlert(alertEl)
  }
};
