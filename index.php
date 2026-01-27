<?php
// Prevent any caching of this PHP file
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Check if we are being accessed via a legacy path
$uri = $_SERVER['REQUEST_URI'];
if (strpos($uri, '/chaveshopify') !== false) {
    header("Location: /", true, 301);
    exit();
}

// Serve the HTML content directly
echo file_get_contents("index.html");
?>
