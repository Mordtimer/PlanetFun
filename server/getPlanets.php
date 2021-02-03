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
while ($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
}
echo json_encode($rows);

mysqli_close($conn);
