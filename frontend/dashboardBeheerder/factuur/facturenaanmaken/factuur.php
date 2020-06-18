<?php
$target_dir = "..\\..\\..\\upload\\facturen\\";

// IsBetaald == true  -> 1
// IsBetaald == false -> 0
$isBetaald = 0;
if ($_POST['IsBetaald'] == 'true') {
  $isBetaald = 1;
}

// Check ofdat een bestand is geslecteerd.
if (($_FILES['fileToUpload']['name'] != "")) {

  // Waar het bestand opgeslagen wordt.
  $file = $_FILES['fileToUpload']['name'];
  $path = pathinfo($file);
  $filename = $path['filename'];
  $ext = $path['extension'];

  // Check ofdat bestand PDF is.
  if (strtolower($ext) != 'pdf') {
    echo "Sorry, file is not PDF.";
    exit();
  }

  // Tijdelijke bestand.
  $temp_file = $_FILES['fileToUpload']['tmp_name'];

  // Permanente bestand.
  $perm_file = $target_dir . $filename . "." . $ext;

  // Check ofdat bestand al bestaad.
  if (file_exists($perm_file)) {
    echo "Sorry, file already exists.";
    exit();
  } else {
    move_uploaded_file($temp_file, $perm_file);
    echo "File uploaded successfully.";

    // Registreer bestand in API.
    post('http://skoolworkshop-c2.herokuapp.com//api/invoice', ['GebruikerMail' => $_POST['GebruikerMail'], 'Path' => $filename . "." . $ext, 'IsBetaald' => $isBetaald]);

    exit();
  }
}

// Executeerd een post request.
function post($url, $data)
{
  $curl = curl_init($url);
  curl_setopt($curl, CURLOPT_POST, true);
  curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  $response = curl_exec($curl);
  curl_close($curl);
  return $response;
}
