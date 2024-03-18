/**
 * pre sets the arrays whit values. This function can also be used to reset every array
 */
function initArrays() {
    categorys = [{
            'category': 'Sales',
            'color': 'pink',
        },
        {
            'category': 'Backoffice',
            'color': 'mint',
        }
    ]
    getContaktfromBackend();
    emails = [];
    subtasks = [];
}
async function getContaktfromBackend() {
    let tasks = JSON.parse(await getItem('contacts'));
    tasks.forEach(task => {
        let names = task.name.split(" ");
        let contact = {
            'first-name': names[0],
            'last-name': names[1],
            'checked?': 'unchecked',
            'color': task.colorIcon,
        };
        contactsForAddTask.push(contact);
    });

    return contactsForAddTask;
}
// Functions for Category Dropdown menu

/**
 * This functions is used to open and close the dropdown menus
 * @param {string} menuClass - this is the class of the menu, givin in the HTML,  
 * that you want to open and close
 * 
 */
function toggleDropdown(menuClass) {
    const dropdownMenu = document.getElementsByClassName(menuClass)[0];
    if (newCategoryStatus || assingedToStatus === true) {

    } else {
        if (dropdownMenu.style.height === '51px') {
            dropdownMenu.style.height = '204px';
            dropdownMenu.style.overflow = 'scroll'
        } else {
            dropdownMenu.style.height = '51px';
            dropdownMenu.style.overflow = 'hidden'
        }
    }
}

/**
 * Renders the categorys to the dropdown menu
 */
function renderCategorys() {
    let categorysContainer = document.getElementById('categorys')

    categorysContainer.innerHTML = ""
    for (let i = 0; i < categorys.length; i++) {
        let categoryName = categorys[i].category;
        let categoryColor = categorys[i].color


        categorysContainer.innerHTML += ` 
    
    <div onclick="selectTaskCategory(${i})" id="s${i}" class="dropdown-option category">${categoryName} <div class="circle-${categoryColor}"></div>
    </div>`

    }

}
/**
 * This function adds an input to addNewCcategory
 * @param {string} display1 - is important for the toggleInput() function
 * it will be used to change the style: display 
 */
function newCategory(display1) {
    showNewCotegory()
    prepareInput(display1)
    toggleColorPallete('flex')
}

/**
 * shows the inputfield and execute some comfort functions
 * @param {*} display1 -is important for the toggleInput() function
 * it will be used to change the style display 
 */
function prepareInput(display1) {
    toggleInput(display1, 'input-container')
    toggleDropdown('dropdown-category')
    document.getElementById('new-category-input').focus()
    newCategoryStatus = true
}
/**
 * Toggles the choose color bar under the input
 * @param {string} action - needs none or flex to toggle the color palette
 */
function toggleColorPallete(action) {
    let colors = document.getElementById('colors-container')
    colors.style.display = `${action}`
}
/**
 * 
 * @param {string} display1 -need flex or none to change the display style
 * @param {string} containerID -the ID of the input you want to toggle
 */
function toggleInput(display1, containerId) {
    let inputContainer = document.getElementById(`${containerId}`)
    inputContainer.style.display = `${display1}`
}
/**
 * Adds new Category to the top of the Dropdownmenu
 */
function showNewCotegory() {
    let selectBox = document.getElementById('select-box')
    clearSelectBox('select-box')
    selectBox.innerHTML = `     
  <div id="input-container" class="dropdown-option" style="display: none;">
  <input id="new-category-input" class="caption inputFrame"
      placeholder="New Category Name" type="text">
  <div class="check-container">
      <img onclick="discardNewCategory('none','unset','unset')"
          src="assets/img/icons/dropdown-close-button.svg">
      <img src="assets/img/icons/dropdown-abtrenner.svg">
      <img onclick="addNewCategory()" src="assets/img/icons/dropdown-check-button.svg">
  </div>
</div>
  `
}

/**
 * resets the dropdown menu when new category is open
 * @param {string} display1 -flex or none is needed for the toggleInput()
 */
function discardNewCategory(display1) {
    newCategoryStatus = false
    toggleInput(display1, 'input-container')
    clearSelectBox('select-box')

    toggleColorPallete('none')

}
/**
 * Puts a selected category into the select-box to show it on the top 
 * @param {Array.index} id -needs a index number of the array categorys[] 
 */
function selectTaskCategory(id) {
    let selectBox = document.getElementById('select-box')
    let selected = document.getElementById(`s${id}`)

    if (selectBox.innerHTML.includes(`id="s${id}"`)) {
        clearSelectBox('select-box')
    } else {
        toggleDropdown('dropdown-category')

        clearSelectBox('select-box')
        selectBox.innerHTML += selected.outerHTML
    }
}
/**
 * adds the new catgeory to categorys[] and avoid not choosen colors and no text
 */
function addNewCategory() {
    let input = document.getElementById('new-category-input')
    let value = input.value

    let selectedColor = getSelectedColor();
    if (selectedColor === null) {
        showWarning('Please give your category a color')
    } else if (value == "") {

        showWarning('Please give your category a name')
    } else {
        categorys.push({
            'category': `${value}`,
            'color': `${selectedColor}`,
        })
        renderCategorys()
        selectTaskCategory(categorys.length - 1)
        newCategoryStatus = false
        toggleDropdown('dropdown-category')

        toggleColorPallete('none')
    }


}
/**
 * 
 * @returns the choosen cooler on the color bar and returns null if nothing is choosen
 */
function getSelectedColor() {
    const colors = document.getElementsByName("color");
    for (let i = 0; i < colors.length; i++) {
        if (colors[i].checked) {
            return colors[i].value;
        }
    }
    return null; // Wenn keine Farbe ausgewählt ist

}

/**
 * adds select task category to the top if the select-box is empty
 */
window.addEventListener("click", function() {
    let selectBox = document.getElementById('select-box');
    if (selectBox.innerHTML == "") {
        selectBox.innerHTML = `  <div class="dropdown-option dropdown-start-text">
    <div id="select-task-category" style="display: unset;">Select task category</div>
    <div id="select-task-category-img"><img src="assets/img/vector2.svg"></div>
</div>`;
    }
})


/**
 * deletes everthing inside of the select box
 */
function clearSelectBox(selectbox) {
    let selectBox = document.getElementById(`${selectbox}`)
    selectBox.innerHTML = ""
}
//================= functions for Assinged to ========================

/**
 * checks/unchecks the checkmark
 * @param {string} id - the id of checkmark you clicking on 
 */
function checkButton(id) {

    let checkbox = document.getElementsByClassName(`check-button`)[id]
    let checkboxChecked = document.getElementsByClassName(`check-button-checked`)[id]

    if (checkbox.style.display === 'none') {
        checkbox.style.display = 'unset'
        checkboxChecked.style.display = 'none'

    } else {
        checkbox.style.display = 'none'
        checkboxChecked.style.display = 'unset'
    }
}
/**
 * set the contact on checked/uncheckd in the JSON array
 * @param {id} id - the id of person you clicking on 
 */
function checkInJSON(id) {
    let checkbox = document.getElementsByClassName(`check-button`)[id]
    if (checkbox.style.display === 'unset') {
        contactsForAddTask[id]['checked?'] = 'unchecked'
    } else {
        contactsForAddTask[id]['checked?'] = 'checked'
    }
}
/**
 * renders the contacts form the contactsForAddTask array into to the dropdown
 */
function renderContacts() {
    let contacts = document.getElementById('contacts')
    contacts.innerHTML = "";

    for (let i = 0; i < contactsForAddTask.length; i++) {
        let name = contactsForAddTask[i]["first-name"];
        let lastName = contactsForAddTask[i]["last-name"]


        contacts.innerHTML += `
    <div onclick="checkButton(${i});checkInJSON(${i});renderPersons()" class="dropdown-option dropdown-option-img" id="at${i}">
      ${name} ${lastName}
      <div>
          <img class="check-button" src="assets/img/icons/Check button v1.svg">
          <img style="display: none;" class="check-button-checked" src="assets/img/icons/Check button v1 checked.svg">
      </div>
    </div>`

    }
    renderEmails()
}
/**
 * renders the contacts under the dropdown menu to see wich persons the task is assinged to
 */
function renderPersons() {

    let persons = document.getElementById('assinged-persons-container')
    persons.innerHTML = "";

    for (let i = 0; i < contactsForAddTask.length; i++) {
        if (contactsForAddTask[i]["checked?"] === 'checked') {

            let name = contactsForAddTask[i]["first-name"];
            let lastName = contactsForAddTask[i]["last-name"];
            let color = contactsForAddTask[i]["color"];


            name = name.charAt(0)
            lastName = lastName.charAt(0)

            persons.innerHTML += `
      <div style="background-color: ${color}" class="assinged-person">
                        <Span>${name}${lastName}</Span>
                    </div>
      `;
        } else {}
    }
}
/**
 * eventlistner to fill the selcetbox if its empty with default value
 */
window.addEventListener("click", function() {
    let selectBox2 = document.getElementById('select-box2')
    if (selectBox2.innerHTML == "") {
        selectBox2.innerHTML = /*html*/ `   

    <div class="dropdown-option dropdown-start-text">
    <div id="select-contacts-to-assign" style="display: unset;">Select contacts to assign</div>
    <div id="select-contacts-to-assign-img"><img src="assets/img/vector2.svg"></div>
</div>
    `
    }
})

/**
 * shows the input on dreopdown menu
 */
function showInviteNewContactInput() {

    let selectBox2 = document.getElementById('select-box2')
    clearSelectBox('select-box2')

    selectBox2.innerHTML = /*html*/ `     
  
  <div id="input-container2" class="dropdown-option" style="display: none;">
  <input id="assinged-to-input" class="caption inputFrame"
      placeholder="Contact E-Mail" type="email">
  <div class="check-container">
      <img onclick="discardAssingedTo()"
          src="assets/img/icons/dropdown-close-button.svg">
      <img src="assets/img/icons/dropdown-abtrenner.svg">
      <img onclick="applyNewEmail()" src="assets/img/icons/dropdown-check-button.svg">
  </div>
</div>
  `;

    prepareAssingedToInput()
}

/**
 * some functions to make the input available
 */
function prepareAssingedToInput() {
    toggleInput('flex', 'input-container2')
    toggleDropdown('dropdown-assinged-to')
    assingedToStatus = true
    document.getElementById('assinged-to-input').focus()
}

/**
 * clears the first reiter of the dropdown
 */
function discardAssingedTo() {
    clearSelectBox('select-box2')
    assingedToStatus = false

}

/**
 * checks and appls the email into the emails array
 */
function applyNewEmail() {

    let input = document.getElementById('assinged-to-input')
    let vaildEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (input.value.match(vaildEmail)) {

        emails.push(input.value)

        renderEmails()
        discardAssingedTo()

    } else {
        showWarning('This email is invaild')
    }
}
/**
 * renders the email form the email array into the dropdown
 */
function renderEmails() {
    let emailscontainer = document.getElementById('emails')
    emailscontainer.innerHTML = '<div class="dropdown-option send-email"><b>Send Email to:</b></div>'

    if (emails.length > 0) {
        for (let i = 0; i < emails.length; i++) {
            let email = emails[i]
            index = i + contactsForAddTask.length

            emailscontainer.innerHTML += `
      
      <div onclick="checkButton(${index});" class="dropdown-option dropdown-option-img" id="${index}">
        ${email}
        <div>
            <img style="display: none;" " class="check-button" src="assets/img/icons/Check button v1.svg">
            <img style="display: unset;"  class="check-button-checked" src="assets/img/icons/Check button v1 checked.svg">
        </div>
      </div>`
        }
    }
}
// ===================================Dropdowns Ende============================
/**
 * Changes the background color of the Priority you cklicked on
 * @param {string} id - the id of the prioritybutton 
 * @param {string} priority - the priority you decided on
 */

function changeColor(id, priority) {

    let buttons = document.getElementsByClassName('input-containerPrio');
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const svgPath = button.querySelector('svg');
        const isCurrentButton = button.id === id;

        if (isCurrentButton) {
            svgPath.classList.add('white-color');
            button.querySelector('span').classList.add('txtWhite');
            button.classList.add(priority);
            currentPriority = priority
        } else {
            svgPath.classList.remove('white-color');
            button.querySelector('span').classList.remove('txtWhite');
            button.classList.remove('urgent', 'medium', 'low');
        }
    }
}

/**
 * pushes the text into the subtasks array and creates a new subtask
 */

function addNewSubtask() {
    const inputElement = document.getElementById('newSubtaskInput');
    const inputValue = inputElement.value.trim();
    if (inputValue !== '') {
        if (subtasks.length >= 5) {
            showWarning("You can't create more Subtasks")
        } else {
            subtasks.push(inputValue)
            renderSubtask()
            inputElement.value = ""
        }

    } else {
        showWarning('Please give your Subtask a title')
    }
}

/**
 * renders the subtasks from the subtasks array
 */

function renderSubtask() {

    let container = document.querySelector('#subtaskContainer>ul')
    container.innerHTML = ""

    for (let i = 0; i < subtasks.length; i++) {
        const task = subtasks[i];

        container.innerHTML +=
            `
           
      <li class="subtask">- ${task} <img onclick="deleteSubtask(${i})" src="assets/img/delete.png"></li>
      
    `
    }
}
/**
 * delets a subtask
 * @param {index} i expects a number  
 */
function deleteSubtask(i) {
    subtasks.splice(i, 1)
    renderSubtask()
}

/**
 * clears the complete tasks 
 */
function clearTask() {
    let title = document.getElementById('title')
    let description = document.getElementById('description')
    let date = document.getElementById('date')

    title.value = ""
    description.value = ""
    date.value = ""
    resetPriority()
    initArrays()
    renderPersons()
    renderSubtask()
    clearSelectBox('select-box')
    clearSelectBox('select-box2')
    newCategoryStatus = false
    assingedToStatus = false
}

/**
 * changes colors of prioritys back to default
 */
function resetPriority() {
    let buttons = document.getElementsByClassName('addTaskFrame14Prio');
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const svgPath = button.querySelector('svg');

        button.classList.remove('urgent', 'medium', 'low');
        svgPath.classList.remove('white-color');
        button.querySelector('span').classList.remove('txtWhite');
    }
}


/**
 * creates the task
 */
async function createTask() {
    let titleInput = document.getElementById('title');
    let descriptionInput = document.getElementById('description');
    let dateInput = document.getElementById('date');
    let categoryInput = document.querySelector('#select-box > div');
    let persons = await addPersonsToNewTask();
    let title = titleInput.value.trim();
    let description = descriptionInput.value.trim();
    let date = dateInput.value.trim();
    let category = categoryInput.innerText.trim();
    let taskId = Math.random().toString(36).substr(2) + Date.now().toString(36);

    let color;
    for (let cat of categorys) {
        if (cat.category === category) {
            color = cat.color;
            break;
        }
    }

    if (checkRequierdInputs()) {
        // Erstelle zunächst das neue Aufgabenobjekt
        newTask = [{
            'status': selectedCategory || 'open',
            'title': title,
            'description': description,
            'date': date,
            'category': category,
            'persons': persons,
            'emails': [emails],
            'priority': currentPriority,
            'subtasks': subtasks,
            'taskID': taskId,
            'color': color
        }];

        clearTask();
        createTaskBackend(newTask);
        animations();
    }
}

async function addPersonsToNewTask() {
    let persons = [];

    for (let i = 0; i < contactsForAddTask.length; i++) {
        const contact = contactsForAddTask[i];

        if (contact['checked?'] === 'checked') {
            let firstName = contact['first-name'];
            let lastName = contact['last-name'];
            let color = contact['color'];
            let name = { 'name': `${firstName} ${lastName} ${color}` };

            persons.push(name);
        }
    }

    return persons;
}

// =============== Checking inputs ===================================
/**
 * Checks every input. 
 * @returns true if all inputs aren't empty false if minimum one is empty
 */
function checkRequierdInputs() {
    let checkInputTitle = checkInput('title');
    let checkInputDescription = checkInput('description');
    let checkInputDate = checkInput('date');
    let checkCategorys = checkCategory();
    let checkPrios = checkPrio();

    if (checkInputTitle && checkInputDescription && checkInputDate && checkCategorys && checkPrios) {
        return true;
    } else {
        showWarning('Please fill out all required fields')
        return false;
    }
}
/**
 * shows a message that this field is requierd if no category is selected
 * @returns 
 */
function checkCategory() {
    let categoryInput = document.querySelector('#select-box > div');
    let category = categoryInput.innerText.trim();

    if (category === 'Select task category') {
        showIsRequiered(2, 'remove');
        return false;
    } else {
        if (newCategoryStatus === true) {
            showIsRequiered(2, 'remove');
            return false;
        } else {
            showIsRequiered(2, 'add');
            return true;
        }
    }
}
/**
 * checks if the input is empty and shows a message if it is
 * @param {string} inputs - the id of the input 
 * @returns -true if the input is filled and false if not
 */
function checkInput(inputs) {
    let input = document.getElementById(inputs);
    let inputValue = input.value.trim();
    let index = getRequiredIndex(inputs);

    if (inputValue.length > 0) {
        showIsRequiered(index, 'add');
        return true;
    } else {
        showIsRequiered(index, 'remove');
        return false;
    }
}
/**
 * Is important to show the right "This filed is required" text
 * @param {string} inputs -the id of the input
 * @returns -the index for the right "This filed is required" text position
 */
function getRequiredIndex(inputs) {
    const inputMappings = {
        'title': 0,
        'description': 1,
        'date': 3
    };

    return inputMappings[inputs] || 0; // Fallback to 0 if inputs is not found in the object
}


/**
 * checks if a priority is selected
 * @returns - true if its selected and false if not
 */
function checkPrio() {
    if (currentPriority.length > 0) {
        showIsRequiered(4, 'add');
        return true;
    } else {
        showIsRequiered(4, 'remove');
        return false;
    }
}
/**
 * 
 * @param {string} index - the index for the right "This filed is required" text position 
 * @param {string} action - 'add' or 'remove' for the classlist
 */
function showIsRequiered(index, action) {
    let required = document.getElementsByClassName('is-required')[index];
    required.classList[action]('displayNone');
}
/**
 * Shows a Messagebox 
 * @param {string} text -the text you want to show in the Messagebox
 */
function showWarning(text) {
    let massageBox = document.getElementById('created-task-massage-text')
    let img = document.querySelector('#created-task-massage > img')
    img.style.display = 'none'

    flyIn('flex')
    massageBox.innerText = `${text}`

    setTimeout(() => {
        flyIn('none')
    }, 3000);
    setTimeout(() => {
        massageBox.innerText = `Task added to board`
    }, 3100);

}

// =========================Animations ===========================
/**
 * A animation order when you press on add task
 */
function animations() {
    flyIn('flex')
    setTimeout(() => {
        flyOutBody()
        setTimeout(() => {
            swapToBoard()
        }, 250);
    }, 1000);

}
/**
 * 
 * @param {string} display - 'none ' or 'unset' to fly the messagebox in
 */
function flyIn(display) {
    let massage = document.getElementById('created-task-massage-container')

    massage.style.display = `${display}`
    setTimeout(() => {
        massage.classList.toggle('flyIn')
    }, 10);

}
/**
 * swipes the body to the right
 */
function flyOutBody() {
    let body = document.getElementsByTagName('body')[0]
    body.style.transform = ('translateX(100%)')
}
/**
 * Getting redirected to the board.html
 */
function swapToBoard() {
    window.location.href = 'board.html'
}


// =========================Date ==================================

document.addEventListener('DOMContentLoaded', function() {
    let heute = new Date();
    let formattedDate = formatDate(heute);

    let datumInput = document.getElementById('date');
    datumInput.value = formattedDate;
    datumInput.min = formattedDate;
});

function formatDate(date) {
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    return year + '-' + month + '-' + day;
}