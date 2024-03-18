/**
 * This function validates user input. It ensures all fields are filled and the name contains both first and last name.
 * If a field is not valid, it displays an information box under the input field.
 *
 * @function
 * @returns {boolean} Returns true if all inputs are valid, false otherwise.
 */
function validateInput(email, password, loginname) {
    // Überprüfen Sie, ob alle Felder ausgefüllt sind
    if (email.value === '' || password.value === '' || loginname.value === '') {
        alert('Bitte füllen Sie alle Felder aus.');
        return false;
    }

    // Überprüfen Sie, ob der Name sowohl den Vornamen als auch den Nachnamen enthält
    let nameParts = loginname.value.split(' ');
    if (nameParts.length < 2) {
        alert('Bitte geben Sie sowohl Vorname als auch Nachname ein.');
        return false;
    }

    return true;
}


/**
 * This asynchronous function handles user signup. It retrieves user input (name, email, and password), 
 * stores the new user details, and redirects to 'index.html' once the process is complete. 
 * 
 * @async
 * @function
 * @returns {Promise<void>} Returns a Promise that resolves when the signup process is complete. No return value.
 */
async function loginSignUp(){
    data = JSON.parse(await getItem('userName'));
    let email = document.getElementById('signupEmail');
    let password = document.getElementById('signupPassword');
    let loginname = document.getElementById('signupName');
    let id = Math.random().toString(36).substr(2) + Date.now().toString(36);

    if (!validateInput(email, password, loginname)) {
        return;
    }
      
    data.push({ name: loginname.value, email: email.value, password: password.value, id: id });
    
    await setItem('userName', JSON.stringify(data));

    await cleanUpData();
    
    email.value = '';
    password.value = '';
    loginname.value = '';
    replaceButtonWithImageAndRedirect();
}


/**
 * Replaces a login button with an image and redirects to another page after a delay.
 * This function assumes that there is a button with ID 'loginButton' and an image with ID 'loginImage' in the HTML.
 *
 * @function
 */
function replaceButtonWithImageAndRedirect() {
    // Hole den Anmeldeknopf und das Bild
    let button = document.getElementById('loginButton');
    let image = document.getElementById('loginImage');

    // Verstecke den Knopf und zeige das Bild
    button.style.display = 'none';
    image.style.display = 'block';

    // Leite nach einer Verzögerung von 2 Sekunden auf eine andere Seite um
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}


/**
 * Asynchronously cleans up user data, removing any users where the password field is null or empty.
 * This function retrieves the data, filters out invalid users, and then saves the cleaned data back.
 *
 * @async
 * @function
 * @returns {Promise<void>} A Promise that resolves when the data cleaning process is complete. No return value.
 */
async function cleanUpData() {
    let data = JSON.parse(await getItem('userName'));
    let cleanedData = data.filter(user => user.password != null && user.password !== '');
    await setItem('userName', JSON.stringify(cleanedData));
}


/**
 * Displays an error message for a specified duration.
 * This function sets the text content of an HTML element to a specified message, and then clears the message after a delay.
 *
 * @function
 * @param {string} elementId - The ID of the HTML element where the error message is to be displayed.
 * @param {string} message - The error message to be displayed.
 */
function displayError(elementId, message) {
    let element = document.getElementById(elementId);
    element.textContent = message;
    setTimeout(() => {
        element.textContent = '';
    }, 2000);
}


/**
 * Validates user input, ensuring that the email, password, and username fields are not empty, 
 * and that the username contains both a first and last name.
 * This function displays an error message under the relevant input field if a field is invalid.
 *
 * @function
 * @param {HTMLInputElement} email - The email input element.
 * @param {HTMLInputElement} password - The password input element.
 * @param {HTMLInputElement} loginname - The username input element.
 * @returns {boolean} Returns true if all input fields are valid, false otherwise.
 */
function validateInput(email, password, loginname) {
    let isValid = true;
    if (email.value === '') {
        displayError('emailError', 'Please fill out the email field.');
        isValid = false;
    }
    if (password.value === '') {
        displayError('passwordError', 'Please fill out the password field.');
        isValid = false;
    }
    let nameParts = loginname.value.split(' ');
    if (nameParts.length < 2) {
        displayError('nameError', 'Please enter both first and last name.');
        isValid = false;
    }
    return isValid;
}