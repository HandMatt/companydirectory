<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/login.php?username=admin&password=password

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

  header('Content-Type: application/json; charset=UTF-8');
  
  $username = $_REQUEST['username'];
  $password = $_REQUEST['password'];

  if($username != "admin" or $password != "password") {
		exit;
  } else {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "Login success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	  $output['data'] = [];
    echo json_encode($output); 
  }
?>