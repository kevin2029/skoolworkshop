function getOrganisation() {
    sendGetRequest(apiUrl + '/api/organisation/getall')
        .then((data) => {
            console.log(data.result);
            let tableBody = document.getElementById('Organisatie');

            let rows =
                '<option value="" disabled selected hidden>Kies een organisatie</option>';
            if (data.result) {
                data.result.forEach((item) => {
                    console.log(item);
                    rows +=
                        // Column namen van de data die je opvraagt
                        `<option value="${item.Naam}">${item.Naam}</option>`;
                    console.log(item.Naam);
                });

                tableBody.innerHTML = rows; // Stop de aangemaakte tablerows in de body van de eerder gemaakt table
            } else {
                let niks = '';
                tableBody.innerHTML = niks;
            }
        })
        .catch((error) => {
            alert('Error fetching organisation!');
            console.log(
                'There has been a problem with your fetch operation:',
                error
            );
        });
}

function getUserName() {
    sendGetRequest(apiUrl + '/api/user/getall')
        .then((data) => {
            console.log(data.result);
            let tableBody = document.getElementById('Organisatie');

            let rows =
                '<option value="" disabled selected hidden>Kies een persoon</option>';
            if (data.Users) {
                data.Users.forEach((item) => {
                    console.log(item);
                    rows +=
                        // Column namen van de data die je opvraagt
                        `<option value="${item.Naam}">${item.Naam}</option>`;
                    console.log(item.Naam);
                });

                tableBody.innerHTML = rows; // Stop de aangemaakte tablerows in de body van de eerder gemaakt table
            } else {
                let niks = '';
                tableBody.innerHTML = niks;
            }
        })
        .catch((error) => {
            alert('Error fetching name!');
            console.log(
                'There has been a problem with your fetch operation:',
                error
            );
        });
}

function getCategory() {
    sendGetRequest(apiUrl + '/api/category/getall')
        .then((data) => {
            console.log(data.result);
            let tableBody = document.getElementById('Categorie');

            let rows =
                '<option value="" disabled selected hidden>Kies een categorie</option>';
            if (data.result) {
                data.result.forEach((item) => {
                    console.log(item);
                    rows +=
                        // Column namen van de data die je opvraagt
                        `<option value="${item.Naam}">${item.Naam}</option>`;
                    console.log(item.Naam);
                });

                tableBody.innerHTML = rows; // Stop de aangemaakte tablerows in de body van de eerder gemaakt table
            } else {
                let niks = '';
                tableBody.innerHTML = niks;
            }
        })
        .catch((error) => {
            alert('Error fetching organisation!');
            console.log(
                'There has been a problem with your fetch operation:',
                error
            );
        });
}