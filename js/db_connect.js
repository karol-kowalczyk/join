const STORAGE_TOKEN = 'EUTW8OGPCVOWRPEDPIKITISC6XAOPW5J8Z0YKP21';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Stores data under a given key.
 * 
 * @param {string} key - The key to store the data under
 * @param {string} value - The data to store
 * @returns 
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}


/** 
 * 
 * Retrieves data from the storage.
 * 
 * @param {string} key - The key to retrieve the data from
*/
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}