/**
 * For each task element with the class 'summary-task', an event listener is added. 
 * When a task element is clicked, the user is redirected to the 'board.html' page.
 */
const Tasks =  document.querySelectorAll('.summary-task');
Tasks.forEach(task => {
    task.addEventListener('click', () => {
        window.location.href = 'board.html';
    })
});


/**
 * This asynchronous function retrieves the current user's name from local storage and updates the element with ID 'summaryGreetingName'.
 * 
 * @async
 * @function
 * @param {string} userName - A placeholder parameter that gets overwritten by the current user's name from local storage.
 * @returns {Promise<void>} Returns a Promise that resolves when the operation is complete. No return value.
 */
async function getUserName(){
    if(window.location.href.includes('summary.html')){
    let name = document.getElementById('summaryGreetingName');
    let userName = await getItem('currentUserName');
    
    name.innerHTML = userName;
    }
}


/**
 * Filters tasks based on a provided property and value, and then updates the text content of a specified HTML element.
 *
 * @param {string} taskProperty - The property of the task objects to filter by.
 * @param {string} taskValue - The value of the property to filter tasks by.
 * @param {string} elementId - The id of the HTML element whose text content should be updated.
 * @returns {Promise<void>}
 */
async function filterAndDisplay(taskProperty, taskValue, elementId) {
    const tasks = JSON.parse(await getItem('todos'));
    const filteredTasks = tasks.filter(task => task[taskProperty] === taskValue);
    const element = document.getElementById(elementId);
    element.innerText = filteredTasks.length;
}


/**
 * Retrieves task data, filters tasks by various categories and updates respective HTML elements with the count of tasks in each category.
 * Additionally, it logs all tasks to the console and updates the 'task-in-board' HTML element with the total task count.
 *
 * @returns {Promise<void>}
 */
async function getTasksData() {
    await filterAndDisplay('category', 'progress', 'task-in-progress');
    await filterAndDisplay('category', 'feedback', 'task-in-feedback');
    await filterAndDisplay('priority', 'urgent', 'task-urgent');
    await filterAndDisplay('category', 'open', 'task-todo');
    await filterAndDisplay('category', 'closed', 'task-done');

    const tasks = JSON.parse(await getItem('todos'));
    let tasksInBoard = document.getElementById('task-in-board');
    tasksInBoard.innerText = tasks.length;
}