// DOM Elements
const signupForm = document.getElementById("signupForm")
const firstNameInput = document.getElementById("firstName")
const lastNameInput = document.getElementById("lastName")
const emailInput = document.getElementById("email")
const phoneInput = document.getElementById("phone")
const passwordInput = document.getElementById("password")
const confirmPasswordInput = document.getElementById("confirmPassword")
const passwordToggle = document.getElementById("passwordToggle")
const confirmPasswordToggle = document.getElementById("confirmPasswordToggle")
const agreeTermsCheckbox = document.getElementById("agreeTerms")
const newsletterCheckbox = document.getElementById("newsletter")
const signupBtn = document.getElementById("signupBtn")
const successModal = document.getElementById("successModal")
const verificationModal = document.getElementById("verificationModal")
const socialBtns = document.querySelectorAll(".social-btn")

// Validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+]?[1-9][\d]{0,15}$/
const namePattern = /^[a-zA-Z\s]{2,30}$/

// Password strength levels
const passwordStrengthLevels = {
  weak: { score: 1, text: "Weak password", class: "weak" },
  fair: { score: 2, text: "Fair password", class: "fair" },
  good: { score: 3, text: "Good password", class: "good" },
  strong: { score: 4, text: "Strong password", class: "strong" },
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  addInputAnimations()
  initializeNavbar()
  addRippleEffects()
})

// Event Listeners
function initializeEventListeners() {
  // Form submission
  signupForm.addEventListener("submit", handleFormSubmit)

  // Password toggles
  passwordToggle.addEventListener("click", () => togglePasswordVisibility("password"))
  confirmPasswordToggle.addEventListener("click", () => togglePasswordVisibility("confirmPassword"))

  // Real-time validation
  firstNameInput.addEventListener("blur", () => validateField("firstName"))
  lastNameInput.addEventListener("blur", () => validateField("lastName"))
  emailInput.addEventListener("blur", () => validateField("email"))
  phoneInput.addEventListener("blur", () => validateField("phone"))
  passwordInput.addEventListener("input", handlePasswordInput)
  passwordInput.addEventListener("blur", () => validateField("password"))
  confirmPasswordInput.addEventListener("blur", () => validateField("confirmPassword"))

  // Clear errors on input
  const inputs = [firstNameInput, lastNameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput]
  inputs.forEach((input) => {
    input.addEventListener("input", () => clearError(input.name))
  })

  // Email validation with visual feedback
  emailInput.addEventListener("input", handleEmailInput)

  // Social login buttons
  socialBtns.forEach((btn) => {
    btn.addEventListener("click", handleSocialLogin)
  })

  // Terms checkbox validation
  agreeTermsCheckbox.addEventListener("change", validateTermsAgreement)

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyboardNavigation)
}

// Form submission handler
async function handleFormSubmit(e) {
  e.preventDefault()

  // Validate all fields
  const validations = [
    validateField("firstName"),
    validateField("lastName"),
    validateField("email"),
    validateField("phone"),
    validateField("password"),
    validateField("confirmPassword"),
    validateTermsAgreement(),
  ]

  const isFormValid = validations.every((validation) => validation)

  if (!isFormValid) {
    shakeForm()
    return
  }

  // Show loading state
  showLoadingState()

  try {
    // Simulate API call
    await simulateSignup()

    // Hide loading state
    hideLoadingState()

    // Show success modal
    showSuccessModal()

    // Reset form after delay
    setTimeout(() => {
      signupForm.reset()
      resetPasswordStrength()
    }, 2000)
  } catch (error) {
    hideLoadingState()
    showError("general", "Registration failed. Please try again.")
    shakeForm()
  }
}

// Field validation
function validateField(fieldName) {
  const input = document.getElementById(fieldName)
  const value = input.value.trim()
  let isValid = true
  let errorMessage = ""

  switch (fieldName) {
    case "firstName":
    case "lastName":
      if (!value) {
        errorMessage = `${fieldName === "firstName" ? "First" : "Last"} name is required`
        isValid = false
      } else if (!namePattern.test(value)) {
        errorMessage = "Please enter a valid name (2-30 characters, letters only)"
        isValid = false
      }
      break

    case "email":
      if (!value) {
        errorMessage = "Email is required"
        isValid = false
      } else if (!emailPattern.test(value)) {
        errorMessage = "Please enter a valid email address"
        isValid = false
      }
      break

    case "phone":
      if (value && !phonePattern.test(value)) {
        errorMessage = "Please enter a valid phone number"
        isValid = false
      }
      break

    case "password":
      if (!value) {
        errorMessage = "Password is required"
        isValid = false
      } else if (value.length < 8) {
        errorMessage = "Password must be at least 8 characters long"
        isValid = false
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        errorMessage = "Password must contain uppercase, lowercase, and number"
        isValid = false
      }
      break

    case "confirmPassword":
      if (!value) {
        errorMessage = "Please confirm your password"
        isValid = false
      } else if (value !== passwordInput.value) {
        errorMessage = "Passwords do not match"
        isValid = false
      }
      break
  }

  if (!isValid) {
    showError(fieldName, errorMessage)
    input.classList.add("error")
    input.classList.remove("success")
  } else {
    clearError(fieldName)
    input.classList.remove("error")
    input.classList.add("success")

    // Add success icon for email
    if (fieldName === "email") {
      const validationIcon = document.getElementById("emailValidation")
      validationIcon.innerHTML = '<i class="fas fa-check"></i>'
      validationIcon.classList.add("success")
      validationIcon.classList.remove("error")
    }
  }

  return isValid
}

// Handle email input with real-time validation
function handleEmailInput() {
  const value = emailInput.value.trim()
  const validationIcon = document.getElementById("emailValidation")

  if (value.length === 0) {
    validationIcon.classList.remove("success", "error")
    validationIcon.innerHTML = ""
  } else if (emailPattern.test(value)) {
    validationIcon.innerHTML = '<i class="fas fa-check"></i>'
    validationIcon.classList.add("success")
    validationIcon.classList.remove("error")
  } else {
    validationIcon.innerHTML = '<i class="fas fa-times"></i>'
    validationIcon.classList.add("error")
    validationIcon.classList.remove("success")
  }
}

// Handle password input with strength indicator
function handlePasswordInput() {
  const password = passwordInput.value
  const strengthIndicator = document.getElementById("passwordStrength")
  const strengthFill = strengthIndicator.querySelector(".strength-fill")
  const strengthText = strengthIndicator.querySelector(".strength-text")

  if (password.length === 0) {
    strengthFill.className = "strength-fill"
    strengthText.textContent = "Password strength"
    return
  }

  const strength = calculatePasswordStrength(password)
  const level = getPasswordStrengthLevel(strength)

  strengthFill.className = `strength-fill ${level.class}`
  strengthText.textContent = level.text
}

// Calculate password strength
function calculatePasswordStrength(password) {
  let score = 0

  // Length check
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // Character variety checks
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++

  return Math.min(score, 4)
}

// Get password strength level
function getPasswordStrengthLevel(score) {
  if (score <= 1) return passwordStrengthLevels.weak
  if (score === 2) return passwordStrengthLevels.fair
  if (score === 3) return passwordStrengthLevels.good
  return passwordStrengthLevels.strong
}

// Reset password strength indicator
function resetPasswordStrength() {
  const strengthFill = document.querySelector(".strength-fill")
  const strengthText = document.querySelector(".strength-text")
  strengthFill.className = "strength-fill"
  strengthText.textContent = "Password strength"
}

// Validate terms agreement
function validateTermsAgreement() {
  if (!agreeTermsCheckbox.checked) {
    showError("agreeTerms", "You must agree to the terms and conditions")
    return false
  }
  clearError("agreeTerms")
  return true
}

// Show error message
function showError(fieldName, message) {
  const errorElement = document.getElementById(fieldName + "Error")
  if (errorElement) {
    errorElement.textContent = message
    errorElement.classList.add("show")
  }
}

// Clear error message
function clearError(fieldName) {
  const errorElement = document.getElementById(fieldName + "Error")
  if (errorElement) {
    errorElement.textContent = ""
    errorElement.classList.remove("show")
  }
}

// Password visibility toggle
function togglePasswordVisibility(fieldName) {
  const input = document.getElementById(fieldName)
  const toggle = document.getElementById(fieldName + "Toggle")

  const type = input.getAttribute("type") === "password" ? "text" : "password"
  input.setAttribute("type", type)

  const icon = toggle.querySelector("i")
  icon.classList.toggle("fa-eye")
  icon.classList.toggle("fa-eye-slash")

  // Add animation
  toggle.style.transform = "scale(0.8)"
  setTimeout(() => {
    toggle.style.transform = "scale(1)"
  }, 150)
}

// Loading state management
function showLoadingState() {
  signupBtn.classList.add("loading")
  signupBtn.disabled = true
}

function hideLoadingState() {
  signupBtn.classList.remove("loading")
  signupBtn.disabled = false
}

// Success modal
function showSuccessModal() {
  const email = emailInput.value
  document.getElementById("verificationEmail").textContent = email
  successModal.classList.add("show")
  document.body.style.overflow = "hidden"
}

function closeModal() {
  successModal.classList.remove("show")
  document.body.style.overflow = "auto"
}

function showVerificationModal() {
  successModal.classList.remove("show")
  verificationModal.classList.add("show")
}

function closeVerificationModal() {
  verificationModal.classList.remove("show")
  document.body.style.overflow = "auto"
}

function redirectToSignIn() {
  window.location.href = "index.html"
}

function resendVerification() {
  // Simulate resending verification email
  console.log("Resending verification email...")

  // Show temporary feedback
  const btn = event.target
  const originalText = btn.textContent
  btn.textContent = "Sent!"
  btn.disabled = true

  setTimeout(() => {
    btn.textContent = originalText
    btn.disabled = false
  }, 3000)
}

// Social login handler
function handleSocialLogin(e) {
  const provider = e.currentTarget.classList.contains("google-btn") ? "Google" : "GitHub"

  // Add click animation
  e.currentTarget.style.transform = "scale(0.95)"
  setTimeout(() => {
    e.currentTarget.style.transform = "scale(1)"
  }, 150)

  // Simulate social login
  console.log(`Signing up with ${provider}...`)

  // In a real app, you would redirect to the OAuth provider
  setTimeout(() => {
    showSuccessModal()
  }, 1000)
}

// Form shake animation
function shakeForm() {
  const formContainer = document.querySelector(".form-container")
  formContainer.style.animation = "shake 0.5s ease-in-out"

  setTimeout(() => {
    formContainer.style.animation = ""
  }, 500)
}

// Input animations
function addInputAnimations() {
  const inputs = document.querySelectorAll("input")

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)"
      this.parentElement.style.transition = "transform 0.2s ease"
    })

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)"
    })
  })
}

// Navbar scroll effect
function initializeNavbar() {
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.background = "var(--background)"
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.3)"
    } else {
      navbar.style.background = "rgba(15, 23, 42, 0.95)"
      navbar.style.boxShadow = "none"
    }
  })
}

// Keyboard navigation
function handleKeyboardNavigation(e) {
  // Close modals with Escape key
  if (e.key === "Escape") {
    if (successModal.classList.contains("show")) {
      closeModal()
    }
    if (verificationModal.classList.contains("show")) {
      closeVerificationModal()
    }
  }

  // Submit form with Ctrl+Enter
  if (e.ctrlKey && e.key === "Enter") {
    signupForm.dispatchEvent(new Event("submit"))
  }
}

// Add ripple effects
function addRippleEffects() {
  const buttons = document.querySelectorAll(".signup-btn, .social-btn, .modal-btn")

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
}

// Simulate signup API call
function simulateSignup() {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate success (95% of the time)
      if (Math.random() > 0.05) {
        resolve({
          success: true,
          user: {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
          },
        })
      } else {
        reject(new Error("Signup failed"))
      }
    }, 2500)
  })
}

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".form-container, .welcome-content")
  animatedElements.forEach((el) => {
    observer.observe(el)
  })
})

// Auto-save form data to localStorage (optional feature)
function saveFormData() {
  const formData = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    newsletter: newsletterCheckbox.checked,
  }
  localStorage.setItem("signupFormData", JSON.stringify(formData))
}

function loadFormData() {
  const savedData = localStorage.getItem("signupFormData")
  if (savedData) {
    const formData = JSON.parse(savedData)
    firstNameInput.value = formData.firstName || ""
    lastNameInput.value = formData.lastName || ""
    emailInput.value = formData.email || ""
    phoneInput.value = formData.phone || ""
    newsletterCheckbox.checked = formData.newsletter || false
  }
}

// Save form data on input
document.addEventListener("DOMContentLoaded", () => {
  loadFormData()

  const inputs = [firstNameInput, lastNameInput, emailInput, phoneInput, newsletterCheckbox]
  inputs.forEach((input) => {
    input.addEventListener("input", saveFormData)
    input.addEventListener("change", saveFormData)
  })
})

// Clear saved data on successful signup
function clearSavedFormData() {
  localStorage.removeItem("signupFormData")
}

// Console welcome message
console.log("%c🎉 Welcome to the Sign Up Page!", "color: #06b6d4; font-size: 16px; font-weight: bold;")
console.log("%cNew features include:", "color: #cbd5e1; font-size: 14px;")
console.log("%c• Advanced form validation", "color: #94a3b8; font-size: 12px;")
console.log("%c• Password strength indicator", "color: #94a3b8; font-size: 12px;")
console.log("%c• Real-time email validation", "color: #94a3b8; font-size: 12px;")
console.log("%c• Auto-save form data", "color: #94a3b8; font-size: 12px;")
console.log("%c• Enhanced user experience", "color: #94a3b8; font-size: 12px;")
