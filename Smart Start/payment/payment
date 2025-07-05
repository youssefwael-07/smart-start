<?php

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'] ?? '';
    $card_number = $_POST['card_number'] ?? '';
    $expiry = $_POST['expiry'] ?? '';
    $cvv = $_POST['cvv'] ?? '';
    $cardholder = $_POST['cardholder'] ?? '';
    $country = $_POST['country'] ?? '';
    $zip = $_POST['zip'] ?? '';
    $total = $_POST['total'] ?? '0.00';

    // تحقق بسيط
    if (!$email || !$card_number || !$expiry || !$cvv || !$cardholder || !$country || !$zip) {
        echo "Please fill all required fields.";
        exit;
    }

    // إدخال البيانات باستخدام bind_param
    $stmt = $conn->prepare("INSERT INTO payments (email, card_number, expiry, cvv, cardholder, country, zip, total_amount)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    // "sssssssd" معناها:
    // s = string, d = double
    $stmt->bind_param("sssssssd", $email, $card_number, $expiry, $cvv, $cardholder, $country, $zip, $total);

    $success = $stmt->execute();

    if ($success) {
        echo "✅ Payment recorded successfully!";
    } else {
        echo "❌ Payment failed. Please try again.";
    }

    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Session Payment - Dr. Sarah Ahmed</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
   <link rel="stylesheet" href="../payment/payment.css">
</head>
<body>
    <!-- Animated Background Particles -->
    <div class="bg-particles" id="particles"></div>

    <!-- Header -->
    <div class="header">
        <a href="../details/index.html" class="back-btn">
            <i class="fas fa-arrow-left"></i>
            Back to Profile
        </a>
    </div>

    <!-- Main Container -->
    <div class="container">
        <div class="payment-wrapper">
            <!-- Order Summary Sidebar -->
            <div class="order-summary">
                <h2 class="section-title">
                    <i class="fas fa-receipt"></i>
                    Session Summary
                </h2>
                
                <!-- Mentor Info -->
                <div class="mentor-info">
                    <div class="mentor-avatar">
                        <i class="fas fa-user-md"></i>
                    </div>
                    <div class="mentor-details">
                        <h3>Dr. Sarah Ahmed</h3>
                        <p>Cardiologist & Medical Mentor</p>
                        <p><i class="fas fa-star" style="color: var(--warning);"></i> 4.9 (127 reviews)</p>
                    </div>
                </div>
                
                <div class="order-item">
                    <div class="item-details">
                        <div class="item-icon">
                            <i class="fas fa-video"></i>
                        </div>
                        <div class="item-info">
                            <h4>Premium Session</h4>
                            <p>20 minutes • Video consultation</p>
                        </div>
                    </div>
                    <div class="item-price">$25.00</div>
                </div>
                
                <div class="order-item">
                    <div class="item-details">
                        <div class="item-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="item-info">
                            <h4>Session Notes</h4>
                            <p>Detailed written summary</p>
                        </div>
                    </div>
                    <div class="item-price">Included</div>
                </div>
                
                <div class="order-item">
                    <div class="item-details">
                        <div class="item-icon">
                            <i class="fas fa-headset"></i>
                        </div>
                        <div class="item-info">
                            <h4>Follow-up Support</h4>
                            <p>Email support for 7 days</p>
                        </div>
                    </div>
                    <div class="item-price">Included</div>
                </div>

                <div class="total-section">
                    <div class="total-row">
                        <span>Session Fee:</span>
                        <span>$25.00</span>
                    </div>
                    <div class="total-row">
                        <span>Platform Fee:</span>
                        <span>$2.50</span>
                    </div>
                    <div class="total-row">
                        <span>Tax:</span>
                        <span>$2.20</span>
                    </div>
                    <div class="total-row final">
                        <span>Total:</span>
                        <span id="total">$29.70</span>
                    </div>
                </div>
            </div>

            <!-- Payment Form Section -->
            <div class="payment-section">
                <h2 class="section-title">
                    <i class="fas fa-credit-card"></i>
                    Payment Details
                </h2>
                
                <!-- Credit Card Visual -->
                <div class="credit-card">
                    <div class="card-header">
                        <div class="card-brand">MENTORLINK PREMIUM</div>
                        <div class="card-type">VISA</div>
                    </div>
                    <div class="card-number-display" id="card-display">•••• •••• •••• ••••</div>
                    <div class="card-details">
                        <div>
                            <div style="font-size: 0.7rem; opacity: 0.8;">CARDHOLDER</div>
                            <div id="name-display">YOUR NAME</div>
                        </div>
                        <div>
                            <div style="font-size: 0.7rem; opacity: 0.8;">EXPIRES</div>
                            <div id="expiry-display">MM/YY</div>
                        </div>
                    </div>
                </div>

                <div class="payment-methods">
                    <div class="payment-method active" data-method="card">
                        <span><i class="fas fa-credit-card"></i> Credit Card</span>
                    </div>
                    <div class="payment-method" data-method="paypal">
                        <span><i class="fab fa-paypal"></i> PayPal</span>
                    </div>
                    <div class="payment-method" data-method="apple">
                        <span><i class="fab fa-apple-pay"></i> Apple Pay</span>
                    </div>
                </div>

                <form id="payment-form">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <div class="input-container">
                            <input type="email" id="email" placeholder="your@email.com" required>
                            <div class="input-icon" id="email-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="card-number">Card Number</label>
                        <div class="input-container">
                            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
                            <div class="input-icon" id="card-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiry">Expiry Date</label>
                            <div class="input-container">
                                <input type="text" id="expiry" placeholder="MM/YY" maxlength="5" required>
                                <div class="input-icon" id="expiry-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="cvv">CVV</label>
                            <div class="input-container">
                                <input type="text" id="cvv" placeholder="123" maxlength="4" required>
                                <div class="input-icon" id="cvv-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="cardholder">Cardholder Name</label>
                        <div class="input-container">
                            <input type="text" id="cardholder" placeholder="John Doe" required>
                            <div class="input-icon" id="name-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="country">Country</label>
                            <select id="country" required>
                                <option value="">Select Country</option>
                                <option value="US">🇺🇸 United States</option>
                                <option value="CA">🇨🇦 Canada</option>
                                <option value="UK">🇬🇧 United Kingdom</option>
                                <option value="AU">🇦🇺 Australia</option>
                                <option value="DE">🇩🇪 Germany</option>
                                <option value="FR">🇫🇷 France</option>
                                <option value="EG">🇪🇬 Egypt</option>
                                <option value="SA">🇸🇦 Saudi Arabia</option>
                                <option value="AE">🇦🇪 UAE</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="zip">ZIP Code</label>
                            <div class="input-container">
                                <input type="text" id="zip" placeholder="10001" required>
                                <div class="input-icon" id="zip-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="submit-btn" id="submit-btn">
                        <div class="loading-spinner" id="loading"></div>
                        <i class="fas fa-lock" id="lock-icon"></i>
                        <span id="btn-text">Complete Payment - $29.70</span>
                    </button>
                </form>

                <div class="security-features">
                    <div class="security-item">
                        <i class="fas fa-shield-alt security-icon"></i>
                        <div>SSL Encrypted</div>
                    </div>
                    <div class="security-item">
                        <i class="fas fa-check-circle security-icon"></i>
                        <div>PCI Compliant</div>
                    </div>
                    <div class="security-item">
                        <i class="fas fa-university security-icon"></i>
                        <div>Bank Level Security</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast" id="toast"></div>
<script src="../payment/payment.js"></script>
   
</body>
</html>