// Custom Alert System
function showAlert(type, title, message, duration = 5000) {
    const alertContainer = document.getElementById('alertContainer');
    
    const alertElement = document.createElement('div');
    alertElement.className = `custom-alert ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    alertElement.innerHTML = `
        <div class="alert-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="alert-content">
            <div class="alert-title">${title}</div>
            <div class="alert-message">${message}</div>
        </div>
        <button class="alert-close" onclick="closeAlert(this)">
            <i class="fas fa-times"></i>
        </button>
        <div class="alert-progress"></div>
    `;
    
    alertContainer.appendChild(alertElement);
    
    // Auto remove after duration
    setTimeout(() => {
        removeAlert(alertElement);
    }, duration);
    
    return alertElement;
}

function closeAlert(closeButton) {
    const alertElement = closeButton.closest('.custom-alert');
    removeAlert(alertElement);
}

function removeAlert(alertElement) {
    if (alertElement && alertElement.parentNode) {
        alertElement.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.parentNode.removeChild(alertElement);
            }
        }, 300);
    }
}

// Navigation functionality
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 3D card tilt effect
const profileCard = document.querySelector('.profile-card');
if (profileCard) {
    profileCard.addEventListener('mousemove', (e) => {
        const rect = profileCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });
    
    profileCard.addEventListener('mouseleave', () => {
        profileCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
}

// Animate progress bars when they come into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.progress');
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.setProperty('--width', width);
                bar.style.animation = 'progressAnimation 2s ease forwards';
            });
        }
    });
}, observerOptions);

const skillsContainer = document.querySelector('.skills-container');
if (skillsContainer) {
    progressObserver.observe(skillsContainer);
}

// Floating animation for review cards
const reviewCards = document.querySelectorAll('.review-card');
reviewCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Modal functionality
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalSlideIn 0.3s ease forwards';
        }
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        
        if (modalContent) {
            modalContent.style.animation = 'modalSlideOut 0.3s ease forwards';
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('bookingModal');
    if (e.target === modal) {
        closeBookingModal();
    }
});

// Session type selection
const sessionOptions = document.querySelectorAll('.session-option');
sessionOptions.forEach(option => {
    option.addEventListener('click', () => {
        sessionOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
    });
});

// Time slot selection
function selectTimeSlot(slot) {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const profileCard = document.querySelector('.profile-card-3d');
    
    if (hero && profileCard) {
        const rate = scrolled * -0.5;
        profileCard.style.transform = `translateY(${rate}px)`;
    }
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        }
    }
});

// Typing effect for profile title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const profileTitle = document.querySelector('.profile-title');
    if (profileTitle) {
        const originalText = profileTitle.textContent;
        typeWriter(profileTitle, originalText, 80);
    }
});

// Smooth reveal animations for sections
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Apply reveal animation to sections
document.querySelectorAll('.about-section, .reviews-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
});

// Interactive floating icons
const floatingIcons = document.querySelectorAll('.floating-icon');
floatingIcons.forEach((icon, index) => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.5) rotate(360deg)';
        icon.style.color = 'var(--accent-lighter)';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotate(0deg)';
        icon.style.color = 'var(--accent-light)';
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// Apply ripple effect to buttons
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Hamburger menu functionality
const hamburger = document.getElementById('hamburger2');
const navMenu = document.getElementById('navMenu2');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Enhanced confirm booking functionality with session type handling
const confirmBookingBtn = document.querySelector('.confirm-booking');
if (confirmBookingBtn) {  
        if (!selectedSession || !selectedTimeSlot) {
            showAlert('warning', 'Incomplete Selection', 'Please select both a session type and time slot to continue.');
            return;
        }
        
        const sessionType = selectedSession.getAttribute('data-type');
        const sessionTitle = selectedSession.querySelector('h4').textContent;
        const timeSlot = selectedTimeSlot.textContent;
        
        if (sessionType === 'premium') {
            // Show success alert for premium session
            showAlert('success', 'Booking Confirmed!', `Your ${sessionTitle} at ${timeSlot} has been confirmed. Redirecting to payment...`);
            
            // Close modal and redirect to payment page after a short delay
            setTimeout(() => {
                closeBookingModal();
                window.location.href = '../payment/index.html';
            }, 2000);
            
        } else if (sessionType === 'free') {
            // Show success alert for free session (no payment needed)
            showAlert('success', 'Free Session Booked!', `Your ${sessionTitle} at ${timeSlot} has been confirmed. You will receive a confirmation email shortly.`);
            
            // Close modal after showing success message
            setTimeout(() => {
                closeBookingModal();
            }, 2000);
        }
    };

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mentor profile page loaded successfully');
    
    // Show welcome message
    setTimeout(() => {
        showAlert('info', 'Welcome!', 'Book a session with Dr. Sarah to get personalized medical career guidance.');
    }, 1000);
});
document.addEventListener("DOMContentLoaded", function () {
    let selectedSessionType = "free";
    let selectedTimeSlot = "";

    const sessionTypeInput = document.getElementById("sessionTypeInput");
    const timeSlotInput = document.getElementById("timeSlotInput");

    // افتراضي
    sessionTypeInput.value = "free";

    document.querySelectorAll(".session-option").forEach(option => {
        option.addEventListener("click", () => {
            document.querySelectorAll(".session-option").forEach(o => o.classList.remove("active"));
            option.classList.add("active");
            selectedSessionType = option.dataset.type;
            sessionTypeInput.value = selectedSessionType;
        });
    });

    document.querySelectorAll(".time-slot").forEach(slot => {
        slot.addEventListener("click", () => {
            document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("selected"));
            slot.classList.add("selected");
            selectedTimeSlot = slot.textContent.trim();
            timeSlotInput.value = selectedTimeSlot;
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const sessionTypeInput = document.getElementById("sessionTypeInput");
    const timeSlotInput = document.getElementById("timeSlotInput");

    // حدد النوع الافتراضي تلقائيًا
    sessionTypeInput.value = "free";

    // جلسات الحجز
    document.querySelectorAll(".session-option").forEach(option => {
        option.addEventListener("click", () => {
            document.querySelectorAll(".session-option").forEach(o => o.classList.remove("active"));
            option.classList.add("active");

            // تحديد القيمة
            sessionTypeInput.value = option.getAttribute("data-type");
        });
    });

    // الوقت
    document.querySelectorAll(".time-slot").forEach(slot => {
        slot.addEventListener("click", () => {
            document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("selected"));
            slot.classList.add("selected");

            // حفظ الوقت في الحقل المخفي
            timeSlotInput.value = slot.textContent.trim();
        });
    });

    // تحقق قبل الإرسال (اختياري لكن مفيد)
    document.getElementById("bookingForm").addEventListener("submit", function (e) {
        if (timeSlotInput.value === "") {
            e.preventDefault(); // منع الإرسال
            alert("Please select a time slot.");
        }
    });
});

