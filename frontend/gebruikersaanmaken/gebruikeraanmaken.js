// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data, // body data type must match "Content-Type" header
  });
  return response; //.json(); // parses JSON response into native JavaScript objects
}

function verstuur() {
  const gegevens = {
    Name: document.getElementById("Name").value,
    Email: document.getElementById("Email").value,
    Organisation: document.getElementById("Organisation").value,
    Adress: document.getElementById("Adress").value,
    Password: document.getElementById("Password").value,
  };

  const form = new FormData(document.getElementById("gebruikerAanmaken"));

  console.log(form);

  postData("http://localhost:3000/api/user", form)
    .then((data) => {
      console.log(data); // JSON data parsed by `response.json()` call
      alert("The form was submitted");
    })
    .catch((err) => {
      console.log(err);
    });
}
