// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data // body data type must match "Content-Type" header
    });
    return response; //.json(); // parses JSON response into native JavaScript objects
}

function verstuur() {
    const form = new FormData(document.getElementById('gebruikerAanmaken'));

    console.log(form);

    postData('http://localhost:3000/api/user', form)
        .then((response) => {
            console.log(response.json());
        })
        .then((data) => {
            console.log(data); // JSON data parsed by `response.json()` call
            alert('The form was submitted');
        })
        .catch((err) => {
            console.log(err);
        });
}
