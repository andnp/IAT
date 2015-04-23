<?php
$data = file_get_contents("php://input");
$json = json_decode($data, true);
$f = fopen('data.csv', 'w');

<<<<<<< HEAD
fputcsv($f, $json->id);
fputcsv($f, $json->phase);


print_r(error_get_last());
=======
$line_array = [];
array_push($line_array, $json->id);
array_push($line_array, $json->phase);
foreach($json->data as $value){
	array_push($line_array, $value);
}
fputcsv($f, $line_array);
fclose($f);
>>>>>>> 5c258b8953b84025610f1b3db5d6ebe9f02d598f
?>