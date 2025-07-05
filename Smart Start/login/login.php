<?php
require_once "db.php";

$email = $password = "";
$error = "";
$loginSuccess = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    if ($email && $password) {
        $sql = "SELECT * FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();

            if (password_verify($password, $user["password"])) {
                session_start();
                $_SESSION["id"] = $user["id"];
                $_SESSION["username"] = $user["username"];
                $loginSuccess = true;
            } else {
                $error = "Invalid email or password.";
            }
        } else {
            $error = "Invalid email or password.";
        }

        $stmt->close();
    } else {
        $error = "Please enter both email and password.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - Your App</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="bg-animation">
        <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
            <div class="shape shape-5"></div>
        </div>
    </div>

    <main class="main-content">
        <div class="signin-container">
            <div class="welcome-section">
                <div class="welcome-content">
                    <h1 class="welcome-title">Welcome Back!</h1>
                    <p class="welcome-description">Sign in to access your account and continue your journey with us.</p>
                    <div class="feature-list">
                        <div class="feature-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Secure Authentication</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-rocket"></i>
                            <span>Fast & Reliable</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-users"></i>
                            <span>Trusted by Thousands</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="form-container">
                    <div class="form-header">
                        <h2>Sign In</h2>
                        <?php if (!empty($error)): ?>
                            <div class="error-message">⚠️ <?php echo $error; ?></div>
                        <?php endif; ?>
                    </div>

                    <form class="signin-form" id="signinForm" method="POST">
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <div class="input-wrapper">
                                <i class="fas fa-envelope input-icon"></i>
                                <input type="email" id="email" name="email" placeholder="Enter your email" required>
                            </div>
                            <span class="error-message" id="emailError"></span>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <div class="input-wrapper">
                                <i class="fas fa-lock input-icon"></i>
                                <input type="password" id="password" name="password" placeholder="Enter your password" required>
                                <button type="button" class="password-toggle" id="passwordToggle">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <span class="error-message" id="passwordError"></span>
                        </div>

                        <div class="form-options">
                            <label class="checkbox-container">
                                <input type="checkbox" id="rememberMe" name="rememberMe">
                                <span class="checkmark"></span>
                                Remember me
                            </label>
                            <a href="#" class="forgot-password">Forgot Password?</a>
                        </div>

                        <button type="submit" class="signin-btn" id="signinBtn">
                            <span class="btn-text">Sign In</span>
                            <div class="btn-loader">
                                <div class="spinner"></div>
                            </div>
                        </button>

                        <div class="form-footer">
                            <p>Don't have an account? <a href="./signup/.signup.php" class="signup-link">Sign up here</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>

    <?php if ($loginSuccess): ?>
    <div class="modal-overlay" id="successModal" style="display: flex">
        <div class="modal">
            <div class="modal-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Welcome Back!</h3>
                <p>You have successfully signed in to your account.</p>
                <button class="modal-btn" onclick="continueToHome()">Continue</button>
            </div>
        </div>
    </div>
    <script>
        function continueToHome() {
            window.location.href = "index.html";
        }
    </script>
    <?php endif; ?>

    <script src="script.js"></script>
</body>
</html>
