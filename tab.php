<?php
    header('Content-Type: text/plain;charset=utf-8');
    $requested = basename($_GET["tab"]);
    try {
        $file_contents = file_get_contents('tabs/' . $requested);
        if ($file_contents === false)
            echo "File not found.\n";
        else {
            echo $file_contents;
        }
    } catch (Exception $e) {
        echo "File not found.\n";
    }
?>

