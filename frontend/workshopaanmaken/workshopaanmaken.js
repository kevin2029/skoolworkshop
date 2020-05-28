//var formData = new FormData();
//var formData = new FormData(form);

function verstuur() {
  console.log("start");

  const naam = document.getElementById("naam-workshop").value;
  const beschrijving = document.getElementById("beschrijving").value;
  const prijs = document.getElementById("prijs").value;
  const vervolgPrijs = document.getElementById("vervolg-prijs").value;
  const genre = document.getElementById("genre").value;

  const gegevens = {
    Name: naam,
    Beschrijving: beschrijving,
    Prijs: prijs,
    VervolgPrijs: vervolgPrijs,
    Genre: genre
  };

  console.log(gegevens);

  // POST request maken op server
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "localhost:3000/api/user", true);
  xhttp.send(gegevens);

  console.log("stop");
  alert("The form was submitted");
}
