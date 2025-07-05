// Dashboard functionality
class MentorDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.currentMonth = new Date();
        this.earnings = {
            total: 2450,
            sessions: 2100,
            bonus: 250,
            tips: 100
        };
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEarningsCounter();
        this.setupCalendar();
        this.setupCharts();
        this.setupSearch();
        this.setupFilters();
        this.animateStats();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all nav items and sections
                navItems.forEach(nav => nav.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked nav item
                item.classList.add('active');
                
                // Show corresponding section
                const sectionId = item.dataset.section + '-section';
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    targetSection.classList.add('fade-in');
                }
                
                // Update page title
                this.updatePageTitle(item.dataset.section);
                
                // Update current section
                this.currentSection = item.dataset.section;
            });
        });
    }

    updatePageTitle(section) {
        const titles = {
            overview: 'Dashboard Overview',
            earnings: 'Earnings & Revenue',
            sessions: 'Session Management',
            students: 'My Students',
            feedback: 'Student Feedback',
            profile: 'Profile Settings'
        };
        
        const subtitles = {
            overview: 'Welcome back, Dr. Sarah Johnson',
            earnings: 'Track your income and payments',
            sessions: 'Manage your consultation schedule',
            students: 'Connect with your mentees',
            feedback: 'Reviews and ratings from students',
            profile: 'Update your mentor profile'
        };

        document.getElementById('page-title').textContent = titles[section] || 'Dashboard';
        document.getElementById('page-subtitle').textContent = subtitles[section] || '';
    }

    setupEarningsCounter() {
        const totalEarningsElement = document.getElementById('totalEarnings');
        if (totalEarningsElement) {
            this.animateCounter(totalEarningsElement, 0, this.earnings.total, 2000);
        }

        // Setup earnings filter
        const earningsFilter = document.getElementById('earningsFilter');
        if (earningsFilter) {
            earningsFilter.addEventListener('change', (e) => {
                this.updateEarningsDisplay(e.target.value);
            });
        }
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    updateEarningsDisplay(period) {
        const earnings = {
            month: { total: 2450, sessions: 2100, bonus: 250, tips: 100 },
            quarter: { total: 7200, sessions: 6300, bonus: 600, tips: 300 },
            year: { total: 28800, sessions: 25200, bonus: 2400, tips: 1200 }
        };

        const data = earnings[period];
        if (data) {
            this.animateCounter(document.getElementById('totalEarnings'), 0, data.total, 1000);
            
            // Update breakdown cards
            const breakdownCards = document.querySelectorAll('.breakdown-amount');
            if (breakdownCards.length >= 3) {
                this.animateCounter(breakdownCards[0], 0, data.sessions, 1000);
                this.animateCounter(breakdownCards[1], 0, data.bonus, 1000);
                this.animateCounter(breakdownCards[2], 0, data.tips, 1000);
            }
        }
    }

    setupCalendar() {
        const prevButton = document.getElementById('prevMonth');
        const nextButton = document.getElementById('nextMonth');
        const currentMonthElement = document.getElementById('currentMonth');
        const calendarGrid = document.getElementById('calendarGrid');

        if (prevButton && nextButton && currentMonthElement && calendarGrid) {
            prevButton.addEventListener('click', () => {
                this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
                this.renderCalendar();
            });

            nextButton.addEventListener('click', () => {
                this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
                this.renderCalendar();
            });

            this.renderCalendar();
        }
    }

    renderCalendar() {
        const currentMonthElement = document.getElementById('currentMonth');
        const calendarGrid = document.getElementById('calendarGrid');
        
        if (!currentMonthElement || !calendarGrid) return;

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        currentMonthElement.textContent = `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;

        // Clear calendar
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.textAlign = 'center';
            dayHeader.style.padding = '0.5rem';
            dayHeader.style.color = 'var(--foreground-muted)';
            calendarGrid.appendChild(dayHeader);
        });

        // Get first day of month and number of days
        const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const startDate = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // Add empty cells for days before month starts
        for (let i = 0; i < startDate; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of month
        const sessionsData = [5, 12, 18, 25]; // Sample session days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            if (sessionsData.includes(day)) {
                dayElement.classList.add('has-session');
                dayElement.title = 'You have sessions on this day';
            }
            
            dayElement.addEventListener('click', () => {
                this.selectCalendarDay(day);
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }

    selectCalendarDay(day) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Add selection to clicked day
        event.target.classList.add('selected');
        
        // You could add functionality here to show sessions for selected day
        console.log(`Selected day: ${day}`);
    }

    setupCharts() {
        // Simple chart implementation using Canvas
        this.createEarningsChart();
        this.createSessionsChart();
    }

    createEarningsChart() {
        const canvas = document.getElementById('earningsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = 200;

        // Sample data for the last 6 months
        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const earnings = [1800, 2100, 1950, 2300, 2200, 2450];
        const maxEarning = Math.max(...earnings);

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set styles
        ctx.strokeStyle = '#0891b2';
        ctx.fillStyle = '#0891b2';
        ctx.lineWidth = 3;

        // Draw line chart
        ctx.beginPath();
        earnings.forEach((earning, index) => {
            const x = (index / (earnings.length - 1)) * (width - 40) + 20;
            const y = height - 40 - ((earning / maxEarning) * (height - 80));
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw points
            ctx.fillRect(x - 3, y - 3, 6, 6);
        });
        ctx.stroke();

        // Draw labels
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px Arial';
        months.forEach((month, index) => {
            const x = (index / (months.length - 1)) * (width - 40) + 20;
            ctx.fillText(month, x - 10, height - 10);
        });
    }

    createSessionsChart() {
        const canvas = document.getElementById('sessionsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = 200;

        // Sample data
        const sessionTypes = ['Career Guidance', 'Resume Review', 'Interview Prep', 'Skill Development'];
        const sessionCounts = [45, 32, 28, 42];
        const colors = ['#254d70', '#0891b2', '#3a6d9a', '#22d3ee'];
        const total = sessionCounts.reduce((a, b) => a + b, 0);

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw pie chart
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;

        let currentAngle = -Math.PI / 2;

        sessionCounts.forEach((count, index) => {
            const sliceAngle = (count / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index];
            ctx.fill();
            
            currentAngle += sliceAngle;
        });

        // Draw legend
        ctx.font = '12px Arial';
        sessionTypes.forEach((type, index) => {
            const y = 20 + index * 20;
            ctx.fillStyle = colors[index];
            ctx.fillRect(10, y - 8, 12, 12);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText(`${type} (${sessionCounts[index]})`, 30, y);
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('studentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterStudents(e.target.value);
            });
        }
    }

    filterStudents(searchTerm) {
        const studentCards = document.querySelectorAll('.student-card');
        studentCards.forEach(card => {
            const studentName = card.querySelector('h4').textContent.toLowerCase();
            const studentField = card.querySelector('p').textContent.toLowerCase();
            
            if (studentName.includes(searchTerm.toLowerCase()) || 
                studentField.includes(searchTerm.toLowerCase())) {
                card.style.display = 'flex';
                card.classList.add('slide-in');
            } else {
                card.style.display = 'none';
            }
        });
    }

    setupFilters() {
        // Add session button functionality
        const addSessionBtn = document.getElementById('addSessionBtn');
        if (addSessionBtn) {
            addSessionBtn.addEventListener('click', () => {
                this.showAddSessionModal();
            });
        }

        // Add other interactive elements
        this.setupSessionActions();
        this.setupStudentActions();
    }

    setupSessionActions() {
        document.querySelectorAll('.session-actions .btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.textContent === 'Join') {
                    this.joinSession(e.target.closest('.session-item'));
                }
            });
        });

        document.querySelectorAll('.session-actions .btn-secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.textContent === 'Reschedule') {
                    this.rescheduleSession(e.target.closest('.session-item'));
                }
            });
        });
    }

    setupStudentActions() {
        document.querySelectorAll('.student-actions .btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.textContent === 'Schedule') {
                    this.scheduleWithStudent(e.target.closest('.student-card'));
                }
            });
        });

        document.querySelectorAll('.student-actions .btn-secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.textContent === 'Message') {
                    this.messageStudent(e.target.closest('.student-card'));
                }
            });
        });
    }

    animateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach((stat, index) => {
            setTimeout(() => {
                stat.classList.add('fade-in');
                const value = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                if (value) {
                    this.animateCounter(stat, 0, value, 1500);
                }
            }, index * 200);
        });
    }

    // Modal and interaction methods
    showAddSessionModal() {
        alert('Add Session Modal would open here. This would allow you to set your availability.');
    }

    joinSession(sessionElement) {
        const studentName = sessionElement.querySelector('p').textContent.replace('with ', '');
        alert(`Joining session with ${studentName}. This would open the video call interface.`);
    }

    rescheduleSession(sessionElement) {
        const studentName = sessionElement.querySelector('p').textContent.replace('with ', '');
        alert(`Rescheduling session with ${studentName}. This would open a calendar picker.`);
    }

    scheduleWithStudent(studentElement) {
        const studentName = studentElement.querySelector('h4').textContent;
        alert(`Scheduling new session with ${studentName}. This would open the scheduling interface.`);
    }

    messageStudent(studentElement) {
        const studentName = studentElement.querySelector('h4').textContent;
        alert(`Opening chat with ${studentName}. This would open the messaging interface.`);
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: var(--card);
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            color: var(--foreground);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Real-time updates simulation
    simulateRealTimeUpdates() {
        setInterval(() => {
            // Simulate new notification
            const notifications = [
                'New session booked with Maria Garcia',
                'Payment received: $25',
                'New review from Ahmed Hassan',
                'Reminder: Session in 30 minutes'
            ];
            
            if (Math.random() < 0.1) { // 10% chance every interval
                const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
                this.showNotification(randomNotification, 'info');
                
                // Update notification badge
                const badge = document.querySelector('.notification-badge');
                if (badge) {
                    const currentCount = parseInt(badge.textContent) || 0;
                    badge.textContent = currentCount + 1;
                }
            }
        }, 10000); // Check every 10 seconds
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new MentorDashboard();
    
    // Start real-time updates simulation
    dashboard.simulateRealTimeUpdates();
    
    // Add some interactive feedback
    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn-primary, .btn-secondary')) {
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
            }, 150);
        }
    });

    // Add hover effects for cards
    document.querySelectorAll('.stat-card, .student-card, .feedback-item').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Profile form handling
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dashboard.showNotification('Profile updated successfully!', 'success');
        });
    }

    console.log('Smart Start Mentor Dashboard initialized successfully!');
});

// Add some utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(date);
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MentorDashboard;
}