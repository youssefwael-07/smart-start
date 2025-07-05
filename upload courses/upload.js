// Global variables
let currentSection = 'courses';
let currentFilter = 'all';
let downloadQueue = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserProgress();
});

// Initialize Application
function initializeApp() {
    // Set initial active section
    showSection('courses');
    
    // Initialize filter tabs
    setupFilterTabs();
    
    // Setup search functionality
    setupSearch();
    
    // Load animations
    setupAnimations();
    
    console.log('EduMentor Platform Initialized');
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterCourses(filter);
            updateActiveTab(this);
        });
    });
    
    // Modal close events
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('downloadModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Show Section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('fade-in');
        currentSection = sectionId;
    }
    
    // Update navigation
    updateNavigation(sectionId);
}

// Update Navigation
function updateNavigation(activeSection) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

// Filter Courses
function filterCourses(filter) {
    const courses = document.querySelectorAll('.course-card');
    
    courses.forEach(course => {
        const category = course.dataset.category;
        
        if (filter === 'all' || category === filter) {
            course.style.display = 'block';
            course.classList.add('slide-up');
        } else {
            course.style.display = 'none';
        }
    });
    
    currentFilter = filter;
}

// Update Active Tab
function updateActiveTab(activeTab) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    activeTab.classList.add('active');
}

// Setup Filter Tabs
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterCourses(filter);
            updateActiveTab(this);
        });
    });
}

// Setup Search
function setupSearch() {
    const searchInput = document.getElementById('videoSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchVideos(searchTerm);
        });
    }
}

// Search Videos
function searchVideos(searchTerm) {
    const videos = document.querySelectorAll('.video-card');
    
    videos.forEach(video => {
        const title = video.querySelector('h4').textContent.toLowerCase();
        const description = video.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            video.style.display = 'block';
            video.classList.add('fade-in');
        } else {
            video.style.display = 'none';
        }
    });
}

// Download Course
function downloadCourse(courseId) {
    console.log(`Initiating download for course: ${courseId}`);
    
    // Show download modal
    const modal = document.getElementById('downloadModal');
    modal.style.display = 'block';
    
    // Store current course for download
    window.currentDownloadCourse = courseId;
    
    // Add to download queue
    if (!downloadQueue.includes(courseId)) {
        downloadQueue.push(courseId);
    }
    
    // Show success notification
    showNotification('Course added to download queue', 'success');
}

// Download Video
function downloadVideo(videoId) {
    console.log(`Downloading video: ${videoId}`);
    
    // Simulate download process
    showNotification('Video download started', 'info');
    
    // Simulate download progress
    simulateDownload(videoId, 'video');
}

// Download Format
function downloadFormat(format) {
    const courseId = window.currentDownloadCourse;
    
    console.log(`Downloading ${courseId} in ${format} format`);
    
    // Close modal
    closeModal();
    
    // Simulate download
    simulateDownload(courseId, format);
    
    // Show success message
    showNotification(`Download started in ${format.toUpperCase()} format`, 'success');
}

// Simulate Download
function simulateDownload(itemId, format) {
    // Create progress notification
    const progressDiv = document.createElement('div');
    progressDiv.className = 'download-progress';
    progressDiv.innerHTML = `
        <div class="progress-header">
            <span>Downloading ${itemId}</span>
            <span class="progress-percentage">0%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
        </div>
    `;
    
    // Add to page (you might want to create a dedicated notifications area)
    document.body.appendChild(progressDiv);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Remove progress indicator
            setTimeout(() => {
                progressDiv.remove();
                showNotification('Download completed successfully!', 'success');
            }, 1000);
        }
        
        // Update progress
        const progressFill = progressDiv.querySelector('.progress-fill');
        const progressPercentage = progressDiv.querySelector('.progress-percentage');
        
        if (progressFill && progressPercentage) {
            progressFill.style.width = `${progress}%`;
            progressPercentage.textContent = `${Math.round(progress)}%`;
        }
    }, 500);
}

// Play Video
function playVideo(videoId) {
    console.log(`Playing video: ${videoId}`);
    
    // Create video player modal or redirect to video page
    showNotification('Opening video player...', 'info');
    
    // Simulate video loading
    setTimeout(() => {
        showNotification('Video loaded successfully!', 'success');
    }, 1500);
}

// Start Activity
function startActivity(activityType) {
    console.log(`Starting activity: ${activityType}`);
    
    switch(activityType) {
        case 'quiz':
            startQuiz();
            break;
        case 'coding':
            startCodingChallenge();
            break;
        case 'project':
            startProject();
            break;
        case 'discussion':
            openDiscussion();
            break;
        default:
            showNotification('Activity not available', 'warning');
    }
}

// Start Quiz
function startQuiz() {
    showNotification('Loading quiz questions...', 'info');
    
    // Simulate quiz loading
    setTimeout(() => {
        showNotification('Quiz started! Good luck!', 'success');
        // Here you would typically redirect to quiz page or open quiz modal
    }, 1000);
}

// Start Coding Challenge
function startCodingChallenge() {
    showNotification('Preparing coding environment...', 'info');
    
    setTimeout(() => {
        showNotification('Coding challenge ready!', 'success');
        // Open coding interface
    }, 1500);
}

// Start Project
function startProject() {
    showNotification('Setting up project workspace...', 'info');
    
    setTimeout(() => {
        showNotification('Project workspace ready!', 'success');
    }, 1200);
}

// Open Discussion
function openDiscussion() {
    showNotification('Loading discussion forum...', 'info');
    
    setTimeout(() => {
        showNotification('Welcome to the discussion forum!', 'success');
    }, 800);
}

// Toggle Favorite
function toggleFavorite(button) {
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.style.color = '#ef4444';
        showNotification('Added to favorites', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.style.color = '';
        showNotification('Removed from favorites', 'info');
    }
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('downloadModal');
    modal.style.display = 'none';
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--white);
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        min-width: 300px;
        border-left: 4px solid var(--${getNotificationColor(type)});
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Get Notification Icon
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Get Notification Color
function getNotificationColor(type) {
    const colors = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'primary-blue'
    };
    return colors[type] || 'primary-blue';
}

// Load User Progress
function loadUserProgress() {
    // Simulate loading user progress from API
    const progressData = {
        overallProgress: 70,
        coursesCompleted: 15,
        hoursLearned: 120,
        certificatesEarned: 8,
        currentStreak: 7
    };
    
    // Update progress circle
    updateProgressCircle(progressData.overallProgress);
    
    // Update stats
    updateProgressStats(progressData);
    
    console.log('User progress loaded:', progressData);
}

// Update Progress Circle
function updateProgressCircle(percentage) {
    const circle = document.querySelector('.progress-ring-circle');
    if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }
    
    // Update percentage text
    const percentageText = document.querySelector('.progress-percentage');
    if (percentageText) {
        percentageText.textContent = `${percentage}%`;
    }
}

// Update Progress Stats
function updateProgressStats(data) {
    const statElements = document.querySelectorAll('.stat-value');
    const values = [data.coursesCompleted, data.hoursLearned, data.certificatesEarned];
    
    statElements.forEach((element, index) => {
        if (values[index] !== undefined) {
            animateCounter(element, values[index]);
        }
    });
}

// Animate Counter
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

// Setup Animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe elements for animation
    document.querySelectorAll('.course-card, .video-card, .activity-card').forEach(el => {
        observer.observe(el);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showSection,
        filterCourses,
        downloadCourse,
        startActivity,
        toggleFavorite
    };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--gray-400);
        padding: 0.25rem;
    }
    
    .notification-close:hover {
        color: var(--gray-600);
    }
    
    .download-progress {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--white);
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        min-width: 300px;
        border-left: 4px solid var(--primary-blue);
    }
    
    .progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        font-weight: 600;
    }
`;

document.head.appendChild(style);

console.log('EduMentor Platform JavaScript loaded successfully!');