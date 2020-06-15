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
  const form = new FormData(document.getElementById('gebruikerAanmaken'));

  console.log(form);

  postData('http://localhost:3000/api/user/create', form)
      .then((data) => {
          console.log(data);
          alert('The form was submitted');
      })
      .catch((err) => {
          console.log(err);
      });
}
