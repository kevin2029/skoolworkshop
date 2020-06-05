async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "DELETE",
    mode: "no-cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: data,
  });
  return response;
}

function verstuur() {
 const form = new FormData(document.getElementById("workshopverwijderen"));
const workshopNaam = document.getElementById("naam-workshop");
  const url = "localhost:3000/api/workshop/" + workshopNaam;
 

  console.log(form);

  postData(url, form)
    .then((data) => {
      console.log(data);
      alert("The workshop has been deleted!");
    })
    .catch((err) => {
      console.log(err);
    });
}
