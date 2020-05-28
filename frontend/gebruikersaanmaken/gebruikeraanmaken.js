function verstuur() {
    console.log('start');

    const Name = document.getElementById('naam-beheerder').value;
    const Adress = document.getElementById('adres').value;
    const Organisation = document.getElementById('naam-organisatie').value;
    const Email = document.getElementById('email').value;
    const Password = document.getElementById('wachtwoord').value;

    const gegevens = { Name, Email, Organisation, Adress, Password };
    console.log(gegevens);
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
            // "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify(gegevens),
        credentials: 'include'
    };

    fetch('http://localhost:3000/api/user', options);

    console.log('stop');
    alert('The form was submitted');
}
