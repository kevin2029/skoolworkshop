var formData = new FormData();
var formData = new FormData(form);

function verstuur() {
  console.log("start");
  let form = document.getElementById("gebruikerNanmaken");
  let formData = new FormData(form);
  console.log(formData.getAll);
  console.log("stop");
}
