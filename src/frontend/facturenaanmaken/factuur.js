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

function verstuur() {
    // const form = new FormData(document.getElementById('gebruikerAanmaken'));

    // const userMail = document.getElementById('');

    // const path = path die meegegeven wordt vanuit upload.php

    // const betaald = if statement die betaald uitleest

    // let gegevens = { userMail, path, betaald }

    let gegevens = {
        userMail: 's.vanderflaas@student.avans.nl',
        path: 'test_factuur.pdf', //    ../../../upload/facturen/
        betaald: 'Ja'
    };

    postData('http://localhost:3000/api/factuur', gegevens)
        .then((data) => {
            console.log(data);
            alert('The form was submitted');
        })
        .catch((err) => {
            console.log(err);
        });
}
