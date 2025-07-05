// DOM Elements
const signinForm = document.getElementById("signinForm")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const passwordToggle = document.getElementById("passwordToggle")
const signinBtn = document.getElementById("signinBtn")
const successModal = document.getElementById("successModal")
const socialBtns = document.querySelectorAll(".social-btn")

// Form validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  addInputAnimations()
  initializeNavbar()
})

// Event Listeners
function initializeEventListeners() {
  // Form submission
  signinForm.addEventListener("submit", handleFormSubmit)

  // Password toggle
  passwordToggle.addEventListener("click", togglePasswordVisibility)

  // Real-time validation
  emailInput.addEventListener("blur", () => validateField("email"))
  passwordInput.addEventListener("blur", () => validateField("password"))

  // Clear errors on input
  emailInput.addEventListener("input", () => clearError("email"))
  passwordInput.addEventListener("input", () => clearError("password"))

  // Social login buttons
  socialBtns.forEach((btn) => {
    btn.addEventListener("click", handleSocialLogin)
  })

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyboardNavigation)
}

// Form submission handler
async function handleFormSubmit(e) {
  e.preventDefault()

  // Validate all fields
  const isEmailValid = validateField("email")
  const isPasswordValid = validateField("password")

  if (!isEmailValid || !isPasswordValid) {
    shakeForm()
    return
  }

  // Show loading state
  showLoadingState()

  try {
    // Simulate API call
    await simulateLogin()

    // Hide loading state
    hideLoadingState()

    // Show success modal
    showSuccessModal()

    // Reset form
    setTimeout(() => {
      signinForm.reset()
    }, 1000)
  } catch (error) {
    hideLoadingState()
    showError("general", "Login failed. Please try again.")
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
    case "email":
      if (!value) {
        errorMessage = "Email is required"
        isValid = false
      } else if (!emailPattern.test(value)) {
        errorMessage = "Please enter a valid email address"
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
      }
      break
  }

  if (!isValid) {
    showError(fieldName, errorMessage)
    input.classList.add("error")
  } else {
    clearError(fieldName)
    input.classList.remove("error")
  }

  return isValid
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
function togglePasswordVisibility() {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
  passwordInput.setAttribute("type", type)

  const icon = passwordToggle.querySelector("i")
  icon.classList.toggle("fa-eye")
  icon.classList.toggle("fa-eye-slash")

  // Add animation
  passwordToggle.style.transform = "scale(0.8)"
  setTimeout(() => {
    passwordToggle.style.transform = "scale(1)"
  }, 150)
}

// Loading state management
function showLoadingState() {
  signinBtn.classList.add("loading")
  signinBtn.disabled = true
}

function hideLoadingState() {
  signinBtn.classList.remove("loading")
  signinBtn.disabled = false
}

// Success modal
function showSuccessModal() {
  successModal.classList.add("show")
  document.body.style.overflow = "hidden"

  // Auto close after 3 seconds
  setTimeout(() => {
    closeModal()
  }, 3000)
}

function closeModal() {
  successModal.classList.remove("show")
  document.body.style.overflow = "auto"
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
  console.log(`Signing in with ${provider}...`)

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

// Add shake animation to CSS
const shakeKeyframes = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`

// Add shake animation to document
const style = document.createElement("style")
style.textContent = shakeKeyframes
document.head.appendChild(style)

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
  // Close modal with Escape key
  if (e.key === "Escape" && successModal.classList.contains("show")) {
    closeModal()
  }

  // Submit form with Ctrl+Enter
  if (e.ctrlKey && e.key === "Enter") {
    signinForm.dispatchEvent(new Event("submit"))
  }
}

// Simulate login API call
function simulateLogin() {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate success (90% of the time)
      if (Math.random() > 0.1) {
        resolve({ success: true, user: { email: emailInput.value } })
      } else {
        reject(new Error("Login failed"))
      }
    }, 2000)
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

// Add some interactive feedback
document.addEventListener("DOMContentLoaded", () => {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll(".signin-btn, .social-btn, .modal-btn")

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
})

// Add ripple effect styles
const rippleStyles = `
    .signin-btn, .social-btn, .modal-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`

const rippleStyleSheet = document.createElement("style")
rippleStyleSheet.textContent = rippleStyles
document.head.appendChild(rippleStyleSheet)

// Console welcome message
console.log("%c🚀 Welcome to the Sign In Page!", "color: #06b6d4; font-size: 16px; font-weight: bold;")
console.log("%cThis page features:", "color: #cbd5e1; font-size: 14px;")
console.log("%c• Real-time form validation", "color: #94a3b8; font-size: 12px;")
console.log("%c• Smooth animations and transitions", "color: #94a3b8; font-size: 12px;")
console.log("%c• Responsive design", "color: #94a3b8; font-size: 12px;")
console.log("%c• Accessibility features", "color: #94a3b8; font-size: 12px;")
console.log("%c• Interactive feedback", "color: #94a3b8; font-size: 12px;")
