        document.addEventListener('DOMContentLoaded', function() {
            const hamburger2 = document.getElementById('hamburger2');
            const navMenu2 = document.getElementById('navMenu2');
            const navbar2 = document.getElementById('navbar2');
            const userProfile = document.getElementById('userProfile');
            const dropdown = document.getElementById('dropdown');

            // Hamburger menu functionality
            if (hamburger2 && navMenu2) {
                hamburger2.addEventListener('click', function() {
                    hamburger2.classList.toggle('active');
                    navMenu2.classList.toggle('active');
                });
            }

            // Close mobile menu when clicking nav links
            if (navMenu2 && hamburger2) {
                const navLinks = navMenu2.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        navMenu2.classList.remove('active');
                        hamburger2.classList.remove('active');
                    });
                });
            }


         

            // Close dropdown when clicking outside
            if (userProfile && dropdown) {
                document.addEventListener('click', function(e) {
                    if (!userProfile.contains(e.target)) {
                        dropdown.style.opacity = '0';
                        dropdown.style.visibility = 'hidden';
                        dropdown.style.transform = 'translateY(-10px)';
                    }
                });

                // Show dropdown on hover
                userProfile.addEventListener('mouseenter', function() {
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.transform = 'translateY(0)';
                });

                userProfile.addEventListener('mouseleave', function() {
                    setTimeout(() => {
                        if (!dropdown.matches(':hover')) {
                            dropdown.style.opacity = '0';
                            dropdown.style.visibility = 'hidden';
                            dropdown.style.transform = 'translateY(-10px)';
                        }
                    }, 100);
                });
            }

            // Smooth scrolling for anchor links
            const allNavLinks = document.querySelectorAll('.nav-link[href^="#"]');
            allNavLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Logo click animation
            const logo = document.querySelector('.nav-logo');
            if (logo) {
                logo.addEventListener('click', function() {
                    const logoIcon = this.querySelector('.logo-icon');
                    logoIcon.style.animation = 'none';
                    setTimeout(() => {
                        logoIcon.style.animation = 'pulse 2s infinite';
                    }, 10);
                });
            }

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (navMenu2 && hamburger2 && !navMenu2.contains(e.target) && !hamburger2.contains(e.target)) {
                    navMenu2.classList.remove('active');
                    hamburger2.classList.remove('active');
                }
            });

            // Prevent menu close when clicking inside menu
            if (navMenu2) {
                navMenu2.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
        });
