/**
 * This asynchronous function handles password reset for a user. It retrieves the user's email,
 * checks it against stored users, and redirects to 'newpassword.html' if a match is found.
 * The email of the user who wishes to reset the password is stored locally.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Returns a Promise that resolves when the process is complete. No return value.
 */
async function resetMail() {
    let email = document.getElementById('resetEmail');

    // Validate input
    if (email.value === '') {
        displayError('emailError', 'Please fill out the email field.');
        return;
    }

    let data = JSON.parse(await getItem('userName'));
    let currentUser = Array.isArray(data) ? data.filter(user => user.email === email.value) : [];
    
    let button = document.getElementById('submitButton'); 
    let image = document.getElementById('successImage'); 

    if(currentUser.length > 0) {
        await setItem('currentEmail', email.value);
        button.style.display = 'none';
        image.classList.add('show');
        setTimeout(() => {
            window.location.href = 'newpassword.html';
        }, 2000);
    } else {
        displayError('emailError', 'E-Mail nicht gefunden');
        email.value = '';
    }
}