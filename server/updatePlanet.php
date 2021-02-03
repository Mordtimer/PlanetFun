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
$mass = $_POST["mass"];
$radius = $_POST["radius"];
$color = $_POST["color"];

$obj = new stdClass();
$obj->id = $id;

$sql = "UPDATE planet SET ";

if (!isset($mass) && !empty($mass)) {
    $sql .= "mass=$mass ";
    $obj->mass = $mass;
}
if (!isset($radius) && !empty($radius)) {
    $sql .= "radius=$radius ";
    $obj->radius = $radius;
}
if (!isset($color) && !empty($color)) {
    $sql .= "color=$color ";
    $obj->color = $color;
}

$sql .= "WHERE id=$id";

if (mysqli_query($conn, $sql)) {
    $json = json_encode($obj);
    echo $json;
}

mysqli_close($conn);
