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
$obj->planetarySystemId = (int)$planetarySystemId;
$obj->position_x = (float)$positionX;
$obj->position_y = (float)$positionY;
$obj->velocity_x = (float)$velocityX;
$obj->velocity_y = (float)$velocityY;
$obj->mass = (float)$mass;
$obj->radius = (float)$radius;
$obj->color = $color;
$obj->gravity_const = (float)$gravityConst;

$sql = "INSERT INTO planet (planetary_system_id, position_x, position_y, velocity_x, velocity_y, mass, radius, color, gravity_const) 
        VALUES ('$planetarySystemId', '$positionX', '$positionY', '$velocityX', '$velocityY', '$mass', '$radius', '$color', '$gravityConst')";

if (mysqli_query($conn, $sql)) {
    $lastId = mysqli_insert_id($conn);
    $obj->id = (int)$lastId;

    $json = json_encode($obj);
    echo $json;
}

mysqli_close($conn);
