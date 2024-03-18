/** 
 * Sets the right CSS property of an element with a given id
 * @param {string} id - id of the HTML element 
 * @param {string} value - The new right CSS property value
 */
function setElementRightProperty(id, value) {
    document.getElementById(id).style.right = value;
}


/** 
 * Updates the innerHTML property of an element with a given id
 * @param {string} id - id of the HTML element 
 * @param {string} value - The new innerHTML property value
 */
function updateElementHTML(id, value) {
    document.getElementById(id).innerHTML = value;
}


/** 
 * Toggles the visibility of a button
 * @param {string} id - id of the HTML element 
 */
function toggleButtonVisibility(id) {
    let button = document.getElementById(id);
    button.classList.toggle('displaynone');
}


/**
 * Updates the contact form fields with the contact details
 * @param {Object} contact - The contact object
 */
function updateContactFormFields(contact) {
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactEmail').value = contact.email;
    document.getElementById('contactPhone').value = contact.phone;
}


/** 
 * Opens the modal to edit a contact.
 * @param {Object} contact - The contact object to edit.
 */
function openModalEditContakt(contact){
    currentContact = contact;

    setElementRightProperty('add-contakt-modal', '0');
    updateContactFormFields(currentContact);

    toggleButtonVisibility('btn-add');
    toggleButtonVisibility('btn-edit');

    updateElementHTML('header-add-edit', 'Edit');
    updateElementHTML('header-text', '');
}


/** 
 * Updates the current contact object with the data from the form fields
 */
function updateCurrentContact() {
    let contactName = document.getElementById('contactName');
    let contactEmail = document.getElementById('contactEmail');
    let contactPhone = document.getElementById('contactPhone');

    currentContact.name = contactName.value; 
    currentContact.email = contactEmail.value; 
    currentContact.phone = contactPhone.value; 
}


/** 
 * Saves the edited contact.
 * @async
 */
async function saveContact(){
    updateCurrentContact();

    if (!validateContact(currentContact)) {
        return;
    }

    let contacts = JSON.parse(await getItem('contacts'));
    let index = contacts.findIndex(item => item.id === currentContact.id);
    if (index !== -1) {
        contacts[index] = currentContact;
    }

    
    await setItem('contacts', JSON.stringify(contacts));

    getContacts();
    closeModal();
    currentContact = null; 
    window.location.reload();
}


/**
 * Validates the provided contact information (name, email, and phone).
 *
 * @param {Object} contact - The contact details to validate.
 * @param {string} contact.name - The full name of the contact.
 * @param {string} contact.email - The email address of the contact.
 * @param {string} contact.phone - The phone number of the contact.
 * @returns {boolean} Returns true if all contact details are valid; otherwise returns false.
 */
function validateContact(contact) {
    let isValidFlag = true;

    const fields = ['name', 'email', 'phone'];
    for (let field of fields) {
        if (!isValid(field, contact[field])) {
            document.getElementById(`contact${capitalizeFirstLetter(field)}Error`).innerText = getErrorMessage(field);
            document.getElementById(`contact${capitalizeFirstLetter(field)}Error`).style.display = 'block';
            document.getElementById(`contact${capitalizeFirstLetter(field)}Error`).style.color = 'red';
            isValidFlag = false;
        } else {
            document.getElementById(`contact${capitalizeFirstLetter(field)}Error`).style.display = 'none';
        }
    }

    return isValidFlag;
}


/**
 * Capitalizes the first letter of the provided string.
 *
 * @param {string} string - The string to capitalize.
 * @returns {string} Returns the string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


/**
 * Provides an appropriate error message based on the type of validation error.
 *
 * @param {'name' | 'email' | 'phone'} type - The type of validation error (e.g., 'name', 'email', 'phone').
 * @returns {string} Returns a descriptive error message for the given error type.
 */
function getErrorMessage(type) {
    switch (type) {
        case 'name':
            return 'Please enter first and last name separated by a space.';
        case 'email':
            return 'Please enter a valid email address.';
        case 'phone':
            return 'Please enter only numbers for the phone.';
        default:
            return '';
    }
}
