<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $session_type = trim($_POST["session_type"] ?? '');
    $time_slot = trim($_POST["time_slot"] ?? '');

    if (empty($session_type) || empty($time_slot)) {
        echo "<pre>";
        print_r($_POST); // Debug: Show what is actually submitted
        die("❌ Invalid input. Please select session type and time.");
    }

    // الاتصال بقاعدة البيانات
    $conn = new mysqli("localhost", "root", "", "mentor");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("INSERT INTO bookings (session_type, time_slot) VALUES (?, ?)");
    $stmt->bind_param("ss", $session_type, $time_slot);

    if ($stmt->execute()) {
        echo "✅ Booking confirmed for <strong>$session_type</strong> at <strong>$time_slot</strong>";
    } else {
        echo "❌ Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Invalid access.";
}
?>
