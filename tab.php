<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Umphrey's McGee Tablature">
    <title>Umphrey's McGee Tabs</title>
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">
    <link rel="stylesheet" href="css/umtabs.css">
    <!--[if lte IE 8]>
        <link rel="stylesheet" href="/css/side-menu-old-ie.css">
    <![endif]-->
    <!--[if gt IE 8]><!-->
        <link rel="stylesheet" href="/css/side-menu.css">
    <!--<![endif]-->
    <!--[if lt IE 9]>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.js"></script>
    <![endif]-->

    <script src="js/ui.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script>
    var myfunc = function() {
        $(".song-link").each(function(index, element) {
            var songname = element.innerHTML;
            var href = $(element).attr('href');
            $(element).click(function() {
                // console.log('clicked ' + songname + ', going to ' + href);
                $.get(href, function(data) {
                    $('#main').html('<div class="tablature content">' + data + '</div>');
                });
                $('#menu').hide();
                return false;
            });
        });
    };
    </script>
</head>

<body>
    <div class="tablature">
    <?php
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
    </div>
</body>
</html>

