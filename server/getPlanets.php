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

$id = $_POST["planetary_system_id"];

$sql = "SELECT * FROM planet WHERE planetary_system_id=$id";

$result = mysqli_query($conn, $sql);

$rows = [];
while ($row = mysqli_fetch_assoc($result)) {
    $obj = new stdClass();
    $obj->id = (int)$row["id"];
    $obj->planetary_system_id = (int)$row["planetary_system_id"];
    $obj->position_x = (float)$row["position_x"];
    $obj->position_y = (float)$row["position_y"];
    $obj->velocity_x = (float)$row["velocity_x"];
    $obj->velocity_y = (float)$row["velocity_y"];
    $obj->mass = (float)$row["mass"];
    $obj->radius = (float)$row["radius"];
    $obj->color = $row["color"];
    $obj->gravity_const = (float)$row["gravity_const"];
    $rows[] = $obj;
}
echo json_encode($rows);

mysqli_close($conn);
