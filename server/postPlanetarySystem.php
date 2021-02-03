<?php
$servername = "localhost";
$username = "root";
$password = "password";
$dbName = "planet_fun";

// Create connection
$conn = mysqli_connect($servername, $username, NULL, $dbName);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$name = $_POST["name"];

$sql = "INSERT INTO planetary_system (name) VALUES ('$name')";

if (mysqli_query($conn, $sql)) {
    $lastId = mysqli_insert_id($conn);
    $obj = new stdClass();
    $obj->id = $lastId;
    $obj->name = $name;

    $json = json_encode($obj);
    echo $json;
}

mysqli_close($conn);
