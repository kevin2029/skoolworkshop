//var formData = new FormData();
//var formData = new FormData(form);

function verstuur() {
    console.log("start");
  
    const code = document.getElementById("code-coupon").value;
    const value = document.getElementById("naam-organisatie").value;
    const maxBedrag = document.getElementById("maximaalbedrag-coupon").value;
    const maxGebruik = document.getElementById("maximaalgebruik-coupon").value;
  
    const gegevens = {
      Code: code,
      Value: value,
      MaxBedrag: maxBedrag,
      MaxGebruik: maxGebruik,
    };
  
    console.log(gegevens);
  
    // POST request maken op server
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "localhost:3000/api/coupon", true);
    xhttp.send(gegevens);
  
    console.log("stop");
    alert("The form was submitted");
  }
  