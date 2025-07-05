// Global variables
let currentUser = {
    name: 'Alex Johnson',
    avatar: '/placeholder.svg?height=40&width=40',
    completedConsultations: 12,
    upcomingAppointments: 3,
    rating: 4.8
};

// DOM loaded event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Add animation to progress bars
    animateProgressBars();
    
    // Simulate real-time updates (for demo)
    setTimeout(() => {
        showNotification('You have a new appointment tomorrow at 2:00 PM', 'info');
    }, 3000);
});

// Initialize application
function initializeApp() {
    // Add event listeners
    setupEventListeners();
    
    // Add data attributes to elements
    document.querySelectorAll('.appointment-item').forEach((item, index) => {
        if (!item.dataset.appointmentId) {
            item.dataset.appointmentId = `app-${index + 1}`;
        }
    });
    
    // Initialize tooltips or other UI components
    // This would be where you'd initialize third-party libraries
}

// Setup event listeners
function setupEventListeners() {
    // Modal events
    document.getElementById('bookingModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeBookingModal();
        }
    });
    
    // Search mentors button
    document.getElementById('searchMentorsBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateBookingForm()) {
            showNotification('Searching for available mentors', 'success');
            closeBookingModal();
            // In a real app, this would redirect to mentor selection page
        }
    });
    
    // Appointment actions
    document.querySelectorAll('.appointment-item').forEach(item => {
        const rescheduleBtn = item.querySelector('.btn-outline');
        const joinBtn = item.querySelector('.btn-primary');
        
        if (rescheduleBtn) {
            rescheduleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                rescheduleAppointment(item.dataset.appointmentId);
            });
        }
        
        if (joinBtn && !joinBtn.disabled) {
            joinBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                joinAppointment(item.dataset.appointmentId);
            });
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBookingModal();
        }
    });
}

// Modal functions
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Mentor profile function
function viewMentorProfile(mentorId) {
    // In a real application, this would navigate to the mentor's profile page
    console.log(`Viewing mentor profile: ${mentorId}`);
    
    // For demo purposes, show a notification
    const mentorNames = {
        '1': 'Dr. Leila Hassan',
        '2': 'Prof. Fatima Ali'
    };
    
    showNotification(`Viewing ${mentorNames[mentorId] || 'mentor'}'s profile`, 'info');
}

// Appointment management functions
function rescheduleAppointment(appointmentId) {
    console.log(`Rescheduling appointment: ${appointmentId}`);
    showNotification('Opening reschedule options', 'info');
}

function joinAppointment(appointmentId) {
    console.log(`Joining appointment: ${appointmentId}`);
    showNotification('Joining video consultation...', 'success');
}

// Form validation
function validateBookingForm() {
    const specialty = document.querySelector('select').value;
    const consultationType = document.querySelector('input[name="consultationType"]:checked');
    const description = document.querySelector('textarea').value.trim();
    
    if (!specialty) {
        showNotification('Please select a field', 'error');
        return false;
    }
    
    if (!consultationType) {
        showNotification('Please select a consultation type', 'error');
        return false;
    }
    
    if (!description) {
        showNotification('Please provide a brief description', 'error');
        return false;
    }
    
    return true;
}

// Notification system
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationsContainer');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add content
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
}

// Date formatting utilities
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }).format(date);
}

function formatTime(time) {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(time);
}

// Export functions for potential module use
window.MentorLink = {
    openBookingModal,
    closeBookingModal,
    viewMentorProfile,
    rescheduleAppointment,
    joinAppointment,
    showNotification
};