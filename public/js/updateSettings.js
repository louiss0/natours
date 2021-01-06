/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
	if (![ 'success', 'error' ].includes(type)) {
		return console.warn('type can only be success or error');
	}

	try {
		const endpoint = type === 'password' ? 'update-my-password' : 'update-me';

		const res = await axios({
			method: 'PATCH',
			url: `/api/v1/users/${endpoint}`,
			data
		});

		if (res.data.status === 'success') {
			showAlert('success', `${type.toUpperCase()} updated successfully!`);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	} finally {
		const alertEl = document.querySelector('.alert');

		hideAlert(alertEl);
	}
};
