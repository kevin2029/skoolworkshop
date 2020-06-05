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
    const form = new FormData(document.getElementById('workshopverwijderen'));

    console.log(form);

    postData('http://localhost:3000/api/deleteworkshop', form)
        .then((data) => {
            console.log(data);
            alert('The workshop has been deleted!');
        })
        .catch((err) => {
            console.log(err);
        });
}
