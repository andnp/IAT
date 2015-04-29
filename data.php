<?php
$data = file_get_contents("php://input");
$json = json_decode($data, true);
$f = fopen('data' . $json["phase"] . '.csv', 'a');

$line_array = [];
array_push($line_array, $json["id"]);
foreach($json["data"] as $value){
  foreach($value as $val){
	array_push($line_array, $val);
  }
}
echo($line_array);
echo(error_get_last());
fputcsv($f, $line_array);
fclose($f);
?>