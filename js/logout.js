/**
 * This asynchronous function handles user logout. It retrieves the current user name, sets it to an empty string,
 * and then redirects the user to 'index.html'.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Returns a Promise that resolves when the process is complete. No return value.
 */
async function logout(){
    currentUserName = 'noaccess';
    await setItem('currentUserName', currentUserName);
    window.location.href = 'index.html';
}