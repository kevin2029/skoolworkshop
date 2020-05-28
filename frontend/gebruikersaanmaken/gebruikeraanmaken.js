//var formData = new FormData();
//var formData = new FormData(form);

function verstuur() {
  console.log("start");

  const naam = document.getElementById("naam-beheerder").value;
  const organisatie = document.getElementById("naam-organisatie").value;
  const email = document.getElementById("email").value;
  const wachtwoord = document.getElementById("wachtwoord").value;

  const gegevens = {
    Name: naam,
    Email: email,
    Organisation: organisatie,
    Password: wachtwoord,
  };

  console.log(gegevens);

  // POST request maken op server
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "localhost:3000/api/user", true);
  xhttp.send(gegevens);

  console.log("stop");
  alert("The form was submitted");
}
