<?php
$data = file_get_contents("php://input");
$json = json_decode($data, true);
$f = fopen('data.csv', 'w');

<<<<<<< HEAD
fputcsv($f, $json->id);
fputcsv($f, $json->phase);

=======
>>>>>>> e49087ea7ffb76df92330bba40c66f5b3034379e
$line_array = [];
array_push($line_array, $json->"id");
array_push($line_array, $json->"phase");
foreach($json->"data" as $value){
	array_push($line_array, $value);
}
print_r($line_array);
fputcsv($f, $line_array);
fclose($f);
<<<<<<< HEAD
=======

>>>>>>> e49087ea7ffb76df92330bba40c66f5b3034379e
?>