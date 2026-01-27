<?php
// Wrapper to ensure index.html is served even if index.php takes precedence
readfile("index.html");
?>
