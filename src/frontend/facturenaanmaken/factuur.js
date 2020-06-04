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
    // const GebruikerMail = document.getElementById('GebruikerMail');

    // const Path = path die meegegeven wordt vanuit upload.php

    // const IsBetaald = document.getElementById('IsBetaald').value;

    // let gegevens = { GebruikerMail, Path, IsBetaald }

    let gegevens = {
        GebruikerMail: 's.vanderflaas@student.avans.nl',
        Path: 'test_factuur.pdf', //    ../../../upload/facturen/
        IsBetaald: true
    };

    jQuery.ajax({
        type: 'POST',
        url: 'factuur.php',
        dataType: 'json',
        data: { functionname: 'upload', arguments: [1, 2] },

        success: function (obj, textstatus) {
            if (!('error' in obj)) {
                yourVariable = obj.result;
            } else {
                console.log(obj.error);
            }
        }
    });

    postData('http://localhost:3000/api/factuur', gegevens)
        .then((data) => {
            console.log(data);
            alert('The form was submitted');
        })
        .catch((err) => {
            console.log(err);
        });
}
