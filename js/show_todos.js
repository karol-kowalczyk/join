/**
 * Displays a specific todo in a modal based on the provided id.
 *
 * @function
 * @param {number} id - The id of the todo to be displayed.
 * @returns {void} No return value.
 */
function showTodo(id) {
    const todo = todos.find(t => t['id'] === id);
    let modalTodo = document.getElementById('showTodo');
    modalTodo.classList.remove('displayNone');
    modalTodo.innerHTML = '';
    modalTodo.innerHTML = ``;
    modalTodo.innerHTML += generateToDoHTMLModal(todo); 
}


/**
 * Generates HTML for the modal view of a todo.
 *
 * @function
 * @param {Object} todo - The todo object.
 * @returns {string} HTML string representing the todo.
 */
function generateSubtaskHTML(subtaskObj, index, todoId) {
    let isChecked = subtaskObj.isComplete ? 'checked' : '';
    let subtaskHTML = /*html*/ `
        <div class="todo-subtask">
            <input type="checkbox" id="subtask${index}" ${isChecked} onclick="toggleSubtask(${todoId}, ${index})">
            <label for="subtask${index}">${subtaskObj.subtask}</label>
        </div>
    `;
    return subtaskHTML;
}


/**
 * Generates the HTML representation for a member with initials and a background color.
 * The member string is expected to have the format "Name rgb(color)".
 * If the color is not provided, a random color is used.
 *
 * @param {string} member - The member string in the format "Name rgb(color)".
 * @returns {string} The HTML representation of the member.
 * 
 * @example
 * // returns '<p class="modalMember"><span class="initMember" style="background-color:rgb(255,0,0)">JS</span> John Smith</p>'
 * generateMemberHTML('John Smith rgb(255,0,0)');
 * 
 * @example
 * // Assuming getRandomColor() returns 'rgb(100,100,100)' 
 * // returns '<p class="modalMember"><span class="initMember" style="background-color:rgb(100,100,100)">JS</span> John Smith</p>'
 * generateMemberHTML('John Smith');
 */
function generateMemberHTML(member) {
    let splitMember = member.split(' rgb(');
    let name = splitMember[0];
    let color = splitMember[1] ? "rgb(" + splitMember[1] : getRandomColor(); 

    let names = name.split(' ');
    let initials = names[0][0] + (names[1] ? names[1][0] : ''); 

    let memberHTML = `<p class="modalMember"><span class="initMember" style="background-color:${color}">${initials}</span> ${name}</p>`;
    return memberHTML;
}


/**
 * Toggles the completion status of a specific subtask within a todo.
 * After toggling, the HTML is updated to reflect the change.
 *
 * @param {number|string} todoId - The ID of the parent todo item.
 * @param {number|string} subtaskId - The index or ID of the subtask within the todo's subtasks array.
 */
function toggleSubtask(todoId, subtaskId) {
    let todo = todos.find(t => t.id === todoId);
    if (todo && todo.subtasks && todo.subtasks[subtaskId]) {
        todo.subtasks[subtaskId].isComplete = !todo.subtasks[subtaskId].isComplete;
        updateHTML();
    }
}


/**
 * Closes the edit todo modal by adjusting its position off-screen and clearing its content.
 * Specifically, the function accesses the 'editTodoModal' element by its ID, moves it off-screen
 * to the right by setting its 'right' style property, and then clears its innerHTML.
 * 
 * @example
 * // Usage typically in response to some event like a button click
 * closeEditModal();
 */
function closeEditModal() {
    let editTodoModal = document.getElementById('editTodoModal');
    editTodoModal.style.right = '-200%';
    editTodoModal.innerHTML = '';
}


/**
 * Hides the modal.
 *
 * @function
 * @returns {void} No return value.
 */
function closeModalBord() {
    let modalTodo = document.getElementById('showTodo');
    modalTodo.classList.add('displayNone');
}


/**
 * Deletes a todo based on its id and updates the local storage.
 *
 * @async
 * @function
 * @param {number} todo - The id of the todo to be deleted.
 * @returns {Promise<void>} No return value.
 */
async function deleteTodo(todo) {
    let index = todo;
    let addTasks = JSON.parse(await getItem('task'));
    todos.splice(index, 1);
    addTasks.splice(index, 1);
    await setItem('task', JSON.stringify(addTasks));
    for (let i = 0; i < todos.length; i++) {
        todos[i]['id'] = i;
    }
    await setItemTodo();
    closeModalBord();
    initBoard();
}