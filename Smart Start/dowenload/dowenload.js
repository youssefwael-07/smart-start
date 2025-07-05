// Global variables
let currentSort = "recent";
let currentFilter = "all";
let currentVideo = null;
let toastQueue = [];
let toastContainer = null;

// Enhanced video database with YouTube support
const videoDatabase = {
  "Advanced JavaScript Concepts": {
    url: "https://www.youtube.com/watch?v=GM6dQBmc-Xg",
    type: "youtube",
    duration: "4:30",
    views: 1250,
    likes: 89,
    description: "Master advanced JavaScript concepts including closures, prototypes, async/await, and modern ES6+ features. This comprehensive course will take your JavaScript skills to the next level with practical examples and real-world applications.",
    thumbnail: "https://img.youtube.com/vi/GM6dQBmc-Xg/maxresdefault.jpg",
    progress: 75,
    status: "in-progress"
  },
  "React Hooks Deep Dive": {
    url: "https://www.youtube.com/watch?v=O6P86uwfdR0",
    type: "youtube",
    duration: "6:15",
    views: 2100,
    likes: 156,
    description: "Comprehensive guide to React Hooks including useState, useEffect, useContext, and custom hooks. Learn how to build modern React applications with functional components and advanced patterns.",
    thumbnail: "https://img.youtube.com/vi/O6P86uwfdR0/maxresdefault.jpg",
    progress: 100,
    status: "completed"
  },
  "Node.js Backend Development": {
    url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    type: "youtube",
    duration: "3:45",
    views: 890,
    likes: 67,
    description: "Build robust backend applications with Node.js, Express, and MongoDB integration. Learn server-side development from scratch to deployment with best practices and security considerations.",
    thumbnail: "https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg",
    progress: 30,
    status: "in-progress"
  },
  "CSS Grid & Flexbox Mastery": {
    url: "https://www.youtube.com/watch?v=jV8B24rSN5o",
    type: "youtube",
    duration: "5:20",
    views: 1450,
    likes: 112,
    description: "Master modern CSS layout techniques with Grid and Flexbox for responsive web design. Create beautiful, responsive layouts with ease and learn advanced positioning techniques.",
    thumbnail: "https://img.youtube.com/vi/jV8B24rSN5o/maxresdefault.jpg",
    progress: 0,
    status: "not-started"
  },
  "Python Data Science": {
    url: "https://www.youtube.com/watch?v=ua-CiDNNj30",
    type: "youtube",
    duration: "4:10",
    views: 1780,
    likes: 134,
    description: "Learn data analysis and visualization with Python, Pandas, NumPy, and Matplotlib. Perfect for beginners in data science with hands-on projects and real datasets.",
    thumbnail: "https://img.youtube.com/vi/ua-CiDNNj30/maxresdefault.jpg",
    progress: 60,
    status: "in-progress"
  },
  "Machine Learning Fundamentals": {
    url: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
    type: "youtube",
    duration: "7:30",
    views: 2340,
    likes: 198,
    description: "Introduction to machine learning algorithms, supervised and unsupervised learning techniques. Start your AI journey here with practical implementations and theory.",
    thumbnail: "https://img.youtube.com/vi/ukzFI9rgwfU/maxresdefault.jpg",
    progress: 0,
    status: "not-started"
  }
};

// YouTube URL utilities
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getYouTubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
}

function getYouTubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function isValidYouTubeUrl(url) {
  return extractYouTubeId(url) !== null;
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

function initializeApp() {
  createToastContainer();
  setupEventListeners();
  renderVideoCards();
  renderContinueCards();
  filterCourses();
  loadSavedProgress();

  // Welcome sequence
  setTimeout(() => {
    showToast("🎉 Welcome to Enhanced MentorLink!", "success");
  }, 1000);

  setTimeout(() => {
    showToast("💡 Click on any video thumbnail to start watching!", "info");
  }, 2500);
}

// Toast System
function createToastContainer() {
  const existingContainer = document.querySelector(".toast-container");
  if (existingContainer) {
    existingContainer.remove();
  }

  toastContainer = document.createElement("div");
  toastContainer.className = "toast-container";
  document.body.appendChild(toastContainer);
}

function showToast(message, type = "success", duration = 3000) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const toastContent = document.createElement("div");
  toastContent.className = "toast-content";

  const icon = document.createElement("div");
  icon.className = "toast-icon";
  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };
  icon.textContent = iconMap[type] || "•";

  const messageEl = document.createElement("div");
  messageEl.className = "toast-message";
  messageEl.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.innerHTML = "×";
  closeBtn.onclick = () => removeToast(toast);

  toastContent.appendChild(icon);
  toastContent.appendChild(messageEl);
  toastContent.appendChild(closeBtn);
  toast.appendChild(toastContent);

  const progress = document.createElement("div");
  progress.className = "toast-progress";
  progress.style.width = "100%";
  toast.appendChild(progress);

  if (toastContainer) {
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
      progress.style.width = "0%";
      progress.style.transition = `width ${duration}ms linear`;
    });

    setTimeout(() => {
      removeToast(toast);
    }, duration);

    toastQueue.push(toast);
    if (toastQueue.length > 5) {
      removeToast(toastQueue[0]);
    }
  }

  return toast;
}

function removeToast(toast) {
  if (toast && toast.parentNode) {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      toastQueue = toastQueue.filter((t) => t !== toast);
    }, 300);
  }
}

// Render video cards dynamically
function renderVideoCards() {
  const playlist = document.getElementById("course-playlist");
  if (!playlist) return;

  playlist.innerHTML = "";

  Object.entries(videoDatabase).forEach(([title, video]) => {
    const courseItem = createVideoCard(title, video);
    playlist.appendChild(courseItem);
  });
}

function createVideoCard(title, video) {
  const courseItem = document.createElement("div");
  courseItem.className = "course-item";
  courseItem.dataset.title = title;
  courseItem.dataset.status = video.status;
  courseItem.dataset.progress = video.progress;

  const videoId = extractYouTubeId(video.url);
  const thumbnail = video.thumbnail || getYouTubeThumbnail(videoId);

  courseItem.innerHTML = `
    <div class="course-thumbnail" onclick="playVideo('${title}')">
      <img src="${thumbnail}" alt="${title}" onerror="this.src='/placeholder.svg?height=200&width=200'">
      <div class="play-overlay">
        <i class="fas fa-play-circle"></i>
      </div>
      <div class="progress-indicator" style="width: ${video.progress}%"></div>
      <div class="video-duration-badge">${video.duration}</div>
      ${video.progress === 0 ? '<div class="new-badge">NEW</div>' : ''}
    </div>
    <div class="course-details">
      <div class="course-info">
        <h3>${title}</h3>
        <div class="course-meta">
          <span class="duration"><i class="fas fa-clock"></i> ${video.duration}</span>
          <span class="modules"><i class="fas fa-layer-group"></i> 12 modules</span>
          <span class="rating"><i class="fas fa-star"></i> 4.8</span>
        </div>
        <p class="course-description">${video.description}</p>
      </div>
      <div class="course-actions">
        <div class="progress-text ${video.status === 'completed' ? 'completed' : video.status === 'not-started' ? 'not-started' : ''}">
          ${video.status === 'completed' ? 'Completed' : video.status === 'not-started' ? 'Not started' : `${video.progress}% completed`}
        </div>
        <button class="btn-resume" onclick="handleCourseAction(event)">
          ${video.status === 'completed' ? 'Review' : video.status === 'not-started' ? 'Start' : 'Resume'} 
          <i class="fas fa-${video.status === 'completed' ? 'redo' : 'arrow-right'}"></i>
        </button>
        <button class="btn-icon course-menu" title="Course Options" onclick="showCourseMenu(event)">
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </div>
  `;

  return courseItem;
}

function renderContinueCards() {
  const continueCards = document.getElementById("continue-cards");
  if (!continueCards) return;

  continueCards.innerHTML = "";

  // Filter videos that are in progress
  const inProgressVideos = Object.entries(videoDatabase)
    .filter(([_, video]) => video.status === "in-progress")
    .slice(0, 3); // Show only top 3

  inProgressVideos.forEach(([title, video]) => {
    const card = document.createElement("div");
    card.className = "continue-card";
    
    const moduleNumber = Math.floor((video.progress / 100) * 12) + 1;
    
    card.innerHTML = `
      <div class="continue-header">
        <h4>${title}</h4>
        <span class="module-indicator">Module ${moduleNumber} of 12</span>
      </div>
      <div class="continue-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${video.progress}%"></div>
        </div>
        <span>${video.progress}%</span>
      </div>
      <button class="btn-continue" onclick="playVideo('${title}')">
        <i class="fas fa-play"></i> Continue
      </button>
    `;

    continueCards.appendChild(card);
  });
}

// Event Listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", handleNavigation);
  });

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", handleFilter);
  });

  // Sort dropdown
  const sortBtn = document.getElementById("sort-btn");
  const sortMenu = document.getElementById("sort-menu");

  if (sortBtn && sortMenu) {
    sortBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sortMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!sortBtn.contains(e.target) && !sortMenu.contains(e.target)) {
        sortMenu.classList.remove("show");
      }
    });
  }

  // Search functionality
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        filterCourses();
        if (e.target.value.length > 0) {
          showToast(`🔍 Searching for "${e.target.value}"`, "info", 1500);
        }
      }, 300);
    });
  }

  // Header actions
  const addVideoBtn = document.getElementById("add-video-btn");
  const notificationsBtn = document.getElementById("notifications-btn");
  const filtersBtn = document.getElementById("filters-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");

  if (addVideoBtn) {
    addVideoBtn.addEventListener("click", showAddVideoModal);
  }

  if (notificationsBtn) {
    notificationsBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      showToast("🔔 You have 3 new notifications!", "info");
    });
  }

  if (filtersBtn) {
    filtersBtn.addEventListener("click", function () {
      this.classList.toggle("active");
      showToast("⚙️ Advanced filters coming soon!", "warning");
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", toggleFullscreen);
  }

  // Add video modal
  const addVideoModal = document.getElementById("add-video-modal");
  const closeAddVideoBtn = document.getElementById("close-add-video");
  const cancelAddVideoBtn = document.getElementById("cancel-add-video");
  const confirmAddVideoBtn = document.getElementById("confirm-add-video");

  if (closeAddVideoBtn) {
    closeAddVideoBtn.addEventListener("click", hideAddVideoModal);
  }

  if (cancelAddVideoBtn) {
    cancelAddVideoBtn.addEventListener("click", hideAddVideoModal);
  }

  if (confirmAddVideoBtn) {
    confirmAddVideoBtn.addEventListener("click", addNewVideo);
  }

  if (addVideoModal) {
    addVideoModal.addEventListener("click", function (e) {
      if (e.target === this) {
        hideAddVideoModal();
      }
    });
  }

  // Video modal controls
  const closeVideoBtn = document.getElementById("close-video");
  const playButton = document.getElementById("play-button");

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener("click", closeVideoModal);
  }

  if (playButton) {
    playButton.addEventListener("click", playVideoInModal);
  }

  // Video actions
  const likeBtn = document.getElementById("like-btn");
  const bookmarkBtn = document.getElementById("bookmark-btn");
  const shareBtn = document.getElementById("share-btn");
  const removeBtn = document.getElementById("remove-btn");

  if (likeBtn) likeBtn.addEventListener("click", toggleLike);
  if (bookmarkBtn) bookmarkBtn.addEventListener("click", toggleBookmark);
  if (shareBtn) shareBtn.addEventListener("click", shareVideo);
  if (removeBtn) removeBtn.addEventListener("click", removeVideo);

  // Modal interactions
  const videoModal = document.getElementById("video-modal");
  if (videoModal) {
    videoModal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeVideoModal();
      }
    });
  }

  // Sort options
  document.querySelectorAll(".sort-option").forEach((option) => {
    option.addEventListener("click", handleSort);
  });

  // Mentor profile
  const mentorProfile = document.querySelector(".mentor-profile");
  if (mentorProfile) {
    mentorProfile.addEventListener("click", () => {
      showToast("👤 Profile settings coming soon!", "info");
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);
}

// Add Video Modal Functions
function showAddVideoModal() {
  const modal = document.getElementById("add-video-modal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    
    // Clear form
    document.getElementById("video-url").value = "";
    document.getElementById("video-title-input").value = "";
    document.getElementById("video-desc").value = "";
  }
}

function hideAddVideoModal() {
  const modal = document.getElementById("add-video-modal");
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
  }
}

function addNewVideo() {
  const urlInput = document.getElementById("video-url");
  const titleInput = document.getElementById("video-title-input");
  const descInput = document.getElementById("video-desc");

  const url = urlInput.value.trim();
  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!url || !title) {
    showToast("❌ Please fill in URL and title fields", "error");
    return;
  }

  if (!isValidYouTubeUrl(url)) {
    showToast("❌ Please enter a valid YouTube URL", "error");
    return;
  }

  if (videoDatabase[title]) {
    showToast("❌ A video with this title already exists", "error");
    return;
  }

  const videoId = extractYouTubeId(url);
  
  // Add new video to database
  videoDatabase[title] = {
    url: url,
    type: "youtube",
    duration: "Unknown",
    views: 0,
    likes: 0,
    description: description || "No description provided",
    thumbnail: getYouTubeThumbnail(videoId),
    progress: 0,
    status: "not-started"
  };

  // Re-render video cards
  renderVideoCards();
  renderContinueCards();
  
  // Hide modal
  hideAddVideoModal();
  
  // Save to localStorage
  autoSaveProgress();
  
  showToast(`✅ Added "${title}" successfully!`, "success");
}

// Navigation Handler
function handleNavigation() {
  document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"));
  this.classList.add("active");

  const page = this.dataset.page;
  const pageTitle = document.getElementById("page-title");

  const pageConfig = {
    downloaded: {
      title: "Enhanced Video Platform",
      message: "📚 Welcome to your learning dashboard!",
      type: "success",
    },
    discover: {
      title: "Discover Videos",
      message: "🔍 Discover page coming soon!",
      type: "info",
    },
    history: {
      title: "Learning History",
      message: "📈 History page coming soon!",
      type: "info",
    },
    bookmarks: {
      title: "Bookmarked Videos",
      message: "🔖 Bookmarks page coming soon!",
      type: "info",
    },
    certificates: {
      title: "My Certificates",
      message: "🏆 Certificates page coming soon!",
      type: "info",
    },
    settings: {
      title: "Settings",
      message: "⚙️ Settings page coming soon!",
      type: "info",
    },
  };

  const config = pageConfig[page];
  if (config && pageTitle) {
    pageTitle.textContent = config.title;
    showToast(config.message, config.type);
  }
}

// Filter Handler
function handleFilter() {
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  this.classList.add("active");

  currentFilter = this.dataset.filter;
  filterCourses();

  const filterMessages = {
    all: "📋 Showing all videos",
    "in-progress": "⏳ Showing videos in progress",
    completed: "✅ Showing completed videos",
    "not-started": "🆕 Showing new videos",
  };

  showToast(filterMessages[currentFilter] || "📋 Filter applied", "info");
}

// Sort Handler
function handleSort() {
  document.querySelectorAll(".sort-option").forEach((opt) => opt.classList.remove("active"));
  this.classList.add("active");

  currentSort = this.dataset.sort;
  const sortText = document.getElementById("sort-text");
  const sortMenu = document.getElementById("sort-menu");

  if (sortText) sortText.textContent = this.textContent;
  if (sortMenu) sortMenu.classList.remove("show");

  sortCourses();

  const sortMessages = {
    recent: "🕒 Sorted by most recent",
    alphabetical: "🔤 Sorted alphabetically",
    progress: "📊 Sorted by progress",
    duration: "⏱️ Sorted by duration",
  };

  showToast(sortMessages[currentSort] || "📊 Sorting applied", "success");
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
  if (e.key === "Escape") {
    closeVideoModal();
    hideAddVideoModal();
    return;
  }

  if (e.key === " " && currentVideo && e.target.tagName !== "INPUT") {
    e.preventDefault();
    // YouTube iframe doesn't support direct play/pause control
    showToast("⏸️ Use YouTube player controls", "info", 1500);
    return;
  }

  if ((e.key === "f" || e.key === "F") && currentVideo && e.target.tagName !== "INPUT") {
    e.preventDefault();
    toggleVideoFullscreen();
    return;
  }
}

// Video Functions
function playVideo(title) {
  if (!videoDatabase[title]) {
    showToast("❌ Video not available", "error");
    return;
  }

  currentVideo = title;
  const videoInfo = videoDatabase[title];
  const videoId = extractYouTubeId(videoInfo.url);

  if (!videoId) {
    showToast("❌ Invalid YouTube video", "error");
    return;
  }

  // Update modal content
  const videoTitle = document.getElementById("video-title");
  const videoDuration = document.getElementById("video-duration-text");
  const videoViews = document.getElementById("video-views");
  const videoLikes = document.getElementById("video-likes");
  const videoDescription = document.getElementById("video-description-text");

  if (videoTitle) videoTitle.textContent = title;
  if (videoDuration) videoDuration.textContent = videoInfo.duration;
  if (videoViews) videoViews.textContent = videoInfo.views.toLocaleString();
  if (videoLikes) videoLikes.textContent = videoInfo.likes;
  if (videoDescription) videoDescription.textContent = videoInfo.description;

  // Create YouTube iframe
  const playerContainer = document.getElementById("video-player-container");
  if (playerContainer) {
    const embedUrl = getYouTubeEmbedUrl(videoId);
    playerContainer.innerHTML = `
      <iframe 
        src="${embedUrl}" 
        title="${title}"
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    `;
  }

  // Show modal
  const modal = document.getElementById("video-modal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  // Hide play overlay since YouTube handles its own controls
  const overlay = document.getElementById("video-overlay");
  if (overlay) {
    overlay.classList.remove("show");
  }

  // Update view count
  videoDatabase[title].views++;
  if (videoViews) {
    videoViews.textContent = videoDatabase[title].views.toLocaleString();
  }

  showToast(`🎬 Now playing: ${title}`, "success");
}

function playVideoInModal() {
  // YouTube iframe handles its own play functionality
  const overlay = document.getElementById("video-overlay");
  if (overlay) {
    overlay.classList.remove("show");
  }
}

function closeVideoModal() {
  const modal = document.getElementById("video-modal");
  const playerContainer = document.getElementById("video-player-container");

  // Clear iframe to stop video
  if (playerContainer) {
    playerContainer.innerHTML = "";
  }

  if (modal) {
    modal.classList.remove("show");
  }

  document.body.style.overflow = "auto";

  if (currentVideo) {
    showToast(`👋 Thanks for watching: ${currentVideo}`, "info");
  }

  currentVideo = null;

  // Reset button states
  const likeBtn = document.getElementById("like-btn");
  const bookmarkBtn = document.getElementById("bookmark-btn");

  if (likeBtn) likeBtn.classList.remove("active");
  if (bookmarkBtn) bookmarkBtn.classList.remove("active");
}

function toggleVideoFullscreen() {
  const iframe = document.querySelector("#video-player-container iframe");
  if (!iframe) return;

  if (document.fullscreenElement) {
    document.exitFullscreen();
    showToast("🔲 Exited video fullscreen", "info");
  } else {
    iframe.requestFullscreen()
      .then(() => {
        showToast("🔳 Video in fullscreen mode", "success");
      })
      .catch(() => {
        showToast("❌ Video fullscreen not supported", "error");
      });
  }
}

// Video Actions
function toggleLike() {
  const btn = document.getElementById("like-btn");
  const likesSpan = document.getElementById("video-likes");

  if (currentVideo && videoDatabase[currentVideo] && btn && likesSpan) {
    if (btn.classList.contains("active")) {
      btn.classList.remove("active");
      videoDatabase[currentVideo].likes--;
      showToast("💔 Removed from liked videos", "warning");
    } else {
      btn.classList.add("active");
      videoDatabase[currentVideo].likes++;
      showToast("❤️ Added to liked videos!", "success");
    }
    likesSpan.textContent = videoDatabase[currentVideo].likes;
    autoSaveProgress();
  }
}

function toggleBookmark() {
  const btn = document.getElementById("bookmark-btn");
  if (!btn) return;

  if (btn.classList.contains("active")) {
    btn.classList.remove("active");
    showToast("🔖 Removed from bookmarks", "warning");
  } else {
    btn.classList.add("active");
    showToast("📌 Added to bookmarks!", "success");
  }
}

function shareVideo() {
  if (!currentVideo) return;

  const videoInfo = videoDatabase[currentVideo];
  const shareData = {
    title: currentVideo,
    text: `Check out this amazing video: ${currentVideo}`,
    url: videoInfo.url,
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => {
        showToast("📤 Video shared successfully!", "success");
      })
      .catch(() => {
        fallbackShare();
      });
  } else {
    fallbackShare();
  }
}

function fallbackShare() {
  if (!currentVideo) return;

  const videoInfo = videoDatabase[currentVideo];
  navigator.clipboard.writeText(videoInfo.url)
    .then(() => {
      showToast("📋 Video link copied to clipboard!", "success");
    })
    .catch(() => {
      showToast("❌ Unable to copy link", "error");
    });
}

function removeVideo() {
  if (!currentVideo) return;

  if (confirm(`Are you sure you want to remove "${currentVideo}" from your library?`)) {
    delete videoDatabase[currentVideo];
    closeVideoModal();
    renderVideoCards();
    renderContinueCards();
    autoSaveProgress();
    showToast(`🗑️ Removed "${currentVideo}" from library`, "success");
  }
}

// Course Actions
function handleCourseAction(e) {
  const courseItem = e.target.closest(".course-item");
  if (!courseItem) return;

  const title = courseItem.dataset.title;
  const progress = parseInt(courseItem.dataset.progress) || 0;
  const status = courseItem.dataset.status;

  if (status === "completed") {
    showToast(`📚 Reviewing: ${title}`, "info");
    playVideo(title);
  } else if (status === "not-started") {
    showToast(`🚀 Starting course: ${title}`, "success");
    updateCourseProgress(title, 5);
    setTimeout(() => playVideo(title), 1000);
  } else {
    showToast(`▶️ Resuming: ${title} (${progress}% complete)`, "info");
    playVideo(title);
    setTimeout(() => {
      updateCourseProgress(title, Math.min(progress + 5, 100));
      showToast("📈 Progress updated!", "success");
    }, 2000);
  }
}

function showCourseMenu(e) {
  e.stopPropagation();
  showToast("⚙️ Course options menu coming soon!", "info");
}

// Progress Update
function updateCourseProgress(courseName, newProgress) {
  if (videoDatabase[courseName]) {
    videoDatabase[courseName].progress = newProgress;
    
    if (newProgress >= 100) {
      videoDatabase[courseName].status = "completed";
    } else if (newProgress > 0) {
      videoDatabase[courseName].status = "in-progress";
    }
  }

  // Re-render cards to reflect changes
  renderVideoCards();
  renderContinueCards();
  autoSaveProgress();

  if (newProgress >= 100) {
    showToast(`🎉 Congratulations! You completed ${courseName}!`, "success");
  }
}

// Fullscreen Toggle
function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    showToast("🔲 Exited fullscreen", "info");
  } else {
    document.documentElement.requestFullscreen()
      .then(() => {
        showToast("🔳 Entered fullscreen mode", "success");
      })
      .catch(() => {
        showToast("❌ Fullscreen not supported", "error");
      });
  }
}

// Filter and Sort Functions
function filterCourses() {
  const courses = document.querySelectorAll(".course-item");
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  let visibleCount = 0;

  courses.forEach((course) => {
    const title = course.dataset.title ? course.dataset.title.toLowerCase() : "";
    const status = course.dataset.status;

    const matchesSearch = title.includes(searchTerm);
    const matchesFilter = currentFilter === "all" || status === currentFilter;

    if (matchesSearch && matchesFilter) {
      course.classList.remove("hidden");
      visibleCount++;
    } else {
      course.classList.add("hidden");
    }
  });

  if (searchTerm.length > 0) {
    showToast(`🔍 Found ${visibleCount} video${visibleCount !== 1 ? "s" : ""}`, "info");
  }
}

function sortCourses() {
  const playlist = document.getElementById("course-playlist");
  if (!playlist) return;

  const courses = Array.from(playlist.querySelectorAll(".course-item"));

  courses.sort((a, b) => {
    switch (currentSort) {
      case "alphabetical":
        return (a.dataset.title || "").localeCompare(b.dataset.title || "");
      case "progress":
        return parseInt(b.dataset.progress || "0") - parseInt(a.dataset.progress || "0");
      case "duration":
        const aDuration = a.querySelector(".duration")?.textContent || "";
        const bDuration = b.querySelector(".duration")?.textContent || "";
        return aDuration.localeCompare(bDuration);
      case "recent":
      default:
        return 0;
    }
  });

  courses.forEach((course, index) => {
    setTimeout(() => {
      playlist.appendChild(course);
    }, index * 50);
  });
}

// Auto-save and Load Functions
function autoSaveProgress() {
  try {
    localStorage.setItem("mentorLinkVideos", JSON.stringify(videoDatabase));
  } catch (error) {
    console.error("Error saving progress:", error);
  }
}

function loadSavedProgress() {
  try {
    const savedData = localStorage.getItem("mentorLinkVideos");

    if (savedData) {
      const savedVideos = JSON.parse(savedData);
      
      // Merge saved data with default videos
      Object.keys(savedVideos).forEach(title => {
        if (videoDatabase[title]) {
          // Update existing video progress
          videoDatabase[title].progress = savedVideos[title].progress || 0;
          videoDatabase[title].status = savedVideos[title].status || "not-started";
          videoDatabase[title].views = savedVideos[title].views || videoDatabase[title].views;
          videoDatabase[title].likes = savedVideos[title].likes || videoDatabase[title].likes;
        } else {
          // Add new custom video
          videoDatabase[title] = savedVideos[title];
        }
      });

      // Re-render with updated data
      renderVideoCards();
      renderContinueCards();

      const videoCount = Object.keys(savedVideos).length;
      setTimeout(() => {
        showToast(`📚 Restored ${videoCount} video${videoCount !== 1 ? "s" : ""} from your library`, "success");
      }, 1500);
    }
  } catch (error) {
    console.error("Error loading saved progress:", error);
    showToast("⚠️ Error loading saved progress", "error");
  }
}

// Auto-save interval
setInterval(autoSaveProgress, 30000);

// Error handling
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  showToast("⚠️ Something went wrong. Please refresh the page.", "error");
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  showToast("⚠️ Network error. Please check your connection.", "warning");
});