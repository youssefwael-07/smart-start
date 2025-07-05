<?php
require_once "db.php";

$username = $email = $password = "";
$success = $error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $firstName = trim($_POST["firstName"] ?? '');
    $lastName = trim($_POST["lastName"] ?? '');
    $username = $firstName . ' ' . $lastName;
    $email = trim($_POST["email"] ?? '');
    $passwordRaw = trim($_POST["password"] ?? '');
    $confirmPassword = trim($_POST["confirmPassword"] ?? '');
    $agree = isset($_POST["agreeTerms"]);

    if ($username && $email && $passwordRaw && $confirmPassword && $agree) {
        if ($passwordRaw !== $confirmPassword) {
            $error = "Passwords do not match.";
        } else {
            $password = password_hash($passwordRaw, PASSWORD_DEFAULT);

            $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $username, $email, $password);

            if ($stmt->execute()) {
                $success = "Account created successfully!";
                echo "<script>
                    document.addEventListener('DOMContentLoaded', function() {
                        document.getElementById('successModal').style.display = 'flex';
                    });
                </script>";
            } else {
                $error = "Error: " . $conn->error;
            }

            $stmt->close();
        }
    } else {
        $error = "Please fill in all fields.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - Your App</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Background Animation -->
    <div class="bg-animation">
        <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
            <div class="shape shape-5"></div>
            <div class="shape shape-6"></div>
        </div>
    </div>

    <main class="main-content">
        <div class="signup-container">
            <div class="welcome-section">
                <div class="welcome-content">
                    <h1 class="welcome-title">Join Our Community!</h1>
                    <p class="welcome-description">
                        Create your account and start your journey with us. Join thousands of satisfied users.
                    </p>
                    <div class="feature-list">
                        <div class="feature-item">
                            <i class="fas fa-rocket"></i>
                            <span>Quick Setup</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Secure & Private</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-users"></i>
                            <span>Join 10k+ Users</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-support"></i>
                            <span>24/7 Support</span>
                        </div>
                    </div>
                    <div class="testimonial">
                        <div class="testimonial-content">
                            <i class="fas fa-quote-left"></i>
                            <p>"Amazing platform! The setup was incredibly smooth and the features are exactly what I needed."</p>
                            <div class="testimonial-author">
                                <strong>Sarah Johnson</strong>
                                <span>Product Manager</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="form-container">
                    <div class="form-header">
                        <h2>Create Account</h2>
                        <p>Fill in your information to get started</p>
                    </div>

                    <?php if ($success): ?>
                        <div class="success-message"><?php echo $success; ?></div>
                    <?php endif; ?>

                    <?php if ($error): ?>
                        <div class="error-message"><?php echo $error; ?></div>
                    <?php endif; ?>

                    <form class="signup-form" id="signupForm" method="POST">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <div class="input-wrapper">
                                    <i class="fas fa-user input-icon"></i>
                                    <input type="text" id="firstName" name="firstName" placeholder="Enter your first name" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <div class="input-wrapper">
                                    <i class="fas fa-user input-icon"></i>
                                    <input type="text" id="lastName" name="lastName" placeholder="Enter your last name" required>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <div class="input-wrapper">
                                <i class="fas fa-envelope input-icon"></i>
                                <input type="email" id="email" name="email" placeholder="Enter your email" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="password">Password</label>
                                <div class="input-wrapper">
                                    <i class="fas fa-lock input-icon"></i>
                                    <input type="password" id="password" name="password" placeholder="Create a password" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <div class="input-wrapper">
                                    <i class="fas fa-lock input-icon"></i>
                                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required>
                                </div>
                            </div>
                        </div>

                        <div class="form-options">
                            <label class="checkbox-container">
                                <input type="checkbox" id="agreeTerms" name="agreeTerms" required>
                                <span class="checkmark"></span>
                                I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
                            </label>
                        </div>

                        <button type="submit" class="signup-btn">Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    </main>

    <div class="modal-overlay" id="successModal" style="display:none">
        <div class="modal">
            <div class="modal-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Account Created Successfully!</h3>
                <p>Welcome to our community! We've sent a verification email to your inbox.</p>
                <div class="modal-actions">
                    <button class="modal-btn primary" onclick="redirectToSignIn()">Go to Sign In</button>
                    <button class="modal-btn secondary" onclick="closeModal()">Continue</button>
                </div>
            </div>
        </div>
    </div>

    <script>
    document.getElementById("signupForm").addEventListener("submit", function () {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const usernameField = document.createElement("input");
        usernameField.type = "hidden";
        usernameField.name = "username";
        usernameField.value = firstName + " " + lastName;
        this.appendChild(usernameField);
    });

    function redirectToSignIn() {
        window.location.href = "index.html";
    }
    function closeModal() {
        document.getElementById("successModal").style.display = "none";
    }
    </script>
</body>
</html>
