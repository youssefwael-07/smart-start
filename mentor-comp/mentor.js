document.addEventListener('DOMContentLoaded', function() {
    // State management
    let favorites = ['1', '2', '3']; // Mock favorite mentor IDs
    let comparison = ['1', '2']; // Mock comparison mentor IDs
    
    // DOM elements
    const favoritesPanel = document.getElementById('favoritesPanel');
    const showFavoritesBtn = document.getElementById('showFavoritesBtn');
    const closeFavoritesBtn = document.getElementById('closeFavoritesBtn');
    const clearComparisonBtn = document.getElementById('clearComparisonBtn');
    const cardsView = document.getElementById('cardsView');
    const tableView = document.getElementById('tableView');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const addToCompareButtons = document.querySelectorAll('.add-to-compare');
    const removeFromComparisonButtons = document.querySelectorAll('.remove-from-comparison');
    const removeFavoriteButtons = document.querySelectorAll('.remove-favorite');
    
    // Initialize
    updateFavoritesCount();
    updateComparisonView();
    
    // Favorites panel toggle
    showFavoritesBtn.addEventListener('click', function() {
        favoritesPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeFavoritesBtn.addEventListener('click', function() {
        favoritesPanel.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close favorites panel when clicking outside
    favoritesPanel.addEventListener('click', function(e) {
        if (e.target === favoritesPanel) {
            favoritesPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // View toggle (Cards/Table)
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active state
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide views
            if (view === 'cards') {
                cardsView.style.display = 'grid';
                tableView.style.display = 'none';
            } else {
                cardsView.style.display = 'none';
                tableView.style.display = 'block';
            }
        });
    });
    
    // Favorite button functionality
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mentorId = this.dataset.mentorId;
            toggleFavorite(mentorId, this);
        });
    });
    
    // Add to comparison functionality
    addToCompareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mentorId = this.dataset.mentorId;
            addToComparison(mentorId, this);
        });
    });
    
    // Remove from comparison functionality
    removeFromComparisonButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mentorId = this.dataset.mentorId;
            removeFromComparison(mentorId, this);
        });
    });
    
    // Remove from favorites functionality
    removeFavoriteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mentorId = this.dataset.mentorId;
            removeFromFavorites(mentorId, this);
        });
    });
    
    // Clear comparison
    clearComparisonBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all mentors from comparison?')) {
            clearComparison();
        }
    });
    
    // Sort functionality
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortMentors(this.value);
        });
    }
    
    // Functions
    function toggleFavorite(mentorId, button) {
        const isFavorite = favorites.includes(mentorId);
        
        if (isFavorite) {
            favorites = favorites.filter(id => id !== mentorId);
            button.classList.remove('active');
            showNotification('Removed from favorites', 'info');
        } else {
            favorites.push(mentorId);
            button.classList.add('active');
            showNotification('Added to favorites', 'success');
        }
        
        updateFavoritesCount();
        animateButton(button);
    }
    
    function addToComparison(mentorId, button) {
        if (comparison.length >= 4) {
            showNotification('You can compare up to 4 mentors at once', 'warning');
            return;
        }
        
        if (!comparison.includes(mentorId)) {
            comparison.push(mentorId);
            updateComparisonView();
            showNotification('Added to comparison', 'success');
            animateButton(button);
        }
        
        // Close favorites panel if open
        favoritesPanel.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function removeFromComparison(mentorId, button) {
        comparison = comparison.filter(id => id !== mentorId);
        updateComparisonView();
        showNotification('Removed from comparison', 'info');
        animateButton(button);
    }
    
    function removeFromFavorites(mentorId, button) {
        favorites = favorites.filter(id => id !== mentorId);
        updateFavoritesCount();
        
        // Remove the favorite item from DOM
        const favoriteItem = button.closest('.favorite-item');
        if (favoriteItem) {
            favoriteItem.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                favoriteItem.remove();
            }, 300);
        }
        
        // Update favorite button in comparison cards
        const favoriteBtn = document.querySelector(.favorite-btn[data-mentor-id="${mentorId}"]);
        if (favoriteBtn) {
            favoriteBtn.classList.remove('active');
        }
        
        showNotification('Removed from favorites', 'info');
    }
    
    function clearComparison() {
        comparison = [];
        updateComparisonView();
        showNotification('Comparison cleared', 'info');
    }
    
    function updateFavoritesCount() {
        const countElements = document.querySelectorAll('.favorites-count');
        countElements.forEach(el => {
            el.textContent = favorites.length;
        });
        
        // Update button text
        const favoritesBtn = document.querySelector('#showFavoritesBtn');
        if (favoritesBtn) {
            favoritesBtn.innerHTML = `
                <i class="fas fa-heart"></i>
                View My Favorites (${favorites.length})
            `;
        }
    }
    
    function updateComparisonView() {
        const mentorCards = document.querySelectorAll('.mentor-card');
        mentorCards.forEach(card => {
            const mentorId = card.dataset.mentorId;
            if (comparison.includes(mentorId)) {
                card.classList.add('in-comparison');
            } else {
                card.classList.remove('in-comparison');
            }
        });
        
        // Update clear button state
        if (clearComparisonBtn) {
            clearComparisonBtn.disabled = comparison.length === 0;
            if (comparison.length === 0) {
                clearComparisonBtn.style.opacity = '0.5';
            } else {
                clearComparisonBtn.style.opacity = '1';
            }
        }
    }
    
    function sortMentors(criteria) {
        const mentorCards = Array.from(document.querySelectorAll('.mentor-card:not(.add-mentor-card)'));
        const container = document.querySelector('.comparison-cards');
        const addMentorCard = document.querySelector('.add-mentor-card');
        
        mentorCards.sort((a, b) => {
            switch (criteria) {
                case 'rating':
                    const ratingA = parseFloat(a.querySelector('.score').textContent);
                    const ratingB = parseFloat(b.querySelector('.score').textContent);
                    return ratingB - ratingA;
                
                case 'price':
                    const priceA = parseInt(a.querySelector('.price').textContent.replace('$', ''));
                    const priceB = parseInt(b.querySelector('.price').textContent.replace('$', ''));
                    return priceA - priceB;
                
                case 'experience':
                    const expA = parseInt(a.querySelector('.experience-years').textContent);
                    const expB = parseInt(b.querySelector('.experience-years').textContent);
                    return expB - expA;
                
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        mentorCards.forEach(card => {
            card.style.animation = 'fadeIn 0.5s ease-out';
            container.appendChild(card);
        });
        
        // Keep add mentor card at the end
        if (addMentorCard) {
            container.appendChild(addMentorCard);
        }
        
        showNotification(Sorted by ${criteria}, 'info');
    }
    
    function animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = notification notification-${type};
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 3000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
    }
    
    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'warning': return 'exclamation-triangle';
            case 'error': return 'times-circle';
            default: return 'info-circle';
        }
    }
    
    // Book session functionality
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.includes('Book Session')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const originalText = this.innerHTML;
                
                // Show loading state
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
                this.disabled = true;
                this.classList.add('loading');
                
                // Simulate booking process
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> Session Booked!';
                    this.style.background = 'var(--success)';
                    this.classList.remove('loading');
                    
                    showNotification('Session booked successfully!', 'success');
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        this.style.background = '';
                    }, 2000);
                }, 1500);
            });
        }
    });
    
    // Smooth scroll for anchor links
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
    
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Animate progress bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.bar-fill');
                if (progressFill) {
                    const width = progressFill.style.width;
                    progressFill.style.width = '0%';
                    setTimeout(() => {
                        progressFill.style.width = width;
                    }, 100);
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.experience-bar').forEach(bar => {
        observer.observe(bar);
    });
    
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('mobile-active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close favorites panel with Escape key
        if (e.key === 'Escape' && favoritesPanel.classList.contains('active')) {
            favoritesPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Toggle view with Tab + V
        if (e.key === 'v' && e.ctrlKey) {
            e.preventDefault();
            const activeToggle = document.querySelector('.toggle-btn.active');
            const nextToggle = activeToggle.nextElementSibling || document.querySelector('.toggle-btn');
            nextToggle.click();
        }
    });
});

// Add notification styles to CSS
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    padding: 1rem;
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease-out;
    max-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--foreground);
}

.notification-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    color: var(--foreground-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--border-radius);
    transition: var(--transition-base);
}

.notification-close:hover {
    color: var(--error);
    background: rgba(220, 38, 38, 0.1);
}

.notification-success {
    border-left: 4px solid var(--success);
}

.notification-warning {
    border-left: 4px solid var(--warning);
}

.notification-error {
    border-left: 4px solid var(--error);
}

.notification-info {
    border-left: 4px solid var(--accent);
}

@keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
}

.mobile-active {
    display: flex !important;
    position: fixed;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--card);
    border-top: 1px solid var(--border);
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    z-index: 999;
}

@media (max-width: 768px) {
    .notification {
        left: 20px;
        right: 20px;
        max-width: none;
    }
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);