/**
 * Fetches the current user from the storage and updates their password.
 * @param {string} email - The email of the current user.
 * @param {string} newPw - The new password.
 * @return {Promise<void>} An empty Promise.
 */
async function updatePassword(email, newPw) {
    const data = JSON.parse(await getItem('userName'));
    const currentUser = Array.isArray(data) ? data.filter(user => user.email === email) : [];
    currentUser[0].password = newPw;
    await setItem('userName', JSON.stringify(data));
}


/**
 * Shows the success message and redirects the user to the home page after 2 seconds.
 * @param {HTMLElement} button - The submit button of the form.
 * @param {HTMLElement} image - The image that is displayed on success.
 */
function showSuccessAndRedirect(button, image) {
    button.style.display = 'none';
    image.classList.add('show');

    setTimeout(function () {
        window.location.href = 'index.html';
    }, 2000);
}


/**
 * Shows an error if the passwords do not match and resets the form.
 * @param {HTMLInputElement} newPw - The input field for the new password.
 * @param {HTMLInputElement} confirm - The input field for the password confirmation.
 */
function showErrorAndReset(newPw, confirm) {
    displayError('newPwError', 'Die Passwörter stimmen nicht überein');
    displayError('confirmError', 'Die Passwörter stimmen nicht überein');
    newPw.value = '';
    confirm.value = '';
}


/**
 * This function checks if the passwords match and updates the password or shows an error accordingly.
 */
async function reset() {
    const newPw = document.getElementById('newPw');
    const confirm = document.getElementById('confirm');
    const email = await getItem('currentEmail');
    const button = document.getElementById('submitButton');
    const image = document.getElementById('successImage');

    if (newPw.value === '' || confirm.value === '') {
        if (newPw.value === '') displayError('newPwError', 'Please fill out the password field.');
        if (confirm.value === '') displayError('confirmError', 'Please fill out the password confirmation field.');
        return;
    }

    if (newPw.value === confirm.value) {
        await updatePassword(email, newPw.value);
        showSuccessAndRedirect(button, image);
    } else {
        showErrorAndReset(newPw, confirm);
    }
}