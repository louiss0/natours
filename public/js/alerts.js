/* eslint-disable */

export const hideAlert = (el) => {
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {

  if (!["success", "error"].includes(type)) {
    
    return console.error(`Type must be either success or error not 
    ${type} `)
  }

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.body.insertAdjacentHTML('afterbegin', markup);

};
