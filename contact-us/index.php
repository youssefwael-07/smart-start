<?php
// تسجيل الأخطاء في ملف
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// عرض الأخطاء (فقط للتطوير)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// التحقق من وجود ملف قاعدة البيانات
if (!file_exists("db.php")) {
    die("Database configuration file (db.php) not found!");
}

require_once "db.php";

// التحقق من الاتصال
if (!isset($conn) || $conn->connect_error) {
    die("Database connection failed!");
}

// استقبال البيانات من النموذج
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name       = trim($_POST["name"]);
    $email      = trim($_POST["email"]);
    $phone      = trim($_POST["phone"]);
    $user_type  = trim($_POST["user_type"]);
    $subject    = trim($_POST["subject"]);
    $message    = trim($_POST["message"]);

    // التحقق من القيم المطلوبة
    if ($name && $email && $user_type && $subject && $message) {
        $stmt = $conn->prepare("INSERT INTO contact1 (name, email, phone, user_type, subject, message) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $name, $email, $phone, $user_type, $subject, $message);

        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Please fill all required fields.";
    }
}

$conn->close();
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - Smart Start</title>
    <link rel="stylesheet" href="contact.css">
    <link rel="stylesheet" href="../nav-user/nav-user.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <nav class="navbar navbar-user" id="navbar2">
        <div class="nav-container">
            <div class="nav-logo">
                <div class="logo-icon"></div>
                <span class="logo-text">SmartStart</span>
            </div>

            <ul class="nav-menu" id="navMenu2">
                <li><a href="../home/index.html" class="nav-link">Home</a></li>
                <li><a href="../mentor/mentor.html" class="nav-link">mentor</a></li>
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

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>Get in Touch</h1>
                <p>Have questions about our mentorship platform? Need support with your career guidance journey? We're here to help students and graduates connect with the right professional mentors.</p>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
        <div class="container">
            <div class="contact-grid">
                <!-- Contact Form -->
                <div class="contact-form-container">
                    <h2>Send us a Message</h2>
                    <form class="contact-form" id="contactForm">
                        <div class="form-group">
                            <label for="name">Full Name *</label>
                            <input type="text" id="name" name="name" required>
                            <span class="error-message" id="nameError"></span>
                        </div>

                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email" id="email" name="email" required>
                            <span class="error-message" id="emailError"></span>
                        </div>

                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone">
                        </div>

                        <div class="form-group">
                            <label for="userType">I am a *</label>
                            <select id="userType" name="userType" required>
                                <option value="">Select your role</option>
                                <option value="student">Student</option>
                                <option value="graduate">Recent Graduate</option>
                                <option value="mentor">Potential Mentor</option>
                                <option value="institution">School/University Representative</option>
                                <option value="other">Other</option>
                            </select>
                            <span class="error-message" id="userTypeError"></span>
                        </div>

                        <div class="form-group">
                            <label for="subject">Subject *</label>
                            <select id="subject" name="subject" required>
                                <option value="">Select a subject</option>
                                <option value="mentorship">Mentorship Inquiry</option>
                                <option value="technical">Technical Support</option>
                                <option value="partnership">Partnership Opportunity</option>
                                <option value="feedback">Feedback</option>
                                <option value="other">Other</option>
                            </select>
                            <span class="error-message" id="subjectError"></span>
                        </div>

                        <div class="form-group">
                            <label for="message">Message *</label>
                            <textarea id="message" name="message" rows="5" placeholder="Tell us how we can help you with your career guidance journey..." required></textarea>
                            <span class="error-message" id="messageError"></span>
                        </div>

                        <button type="submit" class="submit-btn">
                            <span class="btn-text">Send Message</span>
                            <span class="btn-loading" style="display: none;">Sending...</span>
                        </button>
                    </form>

                    <div class="success-message" id="successMessage" style="display: none;">
                        <h3>Message Sent Successfully!</h3>
                        <p>Thank you for contacting Smart Start. We'll get back to you within 24 hours to help with your career guidance needs.</p>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="contact-info">
                    <h2>Contact Information</h2>
                    
                    <div class="info-card">
                        <div class="info-icon">📧</div>
                        <div class="info-content">
                            <h3>Email Us</h3>
                            <p>support@smartstart.com</p>
                            <p>partnerships@smartstart.com</p>
                        </div>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">📞</div>
                        <div class="info-content">
                            <h3>Call Us</h3>
                            <p>+1 (555) 123-4567</p>
                            <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                        </div>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">💬</div>
                        <div class="info-content">
                            <h3>Live Chat</h3>
                            <p>Available 24/7 for urgent inquiries</p>
                            <button class="chat-btn">Start Chat</button>
                        </div>
                    </div>

                    <div class="info-card">
                        <div class="info-icon">🎯</div>
                        <div class="info-content">
                            <h3>Our Mission</h3>
                            <p>Connecting students and graduates with professional mentors for personalized career guidance and real-world insights.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
        <div class="container">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-grid">
                <div class="faq-item">
                    <h3>How do I book a mentorship session?</h3>
                    <p>Simply browse our mentor profiles, select a mentor that matches your field of interest, and book a 20-minute session directly through our platform.</p>
                </div>
                <div class="faq-item">
                    <h3>Are the sessions really free?</h3>
                    <p>We offer both free introductory sessions and premium sessions at symbolic prices. Many mentors provide their first session free to help students get started.</p>
                </div>
                <div class="faq-item">
                    <h3>Can schools partner with Smart Start?</h3>
                    <p>Yes! We offer institutional partnerships to integrate career guidance into your school's curriculum. Contact us for custom solutions.</p>
                </div>
                <div class="faq-item">
                    <h3>How do I become a mentor?</h3>
                    <p>If you're a professional with experience to share, apply through our mentor application process. We verify credentials and provide training.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Smart Start</h3>
                    <p>Empowering students and graduates with professional career guidance through experienced mentors.</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#mentors">Find Mentors</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#help">Help Center</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Smart Start. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="contact.js"></script>
    <script src="../nav-user/nav-user.js"></script>
</body>
</html>