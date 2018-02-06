<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Umphrey's McGee Tabs</title>
    <link rel="stylesheet" href="css/umtabs.css">
</head>
<body>
<div class="tablature">
<?php
    $requested = basename($_GET["tab"]);
    header("Content-Type: text/html; charset=UTF-8");
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
</div>
</body>
</html>

