function verstuur() {
    if (
        $('input[name="Wachtwoord]').val() !==
        $('input[name="wachtwoord-herhaal]').val()
    ) {
        return false;
    }

    const form = new FormData(document.getElementById('gebruikerEdit'));

    console.log(form);

    sendPostRequestWithAuth('http://localhost:3000/api/user/edit', form)
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

$(window).ready(() => {
    //let data = sendGetRequestWithAuth('http://localhost:3000/user/user', {}, getCookie('usertoken'));

    let data = {
        User: {
            Naam: 'Pietje Huizema',
            Email: 'test@gmail.com',
            Organisatie: 'Avans Hogeschool',
            Adress: 'Hogeschoollaan 1'
        }
    };

    $('input[name="Naam"]').val(data.User.Naam);
    $('input[name="Organisatie"]').val(data.User.Organisatie);
    $('input[name="Adress"]').val(data.User.Adress);
    $('input[name="Email"]').val(data.User.Email);

    $('.editInput').each((i, element) => {
        let input = $(element).find('input');
        let button = $(element).find('button');

        button.click((e) => {
            let pressedButton = $(e.target);
            let targetInput = pressedButton.parent().find('input');

            targetInput.attr('disabled', false);
            targetInput.focus();
        });

        input.attr('disabled', true);
    });
});
