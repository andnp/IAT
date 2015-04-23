<?php
$data = file_get_contents("php://input");
$json = json_decode($data, true);
<<<<<<< HEAD
$f = fopen('data' . $json["phase"] . '.csv', 'w');
=======
$f = fopen('data.csv', 'a');

fputcsv($f, $json->id);
fputcsv($f, $json->phase);

>>>>>>> ba56b46ba5f3092a8972c0810e0037ae28a1d7f0
$line_array = [];
array_push($line_array, $json["id"]);
foreach($json["data"] as $value){
  foreach($value as $val){
	array_push($line_array, $val);
  }
}
//print_r($line_array);
//print_r(error_get_last());
fputcsv($f, $line_array);
fclose($f);
?>