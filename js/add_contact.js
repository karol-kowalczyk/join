/**
 * Opens the "add-contact" modal by adjusting its position on the screen.
 * Prior to opening, it resets the modal to its initial state.
 */
function openModalAddContakt() {
    resetModal();
    document.getElementById('add-contakt-modal').style.right = '0';
}


/**
 * Closes the "add-contact" modal by moving it off the visible screen area.
 */
function closeModal(){
    document.getElementById('add-contakt-modal').style.right = '-200%';
}


/**
 * Asynchronously creates a new contact based on the input values from the DOM.
 * It validates the input fields (name, email, and phone) and adds the contact if valid.
 * After adding, it reloads the contacts and the current window.
 *
 * @async
 * @returns {Promise<void>} Resolves once the contact has been added and the subsequent operations have completed.
 */
async function createContact() {
    let id = generateId();
    let colorIcon = getRandomColor();
    let nameInput = document.getElementById('contactName');
    let emailInput = document.getElementById('contactEmail');
    let phoneInput = document.getElementById('contactPhone');
    clearErrorMessages();

    if (!isValid('name', nameInput.value)) {
        displayError(nameInput, 'Please enter first and last name separated by a space.');
        return;
    }

    if (!isValid('email', emailInput.value)) {
        displayError(emailInput, 'Please enter a valid email address.');
        return;
    }

    if (!isValid('phone', phoneInput.value)) {
        displayError(phoneInput, 'Please enter only numbers for the phone.');
        return;
    }
    
    const contact = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        id: id,
        colorIcon: colorIcon
    }

    await addContact(contact);
    getContacts();
    closeModal();
    window.location.reload();
}


/**
 * Generates a unique identifier by combining a random string and the current timestamp.
 * 
 * @returns {string} A unique string identifier.
 */
function generateId() {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
}


/**
 * Clears all elements with the class name "error-message" from the DOM.
 */
function clearErrorMessages() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}


/**
 * Validates the provided input based on its type (name, email, or phone).
 * 
 * @param {string} type - The type of the input ("name", "email", or "phone").
 * @param {string} value - The value to be validated.
 * @returns {boolean} `true` if the value is valid, `false` otherwise.
 */
function isValid(type, value) {
    let regex;

    switch (type) {
        case 'name':
            regex = /^[a-z]+\s[a-z]+$/i;
            break;
        case 'email':
            regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            break;
        case 'phone':
            regex = /^\d+$/;
            break;
        default:
            return false;
    }

    return regex.test(value);
}


/**
 * Displays an error message next to the specified input element.
 * 
 * @param {Element} inputElement - The DOM element (input field) where the error occurred.
 * @param {string} message - The error message to be displayed.
 */
function displayError(inputElement, message) {
    let errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.color = 'red';
    errorMessage.textContent = message;
    inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);
}


/**
 * Adds a new contact to the storage (presumably local storage).
 * Retrieves the current list of contacts, adds the new contact, and then updates the storage.
 * 
 * @param {Object} contact - The contact object to be added.
 * @requires getItem - A function that retrieves a stored item by its key.
 * @requires setItem - A function that stores an item by its key.
 */
async function addContact(contact) {
    let contacts = JSON.parse(await getItem('contacts')) || [];
    contacts.push(contact);
    await setItem('contacts', JSON.stringify(contacts));
}


/**
 * Sets the value of an HTML element.
 * @param {string} id - The ID of the HTML element.
 * @param {string} value - The new value to be set.
 */
function setValue(id, value) {
    document.getElementById(id).value = value;
}


/**
 * Toggles a class for an HTML element.
 * @param {string} id - The ID of the HTML element.
 * @param {string} className - The class to be toggled.
 * @param {boolean} shouldAdd - If true, adds the class, otherwise removes it.
 */
function toggleClass(id, className, shouldAdd) {
    const element = document.getElementById(id);
    shouldAdd ? element.classList.add(className) : element.classList.remove(className);
}


/**
 * Resets the modal by clearing input fields and toggling visibility of buttons.
 * Changes the header text to default values.
 */
function resetModal() {
    setValue('contactName', '');
    setValue('contactEmail', '');
    setValue('contactPhone', '');

    toggleClass('btn-add', 'displaynone', false);
    toggleClass('btn-edit', 'displaynone', true);

    setValue('header-add-edit', 'Add');
    setValue('header-text', 'Tasks are better with a team!');
}


/**
 * Renders an action button for a contact.
 * @param {string} contactString - The stringified contact object.
 * @param {string} action - The action for the button.
 * @return {string} The HTML string for the action button.
 */
function renderActionButton(contactString, action) {
    let imgPath = action === 'edit' ? './assets/img/edit.png' : './assets/img/delete.png';
    let actionFunction = action === 'edit' ? 'openModalEditContakt' : 'deleteContact';

    return /*html*/ `
        <div onclick="${actionFunction}(${contactString})" class="contact-body-header-${action}">
            <img src="${imgPath}" alt="">
            ${action.charAt(0).toUpperCase() + action.slice(1)}
        </div>
    `;
}


/**
 * Renders a contact.
 * @param {Object} contact - The contact to render.
 * @param {string} initials - The initials of the contact name.
 * @return {string} The HTML string for the contact.
 */
function renderContact(contact, initials, color = getRandomColor()) {
    let contactString = JSON.stringify(contact).replace(/"/g, '&quot;');
    return /*html*/`
         <div class="contact-header">
            <div class="contact-header-icon" style="background-color: ${contact.colorIcon};">${initials}</div>
            <div>
                <div class="contact-header-name">${contact.name}</div>
                <div class="contact-header-add-task">
                    ${renderActionButton(contactString, 'edit')}
                    ${renderActionButton(contactString, 'delete')}
                </div>
            </div>
        </div>
        <div class="contact-body">
            <div class="contact-body-header">
                <div class="contact-body-header-title">Contact Information</div>
            </div>
            <div class="contact-body-item">
                <div class="contact-body-item-title">Email</div>
                <div class="contact-body-item-value-email">${contact.email}</div>
            </div>
            <div class="contact-body-item">
                <div class="contact-body-item-title">Phone</div>
                <div class="contact-body-item-value">${contact.phone}</div>
            </div>
        </div>
    `;
}


/**
 * Shows the selected contact in a right panel.
 * @param {number} index - The index of the contact in the contacts array.
 */
function applyStyles(element, styles) {
    Object.assign(element.style, styles);
}


function resetStyles(element) {
    element.removeAttribute('style');
}


/**
 * Displays a specific contact's details based on the provided index.
 * Adjusts the view and styling based on the current window width (responsive design).
 * 
 * @param {number} index - The index of the contact in the contactsArray to be displayed.
 * 
 * @requires applyStyles - A function that sets multiple styles to a given DOM element.
 * @requires resetStyles - A function that resets styles of a given DOM element.
 * @requires getInitials - A function that retrieves the initials of a provided name.
 * @requires renderContact - A function that renders contact details.
 * 
 * @example
 * showContact(5); // Displays the details of the contact at index 5.
 */
function showContact(index) {
    const contactMobile = document.getElementById('contact-m');
    const contact = contactsArray[index];
    const contactContent = document.getElementById('contact-content');
    const back = document.getElementById('back-to-contancts');
    
    contactContent.style.right = '0';
    contactContent.innerHTML = renderContact(contact, getInitials(contact.name).join(''));
    
    if(window.innerWidth <= 1024) {
        applyStyles(contactMobile, {
            display: 'flex',
            width: '100%',
            height: '100%',
            position: 'fixed',
            left: '0',
            right: '0',
            top: '0',
            zIndex: '1100',
            backgroundColor: '#F6F7F8',
            alignItems: 'center',
            justifyContent: 'center'
        });

        applyStyles(back, {
            display: 'block',
            position: 'absolute',
            top: '120px',
            right: '60px'
        });
        
        back.addEventListener('click', () => {
            resetStyles(contactMobile);
            resetStyles(back);
        });
    }
}




/**
 * Deletes a contact from the contacts list in LocalStorage and refreshes the contacts list and the page.
 * @param {Object} contact - The contact to be deleted.
 * @async
 */
async function deleteContact(contact) {
    try {
        let contacts = JSON.parse(await getItem('contacts')) || [];
        contacts = contacts.filter(item => item.id !== contact.id);
        await setItem('contacts', JSON.stringify(contacts));
        getContacts();
        window.location.reload();
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}


/**
 * Generates a random RGB color.
 * @return {string} The random RGB color.
 */
function getRandomColor() {
    const colorValues = Array.from({length: 3}, () => Math.floor(Math.random() * 256));
    return `rgb(${colorValues.join(', ')})`;
}



/**
 * Generates the HTML for a contact block.
 * @param {Object} contact - The contact object.
 * @param {string} firstInitial - The first initial of the contact's name.
 * @param {string} secondInitial - The second initial of the contact's name.
 * @param {string} color - The color for the contact icon.
 * @param {number} contactIndex - The index of the contact in the contacts array.
 * @return {string} The HTML string for the contact block.
 */
function renderContactBlock(contact, firstInitial, secondInitial, color, contactIndex) {
    return /*html*/`
        <div onclick="showContact(${contactIndex})" class="contacts-list-item">
            <div class="contact-list-icon" style="background-color: ${contact.colorIcon};">
                ${firstInitial.toUpperCase()}${secondInitial.toUpperCase()}    
            </div>
            <div>
                <div class="contacts-list-item-name">${contact.name}</div>
                <div class="contacts-list-item-email">${contact.email}</div>
            </div>
        </div>`;
}

/**
 * Fetches contacts from Storage, sorts them, generates the corresponding HTML and inserts it into the contact list.
 * @async
 */
async function getContacts() {
    const contactList = document.getElementById('contacts-list');
    let contacts = JSON.parse(await getItem('contacts')) || [];
    contacts = contacts.filter(contact => contact.name);
    contacts.sort((a, b) => a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}))

    let lastInitial = '';
    let htmlString = contacts.reduce((acc, contact) => {
        const [firstInitial, secondInitial] = getInitials(contact.name);
        const color = getRandomColor();
        const initialBlock = firstInitial.toUpperCase() !== lastInitial 
            ? `<div class="contact-list-first-latter">${firstInitial.toUpperCase()}</div><hr class="contact-list-hr">` 
            : '';

        lastInitial = firstInitial.toUpperCase();
        contactsArray.push(contact); 
        const contactIndex = contactsArray.length - 1;
        const contactBlock = renderContactBlock(contact, firstInitial, secondInitial, color, contactIndex);

        return acc + initialBlock + contactBlock;
    }, '');

    contactList.innerHTML = htmlString;
}


/**
 * Gets the initials of a name.
 * @param {string} name - The name.
 * @return {Array} An array with the first and second initial.
 */
function getInitials(name) {
    const [firstWord = '', secondWord = ''] = name.split(' ');
    return [firstWord[0] || '', secondWord[0] || ''];
}