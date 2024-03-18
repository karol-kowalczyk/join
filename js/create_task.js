let task = [];

/**
 * Asynchronous function that creates or updates tasks in storage.
 * 
 * @async
 * @function
 * @param {Object} newTask - The new task object to be added.
 * @returns {Promise<void>} No return value
 * @throws {Error} Throws an error if loading tasks or converting the resulting string to JSON fails.
 */
async function createTaskBackend(newTask) {
    let taskData = await getItem('task');
    if (!taskData) {
        task = [];
    } else {
        task = JSON.parse(taskData);
    }
    task.push(newTask);
    await setItem('task', JSON.stringify(task));
}