// Sample mentor data
const mentorsData = [
    {
        id: 1,
        name: "Sarah Chen",
        title: "Senior Software Engineer at Google",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
        rating: 4.9,
        reviews: 127,
        bio: "Passionate about helping developers grow their careers. Specializing in full-stack development and system design.",
        skills: ["JavaScript", "React", "Node.js", "System Design"],
        experience: "senior",
        availability: "available",
        price: "$80/hour"
    },
    {
        id: 2,
        name: "Marcus Johnson",
        title: "Lead Product Designer at Airbnb",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
        rating: 4.8,
        reviews: 89,
        bio: "10+ years in product design. I help designers transition into senior roles and build better user experiences.",
        skills: ["UI/UX Design", "Figma", "Product Strategy", "User Research"],
        experience: "expert",
        availability: "busy",
        price: "$120/hour"
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        title: "Data Science Manager at Netflix",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
        rating: 5.0,
        reviews: 156,
        bio: "Helping data professionals advance their careers. Expert in machine learning, analytics, and team leadership.",
        skills: ["Python", "Machine Learning", "Data Analysis", "Leadership"],
        experience: "expert",
        availability: "available",
        price: "$100/hour"
    },
    {
        id: 4,
        name: "David Kim",
        title: "DevOps Engineer at Amazon",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
        rating: 4.7,
        reviews: 73,
        bio: "Cloud infrastructure expert with 8 years of experience. Passionate about automation and scalable systems.",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        experience: "senior",
        availability: "available",
        price: "$90/hour"
    },
    {
        id: 5,
        name: "Lisa Thompson",
        title: "Marketing Director at HubSpot",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face",
        rating: 4.6,
        reviews: 94,
        bio: "Digital marketing strategist with expertise in growth hacking, content marketing, and brand building.",
        skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
        experience: "senior",
        availability: "busy",
        price: "$75/hour"
    },
    {
        id: 6,
        name: "Alex Patel",
        title: "Mobile App Developer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
        rating: 4.5,
        reviews: 62,
        bio: "iOS and Android developer with 6 years of experience. Love helping new developers build their first apps.",
        skills: ["Swift", "Kotlin", "React Native", "Flutter"],
        experience: "mid",
        availability: "available",
        price: "$65/hour"
    },
    {
        id: 7,
        name: "Rachel Green",
        title: "Product Manager at Spotify",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face",
        rating: 4.9,
        reviews: 118,
        bio: "Product management expert with focus on user-centric design and agile methodologies. 9 years of experience.",
        skills: ["Product Management", "Agile", "User Research", "Strategy"],
        experience: "senior",
        availability: "available",
        price: "$95/hour"
    },
    {
        id: 8,
        name: "James Wilson",
        title: "Cybersecurity Specialist",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face",
        rating: 4.8,
        reviews: 85,
        bio: "Cybersecurity expert helping professionals transition into security roles. Specializing in ethical hacking and compliance.",
        skills: ["Cybersecurity", "Penetration Testing", "Risk Assessment", "Compliance"],
        experience: "expert",
        availability: "busy",
        price: "$110/hour"
    }
];

let filteredMentors = [...mentorsData];
let displayedMentors = [];
let currentPage = 0;
const mentorsPerPage = 6;

// Navigation functions
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function toggleDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userProfile = document.querySelector('.user-profile');
    const dropdown = document.getElementById('userDropdown');
    
    if (!userProfile.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Search and filter functions
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredMentors = mentorsData.filter(mentor => {
        return mentor.name.toLowerCase().includes(searchTerm) ||
               mentor.title.toLowerCase().includes(searchTerm) ||
               mentor.bio.toLowerCase().includes(searchTerm) ||
               mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm));
    });
    
    applyFilters();
}

function applyFilters() {
    const skillFilter = document.getElementById('skillFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value;
    const availabilityFilter = document.getElementById('availabilityFilter').value;
    const ratingFilter = document.getElementById('ratingFilter').value;
    
    let filtered = [...filteredMentors];
    
    if (skillFilter) {
        filtered = filtered.filter(mentor => 
            mentor.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
        );
    }
    
    if (experienceFilter) {
        filtered = filtered.filter(mentor => mentor.experience === experienceFilter);
    }
    
    if (availabilityFilter) {
        filtered = filtered.filter(mentor => mentor.availability === availabilityFilter);
    }
    
    if (ratingFilter) {
        const minRating = parseFloat(ratingFilter);
        filtered = filtered.filter(mentor => mentor.rating >= minRating);
    }
    
    filteredMentors = filtered;
    currentPage = 0;
    displayedMentors = [];
    
    updateResultsCount();
    loadMoreMentors();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('skillFilter').value = '';
    document.getElementById('experienceFilter').value = '';
    document.getElementById('availabilityFilter').value = '';
    document.getElementById('ratingFilter').value = '';
    
    filteredMentors = [...mentorsData];
    currentPage = 0;
    displayedMentors = [];
    
    updateResultsCount();
    loadMoreMentors();
}

function updateResultsCount() {
    const count = filteredMentors.length;
    document.getElementById('resultsCount').textContent = count;
}

function loadMoreMentors() {
    const startIndex = currentPage * mentorsPerPage;
    const endIndex = startIndex + mentorsPerPage;
    const newMentors = filteredMentors.slice(startIndex, endIndex);
    
    displayedMentors = [...displayedMentors, ...newMentors];
    currentPage++;
    
    renderMentors();
    
    // Hide load more button if all mentors are displayed
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (displayedMentors.length >= filteredMentors.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
}

function renderMentors() {
    const mentorsGrid = document.getElementById('mentorsGrid');
    
    if (currentPage === 1) {
        mentorsGrid.innerHTML = '';
    }
    
    const startIndex = (currentPage - 1) * mentorsPerPage;
    const newMentors = displayedMentors.slice(startIndex);
    
    newMentors.forEach((mentor, index) => {
        const mentorCard = createMentorCard(mentor);
        mentorCard.style.animationDelay = `${index * 0.1}s`;
        mentorsGrid.appendChild(mentorCard);
    });
}

function createMentorCard(mentor) {
    const card = document.createElement('div');
    card.className = 'mentor-card';
    card.onclick = () => contactMentor(mentor.id);
    
    const stars = '★'.repeat(Math.floor(mentor.rating)) + 
                  (mentor.rating % 1 !== 0 ? '☆' : '') + 
                  '☆'.repeat(5 - Math.ceil(mentor.rating));
    
    const availabilityClass = mentor.availability === 'available' ? 'available' : 'busy';
    const availabilityText = mentor.availability === 'available' ? 'Available Now' : 'Limited Availability';
    
    card.innerHTML = `
        <div class="mentor-header">
            <img src="${mentor.avatar}" alt="${mentor.name}" class="mentor-avatar">
            <div class="mentor-info">
                <h3>${mentor.name}</h3>
                <div class="mentor-title">${mentor.title}</div>
            </div>
        </div>
        
        <div class="mentor-rating">
            <div class="stars">${stars}</div>
            <span class="rating-text">${mentor.rating} (${mentor.reviews} reviews)</span>
        </div>
        
        <div class="mentor-bio">${mentor.bio}</div>
        
        <div class="mentor-skills">
            ${mentor.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
        
        <div class="mentor-footer">
            <div class="availability ${availabilityClass}">
                <div class="availability-dot"></div>
                ${availabilityText}
            </div>
            <a
  href="../mentor-details/details.html"
  class="contact-btn"
  style="text-decoration: none; color: white; display: inline-block; padding: 10px 20px; background-color: #007bff; border-radius: 5px;"
>
  Show More
</a>

        </div>
    `;
    
    return card;
}



// Search on Enter key
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateResultsCount();
    loadMoreMentors();
});

// Smooth scrolling for anchor links
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

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    }
});