/**
 * Initializes the application by including HTML, retrieving user names, setting initials, and more.
 * Also ensures that the currently logged in user has the appropriate access.
 * 
 * @returns {Promise<void>}
 */
async function init() {
    
    await includeHTML();
    await getUserName();
    await allUserName();
    await setInitials();
    await allUsers();
    validateName();
    activeLink();
}


/**
 * Validates the current user's name. If the user's name is 'noaccess', the user is redirected to the index page.
 */
function validateName() {
    if (currentUserName === 'noaccess') {
        window.location.href = 'index.html';
    }
}


/**
 * Fetches and assigns the list of all user names and the current user's name.
 * 
 * @returns {Promise<void>}
 */
async function allUserName(){
    let allUsers = JSON.parse(await getItem('userName'));
    currentUserName = await getItem('currentUserName');
}


/**
 * Toggles the visibility of the logout button.
 */
function showLogout() {
    let logout = document.getElementById('logout');
    logout.classList.toggle('hidden-logout-btn');
}


/**
 * Includes the HTML content for elements with the attribute 'w3-include-html'.
 * The value of the attribute should be the path to the HTML file.
 * 
 * @returns {Promise<void>}
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }

}


/**
 * Sets the initials of the current user based on their name.
 * The initials are displayed in an element with the id 'temp-initials'.
 * 
 * @returns {Promise<void>}
 */
async function setInitials() {
    let initials = document.getElementById('temp-initials');
    let userName = await getItem('currentUserName');
    let nameArray = userName.split(' ');

    let firstInitial = nameArray[0].charAt(0);
    if(nameArray.length === 1) return [firstInitial, ' '];
    let secondInitial = nameArray[1].charAt(0);
    initials.innerHTML = firstInitial + secondInitial;
}


/**
 * Sets the 'active' class on the appropriate navigation link based on the current page's path.
 */
function activeLink() {
    let links = document.querySelectorAll('.nav-mobile-reiter');
    let path = window.location.pathname;
    let page = path.split('/').pop();
    
    links.forEach(link => {
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}


/**
 * Generates an HTML string for a todo box element with various details about a task.
 *
 * This function expects an `element` object that includes the following properties:
 * - id: A unique identifier for the todo task.
 * - members: A string representing the task's assigned member.
 * - priority: A string representing the task's priority level.
 * - task-category: A string representing the task's category.
 * - title: A string representing the task's title.
 * - text: A string representing the task's description.
 * - done-fraction: A string representing the percentage of the task that has been completed.
 *
 * It uses the `getFirstTwoLetters` and `generatePrioIcon` functions to process the `members` and `priority` data.
 *
 * @param {Object} element - The todo task object to be processed.
 * @returns {string} An HTML string for a todo box element.
 */
function generateToDoHTML(element, category, i, nextPosition) {
    let members = element['members'];
    let letters = getFirstTwoLetters(members);
    let prioImg = generatePrioIcon(element['priority']);
    let color = getColorVariable(element['task-color']);
    let progress = 0;
    let progressLabel = '';
    if (element['subtasks'] && element['subtasks'].length > 0) {
        progress = element['subtasks'].filter(subtaskObj => subtaskObj.isComplete).length / element['subtasks'].length;
        progressLabel = `${element['subtasks'].filter(subtaskObj => subtaskObj.isComplete).length}/${element['subtasks'].length}`;
    }
    let displayUp = element['category'] === 'open' ? 'none' : 'block';
    let displayDown = element['category'] === 'closed' ? 'none' : 'block';

    return /*html*/ `
    <div  class="todo-box" draggable="true" ondragstart="startDragging(${element['id']}, '${category}')">
    <div class="chegeCategory">
        <img id="up" onclick="upCategory(${element['id']})" src="./assets/img/up.png" style="display: ${displayUp}">
        <br>
        <img id="down" onclick="downCategory(${element['id']})" src="./assets/img/down.png" style="display: ${displayDown}">
    </div>
    <div id="todoBoxHeader${element['id']}" class="todo-box-header" style="background-color:${color};">
        <h4>${element['task-category']}</h4>
    </div>

        <div class="todo-box-title">
            <h3>${element['title']}</h3>
        </div>

    <div onclick="showTodo(${element['id']})" class="todo-box-body">
        <p>${element['text']}</p>
    </div>
    <div onclick="showTodo(${element['id']})">
        <div class="todo-box-progress">
            <div class="todo-box-progress-bar">
                <div class="todo-box-progress-bar-fill" style="width: ${progress * 100}%"></div>
            </div>
            <p>${progressLabel} Done</p>
        </div>

        <div id="todoBoxFooterBar${element['id']}" class="todo-box-footer-bar">
            <div  class="todo-box-footer">
                <div class="todo-box-footer-right" >
                    ${letters}
                </div>
                <div class="todo-box-footer-left">
                    ${prioImg}
                </div>
            </div> 
        </div>
    </div>
    <div id="${category}${i}" class="nextPosition display-none">${nextPosition}</div>
    </div>
    `;
}

/**
 * Generates an HTML string for an image element that refers to a priority icon.
 *
 * @param {string} prio - The name of the priority level, which corresponds to the filename of the icon.
 * @returns {string} An HTML string for an image element.
 */
function generatePrioIcon(prio) {
    return /*html*/ `
    <img src="./assets/img/icons/${prio}.png" alt="${prio}">
    `;
}

/**
 * Generates the HTML representation for a to-do item inside a modal.
 * The function takes into account the task color, subtasks, priority, 
 * and assigned members to render a detailed representation of the to-do.
 * 
 * @param {object} todo - An object representing the to-do item. The object should have properties:
 *   - `task-color`: The color associated with the task.
 *   - `subtasks`: An array of subtask objects.
 *   - `priority`: The priority level ('urgent', 'medium', 'low', etc.).
 *   - `task-category`: The category of the task.
 *   - `title`: The title of the task.
 *   - `text`: The detailed text of the task.
 *   - `date`: The due date for the task.
 *   - `members`: An array of members associated with the task.
 *   - `id`: The unique identifier for the task.
 * @returns {string} The HTML representation of the to-do inside a modal.
 */
function generateToDoHTMLModal(todo) {
    let subtasksHTML = '';
    let color = getColorVariable(todo['task-color']);
    if (todo.subtasks && todo.subtasks.length > 0) {
        subtasksHTML = todo.subtasks.map((subtaskObj, index) => generateSubtaskHTML(subtaskObj, index, todo.id)).join('');
    }

    let colorTodosPriorities = todo['priority'] === 'urgent' ? '#FF0000' : todo['priority'] === 'medium' ? '#FFA800' : todo['priority'] === 'low' ? '#7AE229' : '#321313';
    let imgTodosPriorities = todo['priority'] === 'urgent' ? './assets/img/urgent.svg' : todo['priority'] === 'medium' ? './assets/img/mediumweiss.png' : todo['priority'] === 'low' ? './assets/img/lowweiss.png' : './assets/img/lowweiss.png';
    let membersHTML = '';
    if (todo.members && todo.members.length > 0) {
        membersHTML = todo.members.map(member =>  generateMemberHTML(member)).join('');
    }

    let todoHTML = /*html*/ `
    <div class="modal-content">
        <div onclick="closeModalBord()" class="modal-close">
            <img src="./assets/img/close-icon.png" alt="">
        </div>
        <h4 style="background-color: ${color}" class="modal-category">${todo['task-category']}</h4>
        <h3 class="modal-title">${todo['title']}</h3>
        <p class="modal-text"> ${todo['text']}</p>
        <p class="modal-date"><b>Due date:</b> ${todo['date']}</p>
        <div class="modal-tasks"> ${subtasksHTML}</div>
        <p class="modal-priority"><b>Priority:</b> 

           <span style="background-color: ${colorTodosPriorities};" id="priority">${todo['priority']}
            <img style="width: 20px;" src="${imgTodosPriorities}" alt="">
            </span>
        </p>
        <div class="modal-members">
            <p><b>Assigned To:</b></p>
            ${membersHTML}
        </div>
        <div onclick="deleteTodo(${todo['id']})" class="todo-delete">
            <img src="./assets/img/delete.png" alt="">
        </div>
        <div onclick="editTodo(${todo['id']})" class="todo-edit">
            <img src="./assets/img/editweiss.png" alt="">
        </div>
    `;
    return todoHTML;
}


/**
 * Asynchronously edits a Todo item by its ID.
 * 
 * This function retrieves the list of contacts from storage, finds the Todo item by its ID,
 * and then presents a modal that allows users to modify various properties of the Todo item,
 * such as title, description, due date, and priority.
 * 
 * @async
 * @function
 * @param {number|string} id - The ID of the Todo item to edit.
 * @throws Will throw an error if the 'contacts' item is not found in storage.
 * @returns {void}
 * @example
 * 
 * editTodo(5);  // Opens a modal to edit the Todo with ID 5
 * 
 */
async function editTodo (id) {
    let contacts = JSON.parse(await getItem('contacts'));
    let todo = todos[id];
    const editTodoModal = document.getElementById('editTodoModal');
    editTodoModal.style.right = '0';
    const editTodoBox = document.createElement('div');
    editTodoBox.classList.add('editTodoBox');
    editTodoModal.appendChild(editTodoBox);

    editTodoBox.innerHTML += /*html*/ `
        <div class="addTaskTitle">
                <span class="typography2T6">Title</span>
                <div class=" input-container">
                    <input id="title" type="text" class="captions inputFrame" placeholder="Enter a Title" value="${todo['title']}">
                </div>
                <span class="is-required displayNone">This field is required</span>
            </div>
        <div class="addTaskDescription">
                <span class="typography2T6">Description</span>
                <div class="textarea-container">
                    <textarea id="description" class="captions textareaFrame"
                        placeholder="Enter a Description">${todo['text']}</textarea>
                    <img class="addTaskFrame17Recurso11" src="./assets/img/recurso-11.svg">
                </div>
                <span class="is-required displayNone">This field is required</span>
            </div>
            <div class="addTaskDueDate">
                    <span class="typography2T6">Due date</span>
                    <div class=" input-container">
                        <input id="date" type="date" class="captions inputFrame" placeholder="dd/mm/yyyy"
                            min="2023-01-01" value="${todo['date']}">
                    </div>
                    <span class="is-required displayNone">This field is required</span>
                </div>
                <div class="addTaskFrame28">
                    <span class="typography2T6">Prio</span>

                    <div class="addTaskPriority">
                        <button id="addTaskBtnUrgent" onclick="changeColor('addTaskBtnUrgent','urgent')"
                            class="input-containerPrio buttonFramePrio">
                            <span class="typography2T6">Urgent</span>
                            <svg width="21" height="15" viewBox="0 0 21 15" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="Prio alta" clip-path="url(#clip0_70119_2621)">
                                    <g id="Capa 2">
                                        <g id="Capa 1">
                                            <path id="Vector"
                                                d="M19.4043 14.7547C19.1696 14.7551 18.9411 14.6803 18.7522 14.5412L10.5001 8.458L2.24809 14.5412C2.13224 14.6267 2.00066 14.6887 1.86086 14.7234C1.72106 14.7582 1.57577 14.7651 1.43331 14.7437C1.29084 14.7223 1.15397 14.6732 1.03053 14.599C0.907083 14.5247 0.799474 14.427 0.713845 14.3112C0.628216 14.1954 0.566244 14.0639 0.531467 13.9243C0.49669 13.7846 0.48979 13.6394 0.51116 13.497C0.554319 13.2095 0.71001 12.9509 0.943982 12.7781L9.84809 6.20761C10.0368 6.06802 10.2654 5.99268 10.5001 5.99268C10.7349 5.99268 10.9635 6.06802 11.1522 6.20761L20.0563 12.7781C20.2422 12.915 20.3801 13.1071 20.4503 13.327C20.5204 13.5469 20.5193 13.7833 20.4469 14.0025C20.3746 14.2216 20.2349 14.4124 20.0476 14.5475C19.8604 14.6826 19.6352 14.7551 19.4043 14.7547Z"
                                                fill="#FF3D00" />
                                            <path id="Vector_2"
                                                d="M19.4043 9.00568C19.1696 9.00609 18.9411 8.93124 18.7522 8.79214L10.5002 2.70898L2.2481 8.79214C2.01412 8.96495 1.72104 9.0378 1.43331 8.99468C1.14558 8.95155 0.886785 8.79597 0.713849 8.56218C0.540914 8.32838 0.468006 8.03551 0.511165 7.74799C0.554324 7.46048 0.710015 7.20187 0.943986 7.02906L9.8481 0.458588C10.0368 0.318997 10.2654 0.243652 10.5002 0.243652C10.7349 0.243652 10.9635 0.318997 11.1522 0.458588L20.0563 7.02906C20.2422 7.16598 20.3801 7.35809 20.4503 7.57797C20.5204 7.79785 20.5193 8.03426 20.447 8.25344C20.3746 8.47262 20.2349 8.66338 20.0476 8.79847C19.8604 8.93356 19.6352 9.00608 19.4043 9.00568Z"
                                                fill="#FF3D00" />
                                        </g>
                                    </g>
                                </g>
                                <defs>
                                    <clipPath id="clip0_70119_2621">
                                        <rect width="20" height="14.5098" fill="white"
                                            transform="translate(0.5 0.245117)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                        <button id="addTaskBtnMedium" onclick="changeColor('addTaskBtnMedium', 'medium')"
                            class="input-containerPrio buttonFramePrio">
                            <span class="typography2T6">Medium</span>
                            <svg width="20" height="9" viewBox="0 0 20 9" xmlns="http://www.w3.org/2000/svg">
                                <g id="Prio media" clip-path="url(#clip0_70119_2628)">
                                    <g id="Capa 2">
                                        <g id="Capa 1">
                                            <path id="Vector"
                                                d="M18.9041 8.22528H1.09589C0.805242 8.22528 0.526498 8.10898 0.320979 7.90197C0.11546 7.69495 0 7.41419 0 7.12143C0 6.82867 0.11546 6.5479 0.320979 6.34089C0.526498 6.13388 0.805242 6.01758 1.09589 6.01758H18.9041C19.1948 6.01758 19.4735 6.13388 19.679 6.34089C19.8845 6.5479 20 6.82867 20 7.12143C20 7.41419 19.8845 7.69495 19.679 7.90197C19.4735 8.10898 19.1948 8.22528 18.9041 8.22528Z"
                                                fill="#FFA800" />
                                            <path id="Vector_2"
                                                d="M18.9041 2.98211H1.09589C0.805242 2.98211 0.526498 2.86581 0.320979 2.6588C0.11546 2.45179 0 2.17102 0 1.87826C0 1.5855 0.11546 1.30474 0.320979 1.09772C0.526498 0.890712 0.805242 0.774414 1.09589 0.774414L18.9041 0.774414C19.1948 0.774414 19.4735 0.890712 19.679 1.09772C19.8845 1.30474 20 1.5855 20 1.87826C20 2.17102 19.8845 2.45179 19.679 2.6588C19.4735 2.86581 19.1948 2.98211 18.9041 2.98211Z"
                                                fill="#FFA800" />
                                        </g>
                                    </g>
                                </g>
                                <defs>
                                    <clipPath id="clip0_70119_2628">
                                        <rect width="20" height="7.45098" fill="white"
                                            transform="translate(0 0.774414)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                        <button id="addTaskBtnLow" onclick="changeColor('addTaskBtnLow', 'low')"
                            class="input-containerPrio buttonFramePrio">
                            <span class="typography2T6">Low</span>
                            <svg width="20" height="15" viewBox="0 0 20 15" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g id="Prio baja">
                                    <g id="Capa 2">
                                        <g id="Capa 1">
                                            <path id="Vector"
                                                d="M10 9.00614C9.7654 9.00654 9.53687 8.9317 9.34802 8.79262L0.444913 2.22288C0.329075 2.13733 0.231235 2.02981 0.15698 1.90647C0.0827245 1.78313 0.033508 1.64638 0.0121402 1.50404C-0.031014 1.21655 0.0418855 0.923717 0.214802 0.689945C0.387718 0.456173 0.646486 0.300615 0.934181 0.257493C1.22188 0.21437 1.51493 0.287216 1.74888 0.460004L10 6.54248L18.2511 0.460004C18.367 0.374448 18.4985 0.312529 18.6383 0.277782C18.7781 0.243035 18.9234 0.236141 19.0658 0.257493C19.2083 0.278844 19.3451 0.328025 19.4685 0.402225C19.592 0.476425 19.6996 0.574193 19.7852 0.689945C19.8708 0.805697 19.9328 0.937168 19.9676 1.07685C20.0023 1.21653 20.0092 1.36169 19.9879 1.50404C19.9665 1.64638 19.9173 1.78313 19.843 1.90647C19.7688 2.02981 19.6709 2.13733 19.5551 2.22288L10.652 8.79262C10.4631 8.9317 10.2346 9.00654 10 9.00614Z"
                                                fill="#7AE229" />
                                            <path id="Vector_2"
                                                d="M10 14.7547C9.7654 14.7551 9.53687 14.6802 9.34802 14.5412L0.444913 7.97142C0.210967 7.79863 0.0552944 7.54005 0.0121402 7.25257C-0.031014 6.96509 0.0418855 6.67225 0.214802 6.43848C0.387718 6.20471 0.646486 6.04915 0.934181 6.00603C1.22188 5.96291 1.51493 6.03575 1.74888 6.20854L10 12.291L18.2511 6.20854C18.4851 6.03575 18.7781 5.96291 19.0658 6.00603C19.3535 6.04915 19.6123 6.20471 19.7852 6.43848C19.9581 6.67225 20.031 6.96509 19.9879 7.25257C19.9447 7.54005 19.789 7.79863 19.5551 7.97142L10.652 14.5412C10.4631 14.6802 10.2346 14.7551 10 14.7547Z"
                                                fill="#7AE229" />
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </button>
                    </div>
                    <span class="is-required displayNone">This field is required</span>
                </div>`;
        editTodoBox.innerHTML += getContaktFromStor();

        editTodoBox.innerHTML += /*html*/ `
    
        <div>
            <button class="editClose" onclick="closeEditModal()">
                <img src="./assets/img/close-icon.png">
            </button>
        </div>
        <div class="editSubtasks">
            <button onclick="saveTodo(${todo['id']})" id="saveAll" class="editOk">OK</button>
        </div>
    `;
    addPersonsToNewTodo();
}


/**
 * Updates a specific todo item with new values from the DOM inputs.
 * After updating, the todo item is saved (using setItemTodo),
 * reflected in the UI, and the edit modal is closed.
 * 
 * @async
 * @param {number} id - The index or ID of the todo item to update.
 * @returns {void} - Nothing is returned; however, potential side effects include updating global state, updating the DOM, and logging.
 * @throws {Error} - Logs an error if a todo with the given index is not found.
 * 
 * @example
 * // Assuming there's a todo with ID 5 and you've updated the respective fields in the DOM
 * saveTodo(5);
 */
async function saveTodo(id) {
    let index = id;
    let todo = todos[index]; 
    if (!todo) {
        console.error(`Todo with index ${index} not found.`);
        return;
    }

    let titleInput = document.getElementById('title');
    let text = document.getElementById('description');
    let dateInput = document.getElementById('date');
    let persons = addPersonsToNewTodo();

    todo.title = titleInput.value;
    todo.text = text.value;
    todo.date = dateInput.value;
    todo.priority = currentPriority;
    todo.members = persons;
    await setItemTodo();
    showTodo(id);
    updateHTML();
    closeEditModal();
}


/**
 * Retrieves and formats a list of persons based on the 'contactsForAddTask' data.
 * Only contacts marked as 'checked' are added to the list, and their information
 * is combined into a full name string (first name, last name, and color).
 * 
 * @returns {string[]} - An array of formatted full names of selected persons.
 * 
 * @example
 * // Assuming contactsForAddTask has been populated and some are marked as 'checked'
 * const personsForTodo = addPersonsToNewTodo();
 * console.log(personsForTodo); // ["John Doe Blue", "Jane Smith Red", ...]
 */
let addPersonsToNewTodo = () => {
    let persons = [];
    
    for (let i = 0; i < contactsForAddTask.length; i++) {
        const contact = contactsForAddTask[i];
    
        if (contact['checked?'] === 'checked') {
            let firstName = contact['first-name'];
            let lastName = contact['last-name'];
            let color = contact['color'];
            let fullName = `${firstName} ${lastName} ${color}`;
    
            persons.push(fullName);
        }
    }
    return persons; 
}




/**
 * Generates and returns a HTML template string for the contact dropdown within the task.
 * This function provides an interface for assigning contacts to a task.
 * 
 * @returns {string} - HTML template string representing the contact dropdown interface.
 * 
 * @example
 * const contactDropdownHTML = getContaktFromStor();
 * document.getElementById('someElementId').innerHTML = contactDropdownHTML;
 */
function getContaktFromStor () {
    return /*html*/`
        <div class="addTaskDropdown">
                    <span class="typography2T6">Assinged to</span>
                    <div style="height: 51px;" class="dropdown dropdown-assinged-to typography2T6">
                        <div class="dropdown-content">
                            <div id="select-box2" onclick="toggleDropdown('dropdown-assinged-to');renderContacts()"
                                class="dropdown-option dropdown-start-text">
                                <div class="dropdown-option dropdown-start-text">
                                    <div id="select-contacts-to-assign" style="display: unset;">Select contacts to assign
                                    </div>
                                    <div id="select-contacts-to-assign-img"><img src="assets/img/vector2.svg"></div>
                                </div>
    
                                <div id="input-container2" class="dropdown-option" style="display: none;">
                                    <input id="assinged-to-input" class="typography2T6 inputFrame"
                                        placeholder="Contact E-Mail" type="email">
                                    <div class="check-container">
                                        <img onclick="" src="assets/img/icons/dropdown-close-button.svg">
                                        <img src="assets/img/icons/dropdown-abtrenner.svg">
                                        <img onclick="addNewCategory()" src="assets/img/icons/dropdown-check-button.svg">
                                    </div>
                                </div>
                            </div>
                            <div id="contacts"></div>
                            <div id="emails"></div>
    
                            <div onclick="showInviteNewContactInput()" class="dropdown-option dropdown-option-img">Invite
                                new contact<div><img src="assets/img/icons/invite-new-contact.svg"></div>
                            </div>
                        </div>
                    </div>
                    <div id="assinged-persons-container">
                    </div>
                </div>
    
    `;
    }