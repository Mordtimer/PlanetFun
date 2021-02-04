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

$id = $_POST["planet_id"];

$obj = new stdClass();
$obj->id = $id;

$sql = "UPDATE planet SET ";

$mass = $_POST["mass"];

$sql .= "mass=$mass,";
$obj->mass = $mass;

$radius = $_POST["radius"];

$sql .= "radius=$radius,";
$obj->radius = $radius;

$color = $_POST["color"];

$sql .= "color='$color' ";
$obj->color = $color;

$sql .= "WHERE id=$id";

if (mysqli_query($conn, $sql)) {
    $json = json_encode($obj);
    echo $json;
} else {
    echo mysqli_error($conn);
}

mysqli_close($conn);
