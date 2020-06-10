const apiUrl = 'http://localhost:3000';

const options = {
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json'
        // authorisation token header
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};

// Example method implementation:
async function sendGetRequest(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        ...options,
        method: 'GET'
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function sendPostRequest(url = '', data = {}) {
    const response = await fetch(url, {
        ...options,
        method: 'POST',
        body: data,
        mode: 'no-cors'
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function sendDeleteRequest(url = '', data = {}) {
    const response = await fetch(url, {
        ...options,
        method: 'DELETE',
        body: data
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
