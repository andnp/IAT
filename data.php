<?php
$data = file_get_contents("php://input");
$arrays = json_decode($data, true);
$f = fopen('data.csv', 'w');

$firstLineKeys = false;
foreach ($arrays as $line)
{
    if (empty($firstLineKeys))
    {
        $firstLineKeys = array_keys($line);
        fputcsv($f, $firstLineKeys);
        $firstLineKeys = array_flip($firstLineKeys);
    }
    $line_array = array($line['id']);
    $line_array.push($line['phase']);
	    foreach ($line['data'] as $value)
    {
        $line_array.push($value);
    }
    fputcsv($f, $line_array);

}
?>