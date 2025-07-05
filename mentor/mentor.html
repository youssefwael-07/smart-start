<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once "db.php";

// استقبال مدخلات البحث والفلترة
$search = $_GET['search'] ?? '';
$interest = $_GET['interest'] ?? 'all';

// بناء الاستعلام
$sql = "SELECT * FROM contact_messages WHERE 1";

// شرط البحث
if (!empty($search)) {
    $search = $conn->real_escape_string($search);
    $sql .= " AND (name LIKE '%$search%' OR email LIKE '%$search%' OR interest LIKE '%$search%' OR message LIKE '%$search%')";
}

// شرط الفلترة
if ($interest !== 'all') {
    $interest = $conn->real_escape_string($interest);
    $sql .= " AND interest = '$interest'";
}

// تنفيذ الاستعلام
$result = $conn->query($sql);
if (!$result) {
    die("SQL Error: " . $conn->error);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Find Your Mentor - MentorHub</title>
    <link rel="stylesheet" href="mentor.css">
    <link rel="stylesheet" href="../nav-user/nav-user.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-user" id="navbar2">
        <div class="nav-container">
            <div class="nav-logo">
                <div class="logo-icon"></div>
                <span class="logo-text">BrandName</span>
            </div>

            <ul class="nav-menu" id="navMenu2">
                <li><a href="../home/index.html" class="nav-link">Home</a></li>
                <li><a href="../mentor/index.html" class="nav-link">mentor</a></li>
                <li><a href="../contact-us/contact.html" class="nav-link">contact-us</a></li>
                <li><a href="../about-us/about.html" class="nav-link">about-us</a></li>
            </ul>

            <div class="user-profile" id="userProfile">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMzYjgyZjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTIwIDIxVjE5QTQgNCAwIDAgMCAxNiAxNUg4QTQgNCAwIDAgMCA0IDE5VjIxIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K" alt="User" class="user-avatar">
                <div class="dropdown" id="dropdown">
                    <a href="../user/user.html">Profile</a>
                    <a href="../upload courses/upload.html">upload</a>
                    <a href="../dowenload/dowenload.html">dowenload</a>
                    <a href="../login/login.php">Logout</a>
                </div>
            </div>

            <div class="hamburger" id="hamburger2">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>


    <!-- Main Content -->
    <main class="main-content">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <h1>Find Your Perfect Mentor</h1>
                <p>Connect with experienced professionals who can guide your career journey</p>
                
                <!-- Search Bar -->
                <div class="search-container">
                    <div class="search-bar">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" id="searchInput" placeholder="Search by skills, expertise, or name..." class="search-input">
                        <button class="search-btn" onclick="performSearch()">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Filters Section -->
        <section class="filters-section">
            <div class="filters-container">
                <h3>Filter Mentors</h3>
                <div class="filters-grid">
                    <div class="filter-group">
                        <label for="skillFilter">Skills</label>
                        <select id="skillFilter" onchange="applyFilters()">
                            <option value="">All Skills</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="react">React</option>
                            <option value="nodejs">Node.js</option>
                            <option value="design">UI/UX Design</option>
                            <option value="marketing">Digital Marketing</option>
                            <option value="data-science">Data Science</option>
                            <option value="product-management">Product Management</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="experienceFilter">Experience Level</label>
                        <select id="experienceFilter" onchange="applyFilters()">
                            <option value="">All Levels</option>
                            <option value="junior">Junior (1-3 years)</option>
                            <option value="mid">Mid-level (3-7 years)</option>
                            <option value="senior">Senior (7-12 years)</option>
                            <option value="expert">Expert (12+ years)</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="availabilityFilter">Availability</label>
                        <select id="availabilityFilter" onchange="applyFilters()">
                            <option value="">All</option>
                            <option value="available">Available Now</option>
                            <option value="busy">Limited Availability</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="ratingFilter">Rating</label>
                        <select id="ratingFilter" onchange="applyFilters()">
                            <option value="">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4+ Stars</option>
                            <option value="3">3+ Stars</option>
                        </select>
                    </div>
                </div>
                
                <button class="clear-filters-btn" onclick="clearFilters()">
                    <i class="fas fa-times"></i> Clear Filters
                </button>
            </div>
        </section>

        <!-- Results Section -->
        <section class="results-section">
            <div class="results-header">
                <h2>Available Mentors</h2>
                <div class="results-count">
                    <span id="resultsCount">12</span> mentors found
                </div>
            </div>
            
            <!-- Mentor Cards Grid -->
            <div  class="mentors-grid" id="mentorsGrid">
                <!-- Mentor cards will be populated by JavaScript -->
            </div>
            
            <!-- Load More Button -->
            <div class="load-more-container">
                <button class="load-more-btn" onclick="loadMoreMentors()">
                    <i class="fas fa-plus"></i> Load More Mentors
                </button>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>MentorHub</h4>
                <p>Connecting mentors and mentees worldwide</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <a href="#">Find Mentors</a>
                <a href="#">Become a Mentor</a>
                <a href="#">About Us</a>
            </div>
            <div class="footer-section">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact Us</a>
                <a href="#">Privacy Policy</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 MentorHub. All rights reserved.</p>
        </div>
    </footer>

    <script src="mentor.js"></script>
    <script src="../nav-user/nav-user.js"></script>
    scr
</body>
</html>