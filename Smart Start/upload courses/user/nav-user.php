<?php
session_start();
// Get the profile image with a timestamp to prevent caching
$image = isset($_SESSION['profile_image']) ? 'uploads/' . $_SESSION['profile_image'] : 'default.png';
// Add timestamp to prevent browser caching
$image_with_timestamp = $image . '?v=' . time();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Navigation Bar - User Profile</title>
    <link rel="stylesheet" href="./nav-user.css">
</head>
<body>

<nav class="navbar navbar-user" id="navbar2">
    <div class="nav-container">
        <div class="nav-logo">
            <div class="logo-icon"></div>
            <span class="logo-text">BrandName</span>
        </div>

        <ul class="nav-menu" id="navMenu2">
            <li><a href="#home" class="nav-link">Home</a></li>
            <li><a href="#about" class="nav-link">About</a></li>
            <li><a href="#services" class="nav-link">Services</a></li>
            <li><a href="#portfolio" class="nav-link">Portfolio</a></li>
            <li><a href="#contact" class="nav-link">Contact</a></li>
        </ul>

        <div class="user-profile" id="userProfile">
            <img src="<?php echo htmlspecialchars($image_with_timestamp); ?>" 
                 alt="User" 
                 class="user-avatar" 
                 style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"
                 onerror="this.src='default.png'">
            <div class="dropdown" id="dropdown">
                <a href="profile-1.php">Profile</a>
                <a href="#settings">Settings</a>
                <a href="#logout">Logout</a>
            </div>
        </div>

        <div class="hamburger" id="hamburger2">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</nav>

<script src="./nav-user.js"></script>
</body>
</html>
