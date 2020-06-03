// Andere .js kopieren
// JSON object maken met benodigde gegevens
// Versturen naar backend

// Example POST method implementation:
async function postData(url = '', data = {}) {
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
        body: data
    });
    return response;
}

function verstuur(path) {
    // const form = new FormData(document.getElementById('gebruikerAanmaken'));

    const userMail = document.getElementById('');

    var gegevens = {};

    console.log(gegevens);

    postData('http://localhost:3000/api/user', form)
        .then((data) => {
            console.log(data);
            alert('The form was submitted');
        })
        .catch((err) => {
            console.log(err);
        });
}
