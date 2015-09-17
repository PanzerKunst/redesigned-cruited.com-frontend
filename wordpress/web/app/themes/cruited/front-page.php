<?php
// create a new cURL resource
$ch = curl_init("https://raw.githubusercontent.com/PanzerKunst/redesigned-cruited.com-frontend/master/wordpress/web/app/themes/cruited/templates/front-page.html");

// set URL and other appropriate options
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// grab URL and pass it to the browser
curl_exec($ch);

// close cURL resource, and free up system resources
curl_close($ch);
?>
