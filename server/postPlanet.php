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

$planetarySystemId = $_POST["planetary_system_id"];
$positionX = $_POST["position_x"];
$positionY = $_POST["position_y"];
$velocityX = $_POST["velocity_x"];
$velocityY = $_POST["velocity_y"];
$mass = $_POST["mass"];
$radius = $_POST["radius"];
$color = $_POST["color"];
$gravityConst = $_POST["gravity_const"];

$obj = new stdClass();
$obj->positionX = $positionX;
$obj->positionY = $positionY;
$obj->velocityX = $velocityX;
$obj->velocityY = $velocityY;
$obj->mass = $mass;
$obj->radius = $radius;
$obj->color = $color;
$obj->gravity_const = $gravity_const;

$sql = "INSERT INTO planet (planetary_system_id, position_x, position_y, velocity_x, velocity_y, mass, radius, color, gravity_const) 
        VALUES ('$planetarySystemId', '$positionX', '$positionY', '$velocityX', '$velocityY', '$mass', '$radius', '$color', '$gravityConst')";

if (mysqli_query($conn, $sql)) {
    $lastId = mysqli_insert_id($conn);
    $obj->id = $lastId;

    $json = json_encode($obj);
    echo $json;
}

mysqli_close($conn);
