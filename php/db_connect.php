<?php
    require_once ('./db_config.php'); 
    
    function createLocalDBconn() 
    {
        // Create connection
        $conn = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);

        // Check connection
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
            return null;
        }
        return $conn;
    }
?>