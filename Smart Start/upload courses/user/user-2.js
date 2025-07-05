// Sample data
const sampleVideos = [
  {
    id: 1,
    title: "Advanced JavaScript Concepts",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "15:30",
    channel: "CodeMaster",
    views: "125K",
    uploadDate: "2 days ago",
    liked: true,
    saved: false,
    watchLater: true,
  },
  {
    id: 2,
    title: "React Hooks Deep Dive",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "22:45",
    channel: "React Pro",
    views: "89K",
    uploadDate: "1 week ago",
    liked: false,
    saved: true,
    watchLater: false,
  },
  {
    id: 3,
    title: "CSS Grid Layout Tutorial",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "18:20",
    channel: "WebDesign Hub",
    views: "67K",
    uploadDate: "3 days ago",
    liked: true,
    saved: true,
    watchLater: true,
  },
  {
    id: 4,
    title: "Node.js Best Practices",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "28:15",
    channel: "Backend Guru",
    views: "156K",
    uploadDate: "5 days ago",
    liked: false,
    saved: false,
    watchLater: true,
  },
  {
    id: 5,
    title: "Database Design Fundamentals",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "35:40",
    channel: "Data Expert",
    views: "203K",
    uploadDate: "1 week ago",
    liked: true,
    saved: true,
    watchLater: false,
  },
]

const sampleMentors = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: "Frontend Development",
    students: 1250,
    courses: 15,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: "Backend Architecture",
    students: 890,
    courses: 12,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: "UI/UX Design",
    students: 2100,
    courses: 20,
    rating: 4.9,
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: "Data Science",
    students: 756,
    courses: 8,
    rating: 4.7,
  },
]

// DOM Elements
const tabBtns = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")
const profileImage = document.getElementById("profileImage")
const imageUpload = document.getElementById("imageUpload")
const uploadModal = document.getElementById("uploadModal")
const closeModal = document.getElementById("closeModal")
const uploadArea = document.getElementById("uploadArea")
const fileInput = document.getElementById("fileInput")
const imagePreview = document.getElementById("imagePreview")
const previewImg = document.getElementById("previewImg")
const cancelUpload = document.getElementById("cancelUpload")
const confirmUpload = document.getElementById("confirmUpload")
const navToggle = document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initializeTabs()
  initializeImageUpload()
  initializeNavigation()
  populateContent()
  setupEventListeners()
})

// Tab functionality
function initializeTabs() {
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab")
      switchTab(tabId)
    })
  })
}

function switchTab(tabId) {
  // Remove active class from all tabs and contents
  tabBtns.forEach((btn) => btn.classList.remove("active"))
  tabContents.forEach((content) => content.classList.remove("active"))

  // Add active class to selected tab and content
  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active")
  document.getElementById(tabId).classList.add("active")
}

// Image upload functionality
function initializeImageUpload() {
  // Profile image click handler
  profileImage.parentElement.addEventListener("click", () => {
    uploadModal.style.display = "block"
  })

  // Modal close handlers
  closeModal.addEventListener("click", closeUploadModal)
  cancelUpload.addEventListener("click", closeUploadModal)

  // Click outside modal to close
  uploadModal.addEventListener("click", (e) => {
    if (e.target === uploadModal) {
      closeUploadModal()
    }
  })

  // Upload area click handler
  uploadArea.addEventListener("click", () => {
    fileInput.click()
  })

  // File input change handler
  fileInput.addEventListener("change", handleFileSelect)

  // Drag and drop handlers
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = "var(--accent-light)"
    uploadArea.style.background = "var(--background)"
  })

  uploadArea.addEventListener("dragleave", (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = "var(--border)"
    uploadArea.style.background = "transparent"
  })

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = "var(--border)"
    uploadArea.style.background = "transparent"

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  })

  // Confirm upload handler
  confirmUpload.addEventListener("click", () => {
    const src = previewImg.src
    profileImage.src = src
    closeUploadModal()
    showNotification("Profile picture updated successfully!", "success")
  })
}

function handleFileSelect(e) {
  const file = e.target.files[0]
  if (file) {
    handleFile(file)
  }
}

function handleFile(file) {
  if (file.type.startsWith("image/")) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImg.src = e.target.result
      uploadArea.style.display = "none"
      imagePreview.style.display = "block"
      confirmUpload.disabled = false
    }
    reader.readAsDataURL(file)
  } else {
    showNotification("Please select a valid image file.", "error")
  }
}

function closeUploadModal() {
  uploadModal.style.display = "none"
  uploadArea.style.display = "block"
  imagePreview.style.display = "none"
  confirmUpload.disabled = true
  fileInput.value = ""
}

// Navigation functionality
function initializeNavigation() {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    navToggle.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")
    })
  })
}

// Populate content
function populateContent() {
  populateHistory()
  populateMentors()
  populateLiked()
  populateSaved()
  populateWatchLater()
}

function populateHistory() {
  const historyGrid = document.getElementById("historyGrid")
  historyGrid.innerHTML = ""

  sampleVideos.forEach((video) => {
    const videoCard = createVideoCard(video)
    historyGrid.appendChild(videoCard)
  })
}

function populateMentors() {
  const mentorsGrid = document.getElementById("mentorsGrid")
  mentorsGrid.innerHTML = ""

  sampleMentors.forEach((mentor) => {
    const mentorCard = createMentorCard(mentor)
    mentorsGrid.appendChild(mentorCard)
  })
}

function populateLiked() {
  const likedGrid = document.getElementById("likedGrid")
  const likedVideos = sampleVideos.filter((video) => video.liked)

  likedGrid.innerHTML = ""

  if (likedVideos.length === 0) {
    likedGrid.innerHTML = createEmptyState("heart", "No liked videos yet", "Videos you like will appear here")
  } else {
    likedVideos.forEach((video) => {
      const videoCard = createVideoCard(video)
      likedGrid.appendChild(videoCard)
    })
  }
}

function populateSaved() {
  const savedGrid = document.getElementById("savedGrid")
  const savedVideos = sampleVideos.filter((video) => video.saved)

  savedGrid.innerHTML = ""

  if (savedVideos.length === 0) {
    savedGrid.innerHTML = createEmptyState("bookmark", "No saved videos yet", "Save videos to watch them later")
  } else {
    savedVideos.forEach((video) => {
      const videoCard = createVideoCard(video)
      savedGrid.appendChild(videoCard)
    })
  }
}

function populateWatchLater() {
  const watchLaterGrid = document.getElementById("watchLaterGrid")
  const watchLaterVideos = sampleVideos.filter((video) => video.watchLater)

  watchLaterGrid.innerHTML = ""

  if (watchLaterVideos.length === 0) {
    watchLaterGrid.innerHTML = createEmptyState(
      "clock",
      "No videos in watch later",
      "Add videos to your watch later list",
    )
  } else {
    watchLaterVideos.forEach((video) => {
      const videoCard = createVideoCard(video)
      watchLaterGrid.appendChild(videoCard)
    })
  }
}

// Create video card
function createVideoCard(video) {
  const card = document.createElement("div")
  card.className = "video-card fade-in"
  card.innerHTML = `
        <div class="video-thumbnail">
            <img src="${video.thumbnail}" alt="${video.title}">
            <span class="video-duration">${video.duration}</span>
        </div>
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <div class="video-meta">
                ${video.channel} • ${video.views} views • ${video.uploadDate}
            </div>
            <div class="video-actions">
                <button class="action-btn ${video.liked ? "active" : ""}" data-action="like" data-id="${video.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="action-btn ${video.saved ? "active" : ""}" data-action="save" data-id="${video.id}">
                    <i class="fas fa-bookmark"></i>
                </button>
                <button class="action-btn ${video.watchLater ? "active" : ""}" data-action="watchlater" data-id="${video.id}">
                    <i class="fas fa-clock"></i>
                </button>
                <button class="action-btn" data-action="share" data-id="${video.id}">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        </div>
    `

  // Add event listeners for action buttons
  const actionBtns = card.querySelectorAll(".action-btn")
  actionBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      handleVideoAction(btn.dataset.action, btn.dataset.id, btn)
    })
  })

  return card
}

// Create mentor card
function createMentorCard(mentor) {
  const card = document.createElement("div")
  card.className = "mentor-card fade-in"
  card.innerHTML = `
        <div class="mentor-avatar">
            <img src="${mentor.avatar}" alt="${mentor.name}">
        </div>
        <h3 class="mentor-name">${mentor.name}</h3>
        <p class="mentor-expertise">${mentor.expertise}</p>
        <div class="mentor-stats">
            <span>${mentor.students} Students</span>
            <span>${mentor.courses} Courses</span>
            <span>★ ${mentor.rating}</span>
        </div>
        <button class="btn btn-primary">
            <i class="fas fa-user-plus"></i>
            Follow
        </button>
    `

  return card
}

// Create empty state
function createEmptyState(icon, title, description) {
  return `
        <div class="empty-state">
            <i class="fas fa-${icon}"></i>
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `
}

// Handle video actions
function handleVideoAction(action, videoId, button) {
  const video = sampleVideos.find((v) => v.id == videoId)
  if (!video) return

  switch (action) {
    case "like":
      video.liked = !video.liked
      button.classList.toggle("active")
      showNotification(video.liked ? "Added to liked videos" : "Removed from liked videos", "success")
      break
    case "save":
      video.saved = !video.saved
      button.classList.toggle("active")
      showNotification(video.saved ? "Video saved" : "Video removed from saved", "success")
      break
    case "watchlater":
      video.watchLater = !video.watchLater
      button.classList.toggle("active")
      showNotification(video.watchLater ? "Added to watch later" : "Removed from watch later", "success")
      break
    case "share":
      navigator.clipboard.writeText(`https://example.com/video/${videoId}`)
      showNotification("Video link copied to clipboard", "success")
      break
  }

  // Update content if needed
  setTimeout(() => {
    populateLiked()
    populateSaved()
    populateWatchLater()
  }, 100)
}

// Setup additional event listeners
function setupEventListeners() {
  // Clear history button
  document.getElementById("clearHistory").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your watch history?")) {
      document.getElementById("historyGrid").innerHTML = createEmptyState(
        "history",
        "No watch history",
        "Videos you watch will appear here",
      )
      showNotification("Watch history cleared", "success")
    }
  })

  // Find mentors button
  document.getElementById("findMentors").addEventListener("click", () => {
    showNotification("Redirecting to mentor discovery...", "info")
  })

  // Play all button
  document.getElementById("playAll").addEventListener("click", () => {
    const watchLaterVideos = sampleVideos.filter((video) => video.watchLater)
    if (watchLaterVideos.length > 0) {
      showNotification(`Starting playlist with ${watchLaterVideos.length} videos`, "success")
    } else {
      showNotification("No videos in watch later list", "warning")
    }
  })

  // Filter change
  document.getElementById("likedFilter").addEventListener("change", (e) => {
    showNotification(`Filtering by: ${e.target.options[e.target.selectedIndex].text}`, "info")
  })

  // View options
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const view = btn.dataset.view
      const grid = document.getElementById("savedGrid")

      if (view === "list") {
        grid.style.gridTemplateColumns = "1fr"
      } else {
        grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))"
      }
    })
  })
}

// Show notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--card);
        border: 1px solid var(--border);
        border-left: 4px solid ${type === "success" ? "var(--success)" : type === "error" ? "var(--error)" : type === "warning" ? "var(--warning)" : "var(--accent-light)"};
        color: var(--foreground);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `
  notification.textContent = message

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Animate elements on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll(".fade-in")

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("visible")
    }
  })
}

// Add scroll event listener
window.addEventListener("scroll", animateOnScroll)

// Initial animation check
animateOnScroll()

// Preview image before upload
document.getElementById('profile_image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
 // تغيير الـ username عند كتابة الإيميل
        document.getElementById('email').addEventListener('input', function() {
            const email = this.value.trim();
            
            if (email.includes('@')) {
                // إرسال طلب للحصول على الـ username
                const formData = new FormData();
                formData.append('get_username', '1');
                formData.append('email', email);
                
                fetch('profile-1.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(username => {
                    if (username !== "User not found") {
                        document.getElementById('displayUsername').textContent = username;
                    } else {
                        document.getElementById('displayUsername').textContent = 'John Doe';
                    }
                });
            }
        });

        // معاينة الصورة قبل الرفع
        document.getElementById('profile_image').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profileImage').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });