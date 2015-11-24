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
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-37556222-2', 'auto');
	ga('send', 'pageview');
	</script>
</head>

<body>
<div id="layout">
    <!-- Menu toggle -->
    <a href="#menu" id="menuLink" class="menu-link">
	<!-- Hamburger icon -->
	<span></span>
    </a>

    <div id="menu" style="width: 100%">
	<div class="pure-menu">
	    <a class="pure-menu-heading" href="#">umtabs</a>

            <ul class="pure-menu-list">
			<?php
				$weeds = array(".", "..");
				$files = array_diff(scandir("tabs"), $weeds);
				foreach ($files as $f) {
					$song = preg_replace("/\.txt$/", "", $f);
					$usong = rawurlencode($f);
					print "<li class=\"pure-menu-item\"><a href=\"tab.php?tab=$usong\" class=\"pure-menu-link song-link\">$song</a></li>";
				}
			?>
	    </ul>
	</div>
    </div>
</div>
</body>
</html>

