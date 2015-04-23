<?php
$data = file_get_contents("php://input");
$json = json_decode($data, true);
$f = fopen('data.csv', 'w');

$line_array = [];
array_push($line_array, $json->id);
array_push($line_array, $json->phase);
foreach($json->data as $value){
	array_push($line_array, $value);
}
print_r($line_array);
fputcsv($f, $line_array);
fclose($f);

?>