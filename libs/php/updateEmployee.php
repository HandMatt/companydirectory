<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/updateEmployee.php?id=101&firstName=Matthew&lastName=Handy&jobTitle=Software%20Engineer&email=matthew%2ehand@outlook%2ecom&departmentID=10

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// $_REQUEST used for development / debugging. Remember to cange to $_POST for production

  $query = 'UPDATE personnel SET firstName = "'.$_REQUEST['firstName'].'", lastName = "'.$_REQUEST['lastName'].'", jobTitle = "'.$_REQUEST['jobTitle'].'", email = "'.$_REQUEST['email'].'", departmentID = '.$_REQUEST['departmentID'].' WHERE id = '.$_REQUEST['id'].'';  
  
  $result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [$_REQUEST];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>