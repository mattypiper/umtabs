<?php
$dir    = 'tabs';
$files = scandir($dir);

foreach ($files as $key => $value)
{
	if ($value == '.' || $value == '..')
		continue;

	print "http://umtabs.com/tabs/" . rawurlencode($value) . "\n";
}
?>
