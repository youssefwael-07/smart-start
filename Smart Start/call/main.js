const APP_ID = "223313147be042d2a49622636c3fd6b4"
const TOKEN = "007eJxTYFhuIyprNsnm+bWDj/c6rdH3UGBVf3bbYaVRbI3Rntnf9AQUGIyMjI0NjQ1NzJNSDUyMUowSTSzNjIzMjM2SjdNSzJJMYhM8MxoCGRkU7/5mZmSAQBCfiyE3Na8kvygnMy+bgQEAbgEf6g=="
const CHANNEL = "mentorlink"

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handleUserJoined)
    
    client.on('user-left', handleUserLeft)
    
    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks() 

    let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                  </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UID}`)
    
    await client.publish([localTracks[0], localTracks[1]])
}

let joinStream = async () => {
    await joinAndDisplayLocalStream()
    document.getElementById('join-btn').style.display = 'none'
    document.getElementById('stream-controls').style.display = 'flex'
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user 
    await client.subscribe(user, mediaType)

    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div> 
                 </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for(let i = 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('join-btn').style.display = 'block'
    document.getElementById('stream-controls').style.display = 'none'
    document.getElementById('video-streams').innerHTML = ''
}

let toggleMic = async (e) => {
    if (localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.innerText = 'Mic on'
        e.target.style.backgroundColor = 'cadetblue'
    }else{
        await localTracks[0].setMuted(true)
        e.target.innerText = 'Mic off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

let toggleCamera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.innerText = 'Camera on'
        e.target.style.backgroundColor = 'cadetblue'
    }else{
        await localTracks[1].setMuted(true)
        e.target.innerText = 'Camera off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

document.getElementById('join-btn').addEventListener('click', joinStream)
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)







document.addEventListener('DOMContentLoaded', function() {
    // Create particles for background animation
    createParticles();
    
    // Initialize the video call interface
    initializeVideoCall();
    
    // Set up event listeners
    setupEventListeners();
});

// Create animated background particles
function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 4 + 6}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(particle);
    }
}

// Initialize the video call interface
function initializeVideoCall() {
    // Create header bar
    createHeaderBar();
    
    // Create join button if not exists
    if (!document.getElementById('join-btn')) {
        const joinBtn = document.createElement('button');
        joinBtn.id = 'join-btn';
        joinBtn.textContent = 'Join Meeting';
        document.body.appendChild(joinBtn);
    }
    
    // Create stream controls
    createStreamControls();
    
    // Create notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
    
    // Create floating panels
    createFloatingPanels();
}



// Format meeting time
function formatMeetingTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm} • ${now.toLocaleDateString()}`;
}

// Create stream controls
function createStreamControls() {
    const streamControls = document.createElement('div');
    streamControls.id = 'stream-controls';
    
    // Mute button
    const muteBtn = document.createElement('button');
    muteBtn.className = 'btn-mute';
    muteBtn.innerHTML = '<span>🎤</span> Mute';
    muteBtn.addEventListener('click', toggleMute);
    
    // Video button
    const videoBtn = document.createElement('button');
    videoBtn.className = 'btn-video';
    videoBtn.innerHTML = '<span>📹</span> Stop Video';
    videoBtn.addEventListener('click', toggleVideo);
    
    // Screen share button
    const screenShareBtn = document.createElement('button');
    screenShareBtn.className = 'btn-screen-share';
    screenShareBtn.innerHTML = '<span>📊</span> Share Screen';
    screenShareBtn.addEventListener('click', toggleScreenShare);
    
    // End call button
    const endCallBtn = document.createElement('button');
    endCallBtn.className = 'btn-end-call';
    endCallBtn.innerHTML = '<span>📴</span> End Call';
    endCallBtn.addEventListener('click', endCall);
    
    // Settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'btn-settings';
    settingsBtn.innerHTML = '<span>⚙️</span> Settings';
    
    // Append all buttons
    streamControls.appendChild(muteBtn);
    streamControls.appendChild(videoBtn);
    streamControls.appendChild(screenShareBtn);
    streamControls.appendChild(endCallBtn);
    streamControls.appendChild(settingsBtn);
    
    document.body.appendChild(streamControls);
}

// Create floating panels
function createFloatingPanels() {
    // Participant counter
    const participantCounter = document.createElement('div');
    participantCounter.className = 'floating-panel participant-counter';
    participantCounter.textContent = '5 Participants';
    document.body.appendChild(participantCounter);
    
    // Connection status
    const connectionStatus = document.createElement('div');
    connectionStatus.className = 'floating-panel connection-status';
    
    const connectionIndicator = document.createElement('div');
    connectionIndicator.className = 'connection-indicator';
    
    const connectionText = document.createElement('span');
    connectionText.textContent = 'Excellent Connection';
    
    connectionStatus.appendChild(connectionIndicator);
    connectionStatus.appendChild(connectionText);
    document.body.appendChild(connectionStatus);
}

// Set up event listeners
function setupEventListeners() {
    // Join button click
    const joinBtn = document.getElementById('join-btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', joinMeeting);
    }
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Handle visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// Join meeting
function joinMeeting() {
    // Hide join button
    const joinBtn = document.getElementById('join-btn');
    joinBtn.style.display = 'none';
    
    // Show stream controls
    const streamControls = document.getElementById('stream-controls');
    streamControls.classList.add('show');
    
    // Create video streams
    createVideoStreams();
    
    // Show notification
    showNotification('join', 'You', 'joined the meeting');
    
    // Simulate other participants joining
    setTimeout(() => {
        addParticipant('John Doe', true);
        showNotification('join', 'John Doe', 'joined the meeting');
    }, 2000);
    
    setTimeout(() => {
        addParticipant('Sarah Smith', true);
        showNotification('join', 'Sarah Smith', 'joined the meeting');
    }, 3500);
    
    setTimeout(() => {
        addParticipant('Mike Johnson', false);
        showNotification('join', 'Mike Johnson', 'joined the meeting');
    }, 5000);
    
    setTimeout(() => {
        addParticipant('Emily Davis', true);
        showNotification('join', 'Emily Davis', 'joined the meeting');
    }, 6500);
    
    // Simulate participant actions
    simulateParticipantActions();
}

// Create video streams container
function createVideoStreams() {
    // Create container if not exists
    let videoStreams = document.getElementById('video-streams');
    if (!videoStreams) {
        videoStreams = document.createElement('div');
        videoStreams.id = 'video-streams';
        document.body.appendChild(videoStreams);
    }
    
    // Add your own video
    addParticipant('You (Host)', true, true);
}

// Add a participant
function addParticipant(name, withCamera = true, isYou = false) {
    const videoStreams = document.getElementById('video-streams');
    
    // Create video container
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container joining';
    videoContainer.dataset.participant = name;
    
    // Add camera-off class if no camera
    if (!withCamera) {
        videoContainer.classList.add('camera-off');
    }
    
    // Create video element if camera is on
    if (withCamera) {
        const videoPlayer = document.createElement('video');
        videoPlayer.className = 'video-player';
        videoPlayer.autoplay = true;
        videoPlayer.muted = true;
        videoPlayer.loop = true;
        
        // Use a placeholder video or connect to actual stream
        if (isYou) {
            // Try to get user media if this is your video
            navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    videoPlayer.srcObject = stream;
                })
                .catch(() => {
                    // Fallback to placeholder
                    videoPlayer.src = 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4';
                });
        } else {
            // Use placeholder videos for other participants
            const placeholders = [
                'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4',
                'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-smartphone-40973-large.mp4',
                'https://assets.mixkit.co/videos/preview/mixkit-man-with-a-smile-working-from-home-with-a-laptop-42913-large.mp4',
                'https://assets.mixkit.co/videos/preview/mixkit-woman-taking-selfies-in-the-street-1232-large.mp4'
            ];
            videoPlayer.src = placeholders[Math.floor(Math.random() * placeholders.length)];
        }
        
        videoContainer.appendChild(videoPlayer);
    } else {
        // Create avatar placeholder for camera off
        createAvatarPlaceholder(videoContainer, name);
    }
    
    // Create muted indicator
    const mutedIndicator = document.createElement('div');
    mutedIndicator.className = 'muted-indicator';
    mutedIndicator.innerHTML = '<div class="muted-icon"></div>';
    videoContainer.appendChild(mutedIndicator);
    
    // Create participant overlay
    const participantOverlay = document.createElement('div');
    participantOverlay.className = 'participant-overlay';
    
    const participantName = document.createElement('div');
    participantName.className = 'participant-name';
    participantName.textContent = name;
    
    const participantStatus = document.createElement('div');
    participantStatus.className = 'participant-status';
    
    const micStatus = document.createElement('div');
    micStatus.className = 'status-indicator';
    micStatus.innerHTML = '<div class="status-dot"></div> Mic on';
    
    participantStatus.appendChild(micStatus);
    participantOverlay.appendChild(participantName);
    participantOverlay.appendChild(participantStatus);
    
    videoContainer.appendChild(participantOverlay);
    
    // Create audio visualizer
    createAudioVisualizer(videoContainer);
    
    // Create participant actions menu
    createParticipantActions(videoContainer);
    
    // Create network quality indicator
    createNetworkQualityIndicator(videoContainer);
    
    // Add to video streams
    videoStreams.appendChild(videoContainer);
    
    // Remove joining class after animation
    setTimeout(() => {
        videoContainer.classList.remove('joining');
    }, 600);
    
    return videoContainer;
}

// Create avatar placeholder
function createAvatarPlaceholder(container, name) {
    const avatarPlaceholder = document.createElement('div');
    avatarPlaceholder.className = 'avatar-placeholder';
    
    const avatarCircle = document.createElement('div');
    avatarCircle.className = 'avatar-circle';
    
    const initials = getInitials(name);
    const avatarInitials = document.createElement('div');
    avatarInitials.className = 'avatar-initials';
    avatarInitials.textContent = initials;
    
    avatarCircle.appendChild(avatarInitials);
    
    const avatarName = document.createElement('div');
    avatarName.className = 'avatar-name';
    avatarName.textContent = name;
    
    const cameraOffLabel = document.createElement('div');
    cameraOffLabel.className = 'camera-off-label';
    cameraOffLabel.innerHTML = '<div class="camera-off-icon"></div> Camera Off';
    
    avatarPlaceholder.appendChild(avatarCircle);
    avatarPlaceholder.appendChild(avatarName);
    avatarPlaceholder.appendChild(cameraOffLabel);
    
    container.appendChild(avatarPlaceholder);
}

// Get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Create audio visualizer
function createAudioVisualizer(container) {
    const audioVisualizer = document.createElement('div');
    audioVisualizer.className = 'audio-visualizer';
    
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'audio-bar';
        bar.style.height = `${Math.random() * 20 + 5}px`;
        audioVisualizer.appendChild(bar);
    }
    
    container.appendChild(audioVisualizer);
}

// Create participant actions menu
function createParticipantActions(container) {
    const participantActions = document.createElement('div');
    participantActions.className = 'participant-actions';
    
    const actionsBtn = document.createElement('div');
    actionsBtn.className = 'actions-btn';
    actionsBtn.innerHTML = '⋮';
    actionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = participantActions.querySelector('.actions-menu');
        menu.classList.toggle('show');
    });
    
    const actionsMenu = document.createElement('div');
    actionsMenu.className = 'actions-menu';
    
    // Action items
    const actions = [
        { icon: '📌', text: 'Pin Video', action: () => pinParticipant(container) },
        { icon: '🔇', text: 'Mute', action: () => muteParticipant(container) },
        { icon: '📱', text: 'Spotlight', action: () => spotlightParticipant(container) },
        { icon: '👋', text: 'Send Reaction', action: () => sendReaction(container) },
        { icon: '❌', text: 'Remove', action: () => removeParticipant(container) }
    ];
    
    actions.forEach(action => {
        const actionItem = document.createElement('div');
        actionItem.className = 'action-item';
        actionItem.innerHTML = `
            <div class="action-icon">${action.icon}</div>
            <div class="action-text">${action.text}</div>
        `;
        actionItem.addEventListener('click', (e) => {
            e.stopPropagation();
            action.action();
            actionsMenu.classList.remove('show');
        });
        
        actionsMenu.appendChild(actionItem);
    });
    
    participantActions.appendChild(actionsBtn);
    participantActions.appendChild(actionsMenu);
    
    container.appendChild(participantActions);
    
    // Close menu when clicking outside
    document.addEventListener('click', () => {
        actionsMenu.classList.remove('show');
    });
}

// Create network quality indicator
function createNetworkQualityIndicator(container) {
    const networkQuality = document.createElement('div');
    networkQuality.className = 'network-quality';
    
    for (let i = 0; i < 4; i++) {
        const bar = document.createElement('div');
        bar.className = 'quality-bar';
        if (i < 3) {
            bar.classList.add('active');
        }
        networkQuality.appendChild(bar);
    }
    
    container.appendChild(networkQuality);
}

// Mute participant
function muteParticipant(container) {
    const isMuted = container.classList.contains('muted');
    
    if (!isMuted) {
        container.classList.add('muted');
        showNotification('mute', container.dataset.participant, 'has been muted');
    } else {
        container.classList.remove('muted');
        showNotification('unmute', container.dataset.participant, 'has been unmuted');
    }
}

// Spotlight participant
function spotlightParticipant(container) {
    const isSpotlighted = container.classList.contains('spotlight');
    
    // Remove spotlight from all containers
    document.querySelectorAll('.video-container').forEach(c => {
        c.classList.remove('spotlight');
    });
    
    if (!isSpotlighted) {
        container.classList.add('spotlight');
        
        // Create spotlight overlay if it doesn't exist
        if (!container.querySelector('.spotlight')) {
            const spotlight = document.createElement('div');
            spotlight.className = 'spotlight';
            container.appendChild(spotlight);
        }
        
        showNotification('info', container.dataset.participant, 'is now in spotlight');
    }
}

// Send reaction
function sendReaction(container) {
    const reactions = ['👍', '👏', '❤️', '😂', '😮', '🎉', '👋', '🔥'];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    const reaction = document.createElement('div');
    reaction.className = 'reaction';
    reaction.textContent = randomReaction;
    
    container.appendChild(reaction);
    
    // Remove reaction after animation
    setTimeout(() => {
        reaction.remove();
    }, 2000);
    
    showNotification('info', container.dataset.participant, `sent ${randomReaction}`);
}

// Remove participant
function removeParticipant(container) {
    if (confirm(`Remove ${container.dataset.participant} from the meeting?`)) {
        container.classList.add('left');
        
        // Create left overlay
        const leftOverlay = document.createElement('div');
        leftOverlay.className = 'left-overlay';
        leftOverlay.innerHTML = `
            <div class="left-message">
                <span class="left-icon">👋</span>
                ${container.dataset.participant} left
            </div>
        `;
        
        container.appendChild(leftOverlay);
        
        showNotification('leave', container.dataset.participant, 'was removed from the meeting');
        
        // Remove container after animation
        setTimeout(() => {
            container.remove();
            updateParticipantCounter();
        }, 1000);
    }
}

// Simulate participant actions
function simulateParticipantActions() {
    const containers = document.querySelectorAll('.video-container');
    
    // Simulate speaking animation
    setInterval(() => {
        containers.forEach(container => {
            if (Math.random() < 0.3 && !container.classList.contains('muted')) {
                container.classList.add('speaking');
                animateAudioVisualizer(container);
                
                setTimeout(() => {
                    container.classList.remove('speaking');
                }, 2000 + Math.random() * 3000);
            }
        });
    }, 5000);
    
    // Simulate random mute/unmute
    setInterval(() => {
        const randomContainer = containers[Math.floor(Math.random() * containers.length)];
        if (randomContainer && !randomContainer.dataset.participant.includes('You')) {
            if (Math.random() < 0.2) {
                muteParticipant(randomContainer);
            }
        }
    }, 15000);
    
    // Simulate camera toggle
    setInterval(() => {
        const randomContainer = containers[Math.floor(Math.random() * containers.length)];
        if (randomContainer && !randomContainer.dataset.participant.includes('You')) {
            if (Math.random() < 0.1) {
                toggleParticipantCamera(randomContainer);
            }
        }
    }, 20000);
    
    // Simulate network quality changes
    setInterval(() => {
        updateNetworkQuality();
    }, 10000);
    
    // Simulate reactions
    setInterval(() => {
        const randomContainer = containers[Math.floor(Math.random() * containers.length)];
        if (randomContainer && Math.random() < 0.15) {
            sendReaction(randomContainer);
        }
    }, 12000);
}

// Toggle participant camera
function toggleParticipantCamera(container) {
    const hasCamera = !container.classList.contains('camera-off');
    
    if (hasCamera) {
        container.classList.add('camera-off');
        
        // Remove video player
        const videoPlayer = container.querySelector('.video-player');
        if (videoPlayer) {
            videoPlayer.remove();
        }
        
        // Add avatar placeholder
        createAvatarPlaceholder(container, container.dataset.participant);
        showNotification('camera-off', container.dataset.participant, 'turned off their camera');
    } else {
        container.classList.remove('camera-off');
        
        // Remove avatar placeholder
        const avatarPlaceholder = container.querySelector('.avatar-placeholder');
        if (avatarPlaceholder) {
            avatarPlaceholder.remove();
        }
        
        // Add video player
        const videoPlayer = document.createElement('video');
        videoPlayer.className = 'video-player';
        videoPlayer.autoplay = true;
        videoPlayer.muted = true;
        videoPlayer.loop = true;
        
        const placeholders = [
            'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-smartphone-40973-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-man-with-a-smile-working-from-home-with-a-laptop-42913-large.mp4',
            'https://assets.mixkit.co/videos/preview/mixkit-woman-taking-selfies-in-the-street-1232-large.mp4'
        ];
        videoPlayer.src = placeholders[Math.floor(Math.random() * placeholders.length)];
        
        container.insertBefore(videoPlayer, container.firstChild);
        showNotification('camera-on', container.dataset.participant, 'turned on their camera');
    }
}

// Animate audio visualizer
function animateAudioVisualizer(container) {
    const visualizer = container.querySelector('.audio-visualizer');
    if (!visualizer) return;
    
    const bars = visualizer.querySelectorAll('.audio-bar');
    
    const animateFrame = () => {
        bars.forEach(bar => {
            const height = Math.random() * 30 + 5;
            bar.style.height = `${height}px`;
            bar.style.opacity = Math.random() * 0.5 + 0.5;
        });
    };
    
    const interval = setInterval(animateFrame, 100);
    
    // Stop animation when not speaking
    setTimeout(() => {
        clearInterval(interval);
        bars.forEach(bar => {
            bar.style.height = '5px';
            bar.style.opacity = '0.3';
        });
    }, 2000);
}

// Update network quality
function updateNetworkQuality() {
    const containers = document.querySelectorAll('.video-container');
    
    containers.forEach(container => {
        const networkQuality = container.querySelector('.network-quality');
        if (!networkQuality) return;
        
        const bars = networkQuality.querySelectorAll('.quality-bar');
        const quality = Math.floor(Math.random() * 4) + 1; // 1-4 bars
        
        // Reset all bars
        bars.forEach(bar => {
            bar.classList.remove('active');
        });
        
        // Set quality class
        networkQuality.classList.remove('quality-poor', 'quality-fair');
        if (quality <= 2) {
            networkQuality.classList.add('quality-poor');
        } else if (quality === 3) {
            networkQuality.classList.add('quality-fair');
        }
        
        // Activate bars based on quality
        for (let i = 0; i < quality; i++) {
            bars[i].classList.add('active');
        }
    });
}

// Update participant counter
function updateParticipantCounter() {
    const counter = document.querySelector('.participant-counter');
    const containers = document.querySelectorAll('.video-container:not(.left)');
    
    if (counter) {
        const count = containers.length;
        counter.textContent = `${count} Participant${count !== 1 ? 's' : ''}`;
    }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Prevent shortcuts when typing in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (event.key.toLowerCase()) {
        case 'm':
            event.preventDefault();
            toggleMute();
            break;
        case 'v':
            event.preventDefault();
            toggleVideo();
            break;
        case 's':
            event.preventDefault();
            toggleScreenShare();
            break;
        case 'escape':
            event.preventDefault();
            // Close any open menus
            document.querySelectorAll('.actions-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
            break;
        case ' ':
            event.preventDefault();
            // Push to talk functionality
            if (!event.repeat) {
                const muteBtn = document.querySelector('.btn-mute');
                if (muteBtn.classList.contains('muted')) {
                    toggleMute();
                    
                    // Auto-mute when space is released
                    const handleKeyUp = (e) => {
                        if (e.key === ' ') {
                            toggleMute();
                            document.removeEventListener('keyup', handleKeyUp);
                        }
                    };
                    document.addEventListener('keyup', handleKeyUp);
                }
            }
            break;
    }
}

// Handle window resize
function handleResize() {
    // Adjust video grid layout
    const videoStreams = document.getElementById('video-streams');
    if (!videoStreams) return;
    
    const containers = videoStreams.querySelectorAll('.video-container');
    const containerCount = containers.length;
    
    // Adjust grid columns based on container count and screen size
    if (window.innerWidth < 768) {
        videoStreams.style.gridTemplateColumns = '1fr';
    } else if (window.innerWidth < 1200) {
        const cols = Math.min(2, containerCount);
        videoStreams.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    } else {
        const cols = Math.min(3, containerCount);
        videoStreams.style.gridTemplateColumns = `repeat(auto-fit, minmax(400px, 1fr))`;
    }
}

// Handle visibility change
function handleVisibilityChange() {
    if (document.hidden) {
        // Pause video streams when tab is not visible
        document.querySelectorAll('.video-player').forEach(video => {
            video.pause();
        });
        
        // Show notification when returning
        document.addEventListener('visibilitychange', function onVisible() {
            if (!document.hidden) {
                document.querySelectorAll('.video-player').forEach(video => {
                    video.play();
                });
                showNotification('info', 'System', 'Welcome back! Video streams resumed.');
                document.removeEventListener('visibilitychange', onVisible);
            }
        });
    }
}

// Add participant with delay (for demo purposes)
function addParticipantWithDelay(name, withCamera, delay) {
    setTimeout(() => {
        addParticipant(name, withCamera);
        showNotification('join', name, 'joined the meeting');
        updateParticipantCounter();
    }, delay);
}

// Simulate someone leaving
function simulateParticipantLeaving() {
    const containers = document.querySelectorAll('.video-container:not([data-participant*="You"])');
    if (containers.length === 0) return;
    
    const randomContainer = containers[Math.floor(Math.random() * containers.length)];
    const participantName = randomContainer.dataset.participant;
    
    randomContainer.classList.add('left');
    
    // Create left overlay
    const leftOverlay = document.createElement('div');
    leftOverlay.className = 'left-overlay';
    leftOverlay.innerHTML = `
        <div class="left-message">
            <span class="left-icon">👋</span>
            ${participantName} left
        </div>
    `;
    
    randomContainer.appendChild(leftOverlay);
    
    showNotification('leave', participantName, 'left the meeting');
    
    // Remove container after animation
    setTimeout(() => {
        randomContainer.remove();
        updateParticipantCounter();
    }, 1000);
}

// Initialize chat functionality
function initializeChat() {
    const chatPanel = document.createElement('div');
    chatPanel.className = 'chat-panel';
    
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';
    chatHeader.innerHTML = `
        <span>Chat</span>
        <button onclick="this.parentElement.parentElement.style.display='none'">×</button>
    `;
    
    const chatMessages = document.createElement('div');
    chatMessages.className = 'chat-messages';
    
    const chatInput = document.createElement('div');
    chatInput.className = 'chat-input';
    chatInput.innerHTML = `
        <input type="text" placeholder="Type a message..." />
        <button onclick="sendChatMessage(this)">Send</button>
    `;
    
    chatPanel.appendChild(chatHeader);
    chatPanel.appendChild(chatMessages);
    chatPanel.appendChild(chatInput);
    
    document.body.appendChild(chatPanel);
}

// Send chat message
function sendChatMessage(button) {
    const input = button.previousElementSibling;
    const message = input.value.trim();
    
    if (message) {
        const chatMessages = document.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong>You:</strong> ${message}
                <div style="font-size: 0.75rem; color: #666; margin-top: 0.25rem;">
                    ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        input.value = '';
        
        // Simulate response
        setTimeout(() => {
            const responseElement = document.createElement('div');
            responseElement.innerHTML = `
                <div style="margin-bottom: 1rem;">
                    <strong>John Doe:</strong> Thanks for sharing!
                    <div style="font-size: 0.75rem; color: #666; margin-top: 0.25rem;">
                        ${new Date().toLocaleTimeString()}
                    </div>
                </div>
            `;
            chatMessages.appendChild(responseElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 2000);
    }
}

// Toggle chat panel
function toggleChat() {
    const chatPanel = document.querySelector('.chat-panel');
    if (chatPanel) {
        chatPanel.style.display = chatPanel.style.display === 'none' ? 'flex' : 'none';
    }
}

// Add recording functionality
function toggleRecording() {
    const recordBtn = document.querySelector('.btn-record');
    if (!recordBtn) return;
    
    const isRecording = recordBtn.classList.contains('recording');
    
    if (isRecording) {
        recordBtn.classList.remove('recording');
        recordBtn.innerHTML = '<span>⏺️</span> Record';
        showNotification('info', 'System', 'Recording stopped');
    } else {
        recordBtn.classList.add('recording');
        recordBtn.innerHTML = '<span>⏹️</span> Stop Recording';
        showNotification('info', 'System', 'Recording started');
    }
}

// Add whiteboard functionality
function toggleWhiteboard() {
    const whiteboardPanel = document.querySelector('.whiteboard-panel');
    if (whiteboardPanel) {
        whiteboardPanel.style.display = whiteboardPanel.style.display === 'none' ? 'block' : 'none';
    } else {
        createWhiteboardPanel();
    }
}

// Create whiteboard panel
function createWhiteboardPanel() {
    const whiteboardPanel = document.createElement('div');
    whiteboardPanel.className = 'whiteboard-panel';
    whiteboardPanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 70%;
        background: white;
        border-radius: 20px;
        box-shadow: var(--shadow-2xl);
        z-index: 1000;
        display: flex;
        flex-direction: column;
    `;
    
    whiteboardPanel.innerHTML = `
        <div style="padding: 1rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <h3>Whiteboard</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>
        <div style="flex: 1; background: #f8fafc; margin: 1rem; border-radius: 12px; position: relative;">
            <canvas width="800" height="600" style="width: 100%; height: 100%; cursor: crosshair;"></canvas>
        </div>
        <div style="padding: 1rem; display: flex; gap: 1rem; justify-content: center;">
            <button onclick="clearWhiteboard()">Clear</button>
            <button onclick="saveWhiteboard()">Save</button>
        </div>
    `;
    
    document.body.appendChild(whiteboardPanel);
    
    // Initialize canvas drawing
    initializeWhiteboardDrawing(whiteboardPanel.querySelector('canvas'));
}

// Initialize whiteboard drawing
function initializeWhiteboardDrawing(canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);
}

// Clear whiteboard
function clearWhiteboard() {
    const canvas = document.querySelector('.whiteboard-panel canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Save whiteboard
function saveWhiteboard() {
    const canvas = document.querySelector('.whiteboard-panel canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'whiteboard.png';
        link.href = canvas.toDataURL();
        link.click();
    }
}

// Initialize tooltips
function initializeTooltips() {
    const buttons = document.querySelectorAll('button[title]');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.title;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.875rem;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            
            e.target._tooltip = tooltip;
        });
        
        button.addEventListener('mouseleave', (e) => {
            if (e.target._tooltip) {
                e.target._tooltip.remove();
                delete e.target._tooltip;
            }
        });
    });
}

// Performance monitoring
function monitorPerformance() {
    setInterval(() => {
        const videoElements = document.querySelectorAll('video');
        let totalFrames = 0;
        
        videoElements.forEach(video => {
            if (video.getVideoPlaybackQuality) {
                const quality = video.getVideoPlaybackQuality();
                totalFrames += quality.totalVideoFrames;
            }
        });
        
        // Update connection status based on performance
        const connectionStatus = document.querySelector('.connection-status');
        if (connectionStatus) {
            const indicator = connectionStatus.querySelector('.connection-indicator');
            const text = connectionStatus.querySelector('span');
            
            if (totalFrames > 1000) {
                indicator.className = 'connection-indicator';
                text.textContent = 'Excellent Connection';
            } else if (totalFrames > 500) {
                indicator.className = 'connection-indicator good';
                text.textContent = 'Good Connection';
            } else {
                indicator.className = 'connection-indicator poor';
                text.textContent = 'Poor Connection';
            }
        }
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat
    initializeChat();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Start performance monitoring
    monitorPerformance();
    
    // Simulate participants leaving occasionally
    setInterval(() => {
        if (Math.random() < 0.1) {
            simulateParticipantLeaving();
        }
    }, 30000);
    
    // Add keyboard shortcut hints
    showNotification('info', 'System', 'Keyboard shortcuts: M (mute), V (video), S (screen share), Space (push to talk)');
});

// Export functions for global access
window.toggleChat = toggleChat;
window.toggleRecording = toggleRecording;
window.toggleWhiteboard = toggleWhiteboard;
window.sendChatMessage = sendChatMessage;
window.clearWhiteboard = clearWhiteboard;
window.saveWhiteboard = saveWhiteboard;




class EnhancedChat {
    constructor() {
        this.messages = [];
        this.participants = ['You', 'John Doe', 'Sarah Smith', 'Mike Johnson', 'Emily Davis'];
        this.typingUsers = new Set();
        this.isEmojiPickerOpen = false;
        this.searchTerm = '';
        
        this.init();
    }
    
    init() {
        this.createChatPanel();
        this.setupEventListeners();
        this.loadSampleMessages();
        this.startTypingSimulation();
    }
    
    createChatPanel() {
        // Remove existing chat panel
        const existingPanel = document.querySelector('.chat-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        const chatPanel = document.createElement('div');
        chatPanel.className = 'chat-panel';
        chatPanel.innerHTML = `
            <div class="chat-header">
                <div>
                    <div class="chat-title">Team Chat</div>
                    <div class="chat-participants">${this.participants.length} participants</div>
                </div>
                <button class="chat-close-btn" onclick="toggleChat()">×</button>
            </div>
            
            <div class="chat-search">
                <input type="text" class="search-input" placeholder="Search messages..." />
            </div>
            
            <div class="chat-messages" id="chat-messages">
                <!-- Messages will be inserted here -->
            </div>
            
            <div class="typing-indicator" id="typing-indicator">
                <div class="typing-bubble">
                    <span class="typing-user"></span>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
            
            <div class="chat-input-container">
                <div class="file-upload-area" id="file-upload-area">
                    <div class="file-upload-icon">📁</div>
                    <div class="file-upload-text">Drop files here to share</div>
                </div>
                
                <div class="chat-input-wrapper">
                    <textarea class="chat-input" id="chat-input" placeholder="Type a message..." rows="1"></textarea>
                    
                    <div class="chat-actions">
                        <button class="chat-action-btn" id="emoji-btn" title="Add emoji">😊</button>
                        <button class="chat-action-btn" id="file-btn" title="Attach file">📎</button>
                        <button class="chat-action-btn chat-send-btn" id="send-btn" title="Send message" disabled>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="emoji-picker" id="emoji-picker">
                        <!-- Emoji options will be inserted here -->
                    </div>
                </div>
                
                <input type="file" id="file-input" style="display: none;" multiple accept="image/*,.pdf,.doc,.docx,.txt">
            </div>
        `;
        
        document.body.appendChild(chatPanel);
        this.createEmojiPicker();
    }
    
    createEmojiPicker() {
        const emojiPicker = document.getElementById('emoji-picker');
        const emojis = [
            '😊', '😂', '❤️', '👍', '👎', '😮',
            '😢', '😡', '🎉', '👏', '🔥', '💯',
            '😍', '🤔', '😴', '🙄', '😎', '🤗',
            '😱', '🤯', '🥳', '😇', '🤪', '🤩'
        ];
        
        emojis.forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'emoji-option';
            button.textContent = emoji;
            button.onclick = () => this.insertEmoji(emoji);
            emojiPicker.appendChild(button);
        });
    }
    
    setupEventListeners() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const emojiBtn = document.getElementById('emoji-btn');
        const fileBtn = document.getElementById('file-btn');
        const fileInput = document.getElementById('file-input');
        const searchInput = document.querySelector('.search-input');
        const fileUploadArea = document.getElementById('file-upload-area');
        
        // Auto-resize textarea
        chatInput.addEventListener('input', (e) => {
            this.autoResizeTextarea(e.target);
            this.toggleSendButton();
            this.handleTyping();
        });
        
        // Send message on Enter (but not Shift+Enter)
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Send button click
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Emoji picker toggle
        emojiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleEmojiPicker();
        });
        
        // File upload
        fileBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Search functionality
        searchInput.addEventListener('input', (e) => this.searchMessages(e.target.value));
        
        // Drag and drop file upload
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.isChatOpen()) {
                fileUploadArea.classList.add('show');
            }
        });
        
        document.addEventListener('dragleave', (e) => {
            if (!e.relatedTarget || !fileUploadArea.contains(e.relatedTarget)) {
                fileUploadArea.classList.remove('show');
            }
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('show');
            
            if (this.isChatOpen() && e.dataTransfer.files.length > 0) {
                this.handleFileUpload({ target: { files: e.dataTransfer.files } });
            }
        });
        
        // Close emoji picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.emoji-picker') && !e.target.closest('#emoji-btn')) {
                this.closeEmojiPicker();
            }
        });
        
        // Message reactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.message-bubble')) {
                this.showReactionMenu(e);
            }
        });
    }
    
    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    }
    
    toggleSendButton() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const hasContent = chatInput.value.trim().length > 0;
        
        sendBtn.disabled = !hasContent;
        sendBtn.style.opacity = hasContent ? '1' : '0.5';
    }
    
    handleTyping() {
        // Simulate typing indicator for other users
        if (Math.random() < 0.1) {
            this.showTypingIndicator('John Doe');
        }
    }
    
    showTypingIndicator(username) {
        this.typingUsers.add(username);
        const indicator = document.getElementById('typing-indicator');
        const userSpan = indicator.querySelector('.typing-user');
        
        if (this.typingUsers.size === 1) {
            userSpan.textContent = `${username} is typing`;
        } else {
            userSpan.textContent = `${this.typingUsers.size} people are typing`;
        }
        
        indicator.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            this.typingUsers.delete(username);
            if (this.typingUsers.size === 0) {
                indicator.classList.remove('show');
            }
        }, 3000);
    }
    
    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const content = chatInput.value.trim();
        
        if (!content) return;
        
        const message = {
            id: Date.now(),
            sender: 'You',
            content: content,
            timestamp: new Date(),
            reactions: {},
            isOwn: true
        };
        
        this.addMessage(message);
        chatInput.value = '';
        this.autoResizeTextarea(chatInput);
        this.toggleSendButton();
        
        // Simulate response
        setTimeout(() => {
            this.simulateResponse();
        }, 1000 + Math.random() * 2000);
    }
    
    addMessage(message) {
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }
    
    renderMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.isOwn ? 'own' : ''}`;
        messageElement.dataset.messageId = message.id;
        
        const timeString = message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageElement.innerHTML = `
            ${!message.isOwn ? `<div class="message-sender">${message.sender}</div>` : ''}
            <div class="message-bubble">
                <div class="message-content">${this.formatMessageContent(message.content)}</div>
                <div class="message-time">${timeString}</div>
            </div>
            ${this.renderReactions(message.reactions)}
        `;
        
        // Add file attachments if any
        if (message.files) {
            message.files.forEach(file => {
                messageElement.appendChild(this.createFileElement(file));
            });
        }
        
        messagesContainer.appendChild(messageElement);
    }
    
    formatMessageContent(content) {
        // Convert URLs to links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        content = content.replace(urlRegex, '<a href="$1" target="_blank" style="color: inherit; text-decoration: underline;">$1</a>');
        
        // Convert line breaks
        content = content.replace(/\n/g, '<br>');
        
        return content;
    }
    
    renderReactions(reactions) {
        if (!reactions || Object.keys(reactions).length === 0) {
            return '<div class="message-reactions"></div>';
        }
        
        const reactionsHtml = Object.entries(reactions)
            .map(([emoji, count]) => `
                <div class="reaction" data-emoji="${emoji}">
                    <span class="reaction-emoji">${emoji}</span>
                    <span class="reaction-count">${count}</span>
                </div>
            `)
            .join('');
        
        return `<div class="message-reactions">${reactionsHtml}</div>`;
    }
    
    createFileElement(file) {
        const fileElement = document.createElement('div');
        
        if (file.type.startsWith('image/')) {
            fileElement.innerHTML = `
                <img src="${file.url}" alt="${file.name}" class="message-image" onclick="this.requestFullscreen()">
            `;
        } else {
            const fileIcon = this.getFileIcon(file.type);
            fileElement.innerHTML = `
                <div class="message-file" onclick="window.open('${file.url}', '_blank')">
                    <div class="file-icon">${fileIcon}</div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${this.formatFileSize(file.size)}</div>
                    </div>
                </div>
            `;
        }
        
        return fileElement;
    }
    
    getFileIcon(fileType) {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word') || fileType.includes('doc')) return '📝';
        if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📈';
        if (fileType.includes('zip') || fileType.includes('rar')) return '🗜️';
        if (fileType.includes('audio')) return '🎵';
        if (fileType.includes('video')) return '🎬';
        return '📎';
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    handleFileUpload(event) {
        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            const fileUrl = URL.createObjectURL(file);
            const message = {
                id: Date.now() + Math.random(),
                sender: 'You',
                content: `Shared ${file.name}`,
                timestamp: new Date(),
                reactions: {},
                isOwn: true,
                files: [{
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    url: fileUrl
                }]
            };
            
            this.addMessage(message);
        });
        
        // Clear file input
        event.target.value = '';
    }
    
    toggleEmojiPicker() {
        const emojiPicker = document.getElementById('emoji-picker');
        this.isEmojiPickerOpen = !this.isEmojiPickerOpen;
        
        if (this.isEmojiPickerOpen) {
            emojiPicker.classList.add('show');
        } else {
            emojiPicker.classList.remove('show');
        }
    }
    
    closeEmojiPicker() {
        const emojiPicker = document.getElementById('emoji-picker');
        emojiPicker.classList.remove('show');
        this.isEmojiPickerOpen = false;
    }
    
    insertEmoji(emoji) {
        const chatInput = document.getElementById('chat-input');
        const cursorPos = chatInput.selectionStart;
        const textBefore = chatInput.value.substring(0, cursorPos);
        const textAfter = chatInput.value.substring(cursorPos);
        
        chatInput.value = textBefore + emoji + textAfter;
        chatInput.focus();
        chatInput.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
        
        this.autoResizeTextarea(chatInput);
        this.toggleSendButton();
        this.closeEmojiPicker();
    }
    
    showReactionMenu(event) {
        event.preventDefault();
        
        const messageElement = event.target.closest('.message');
        const messageId = messageElement.dataset.messageId;
        
        // Create quick reaction menu
        const reactionMenu = document.createElement('div');
        reactionMenu.className = 'reaction-menu';
        reactionMenu.style.cssText = `
            position: fixed;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            display: flex;
            gap: 0.25rem;
            z-index: 1000;
            animation: popIn 0.2s ease-out;
        `;
        
        const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
        quickReactions.forEach(emoji => {
            const btn = document.createElement('button');
            btn.textContent = emoji;
            btn.style.cssText = `
                border: none;
                background: transparent;
                font-size: 1.25rem;
                padding: 0.5rem;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s;
            `;
            btn.onmouseover = () => btn.style.background = '#f1f5f9';
            btn.onmouseout = () => btn.style.background = 'transparent';
            btn.onclick = () => {
                this.addReaction(messageId, emoji);
                reactionMenu.remove();
            };
            reactionMenu.appendChild(btn);
        });
        
        // Position menu
        const rect = event.target.getBoundingClientRect();
        reactionMenu.style.left = `${rect.left}px`;
        reactionMenu.style.top = `${rect.top - 60}px`;
        
        document.body.appendChild(reactionMenu);
        
        // Remove menu after 5 seconds or on click outside
        setTimeout(() => reactionMenu.remove(), 5000);
        document.addEventListener('click', function removeMenu(e) {
            if (!reactionMenu.contains(e.target)) {
                reactionMenu.remove();
                document.removeEventListener('click', removeMenu);
            }
        });
    }
    
    addReaction(messageId, emoji) {
        const message = this.messages.find(m => m.id == messageId);
        if (!message) return;
        
        if (!message.reactions) message.reactions = {};
        message.reactions[emoji] = (message.reactions[emoji] || 0) + 1;
        
        // Update UI
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        const reactionsContainer = messageElement.querySelector('.message-reactions');
        reactionsContainer.innerHTML = this.renderReactions(message.reactions).replace('<div class="message-reactions">', '').replace('</div>', '');
    }
    
    searchMessages(term) {
        this.searchTerm = term.toLowerCase();
        const messages = document.querySelectorAll('.message');
        
        messages.forEach(message => {
            const content = message.querySelector('.message-content').textContent.toLowerCase();
            const sender = message.querySelector('.message-sender')?.textContent.toLowerCase() || '';
            
            if (content.includes(this.searchTerm) || sender.includes(this.searchTerm)) {
                message.classList.add('highlighted');
                message.style.display = 'block';
            } else {
                message.classList.remove('highlighted');
                message.style.display = this.searchTerm ? 'none' : 'block';
            }
        });
    }
    
    simulateResponse() {
        const responses = [
            "That's a great point!",
            "I agree with that approach.",
            "Thanks for sharing!",
            "Let me think about that...",
            "Sounds good to me!",
            "I have a different perspective on this.",
            "Can you elaborate on that?",
            "Perfect! Let's move forward with this.",
            "I'll get back to you on this.",
            "Great work everyone! 👏"
        ];
        
        const randomSender = this.participants[Math.floor(Math.random() * (this.participants.length - 1)) + 1];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const message = {
            id: Date.now(),
            sender: randomSender,
            content: randomResponse,
            timestamp: new Date(),
            reactions: {},
            isOwn: false
        };
        
        this.addMessage(message);
    }
    
    loadSampleMessages() {
        const sampleMessages = [
            { sender: 'John Doe', content: 'Hey everyone! Ready for today\'s standup?', isOwn: false },
            { sender: 'Sarah Smith', content: 'Yes! I have some updates to share.', isOwn: false },
            { sender: 'You', content: 'Perfect! Let\'s get started.', isOwn: true },
            { sender: 'Mike Johnson', content: 'I finished the user authentication feature yesterday.', isOwn: false },
            { sender: 'Emily Davis', content: 'Great work Mike! 🎉', isOwn: false, reactions: { '👍': 3, '🎉': 2 } }
        ];
        
        sampleMessages.forEach((msg, index) => {
            setTimeout(() => {
                const message = {
                    id: Date.now() + index,
                    sender: msg.sender,
                    content: msg.content,
                    timestamp: new Date(Date.now() - (sampleMessages.length - index) * 60000),
                    reactions: msg.reactions || {},
                    isOwn: msg.isOwn
                };
                this.addMessage(message);
            }, index * 500);
        });
    }
    
    startTypingSimulation() {
        setInterval(() => {
            if (Math.random() < 0.1) {
                const randomUser = this.participants[Math.floor(Math.random() * (this.participants.length - 1)) + 1];
                this.showTypingIndicator(randomUser);
            }
        }, 10000);
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    isChatOpen() {
        const chatPanel = document.querySelector('.chat-panel');
        return chatPanel && chatPanel.classList.contains('show');
    }
}

// Initialize enhanced chat
let enhancedChat;

// Enhanced toggle function
function toggleChat() {
    const chatPanel = document.querySelector('.chat-panel');
    
    if (!enhancedChat) {
        enhancedChat = new EnhancedChat();
    }
    
    if (chatPanel.classList.contains('show')) {
        chatPanel.classList.remove('show');
        setTimeout(() => {
            chatPanel.style.display = 'none';
        }, 400);
    } else {
        chatPanel.style.display = 'flex';
        setTimeout(() => {
            chatPanel.classList.add('show');
        }, 10);
    }
}

// Add chat button to controls if it doesn't exist
document.addEventListener('DOMContentLoaded', function() {
    const streamControls = document.getElementById('stream-controls');
    if (streamControls && !document.querySelector('.btn-chat')) {
        const chatBtn = document.createElement('button');
        chatBtn.className = 'btn-chat';
        chatBtn.innerHTML = '<span>💬</span> Chat';
        chatBtn.addEventListener('click', toggleChat);
        streamControls.appendChild(chatBtn);
    }
});

// Export for global access
window.toggleChat = toggleChat;
window.EnhancedChat = EnhancedChat;