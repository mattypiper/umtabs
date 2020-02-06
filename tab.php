<?php
    $requested = basename($_GET["tab"]);
    header("Content-Type: text/html; charset=UTF-8");
    try {
        $file_contents = file_get_contents('tabs/' . $requested);
    } catch (Exception $e) {
        //echo "File not found.\n";
    }
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Umphrey's McGee Tabs</title>
    <link rel="stylesheet" href="css/umtabs.css">
</head>
<body>
<div class="tablature">
<?php
if ($file_contents === false)
    echo "File not found.\n";
else {
    echo $file_contents;
}
?>
</div>
</body>
</html>

