<?php
$target_dir = "..\\..\\..\\upload\\facturen\\";

$isBetaald = 0;
if($_POST['IsBetaald'] == 'true') {
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
  if(strtolower($ext) != 'pdf') {
    echo "Sorry, file is not PDF.";
    exit();
  }

  $temp_name = $_FILES['fileToUpload']['tmp_name'];
  $path_filename_ext = $target_dir . $filename . "." . $ext;

  // Check ofdat bestand al bestaad.
  if (file_exists($path_filename_ext)) {
    echo "Sorry, file already exists.";
    exit();

  } else {
    move_uploaded_file($temp_name, $path_filename_ext);
    echo "File uploaded successfully.";
    post('localhost:3000/api/invoice', ['GebruikerMail' => $_POST['GebruikerMail'], 'Path' => $filename . "." . $ext, 'IsBetaald' => $isBetaald]);

    exit();
  }
}

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