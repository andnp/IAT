<?php
$data = file_get_contents("php://input");
$json = json_decode($data, true);
$f = fopen('data.csv', 'w');

fputcsv($f, $json->id);
fputcsv($f, $json->phase);


print_r(error_get_last());
?>