// Enhanced Video Display Fix Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Video display fix script loaded');
    
    // Find the video container and video element
    const videoContainer = document.getElementById('video-section');
    const video = videoContainer ? videoContainer.querySelector('video') : null;
    const playOverlay = document.getElementById('video-play-overlay');
    
    if (!videoContainer || !video) {
        console.error('Video elements not found');
        return;
    }
    
    console.log('Video elements found, applying fixes');
    
    // Force video container to be visible
    function forceVideoVisibility() {
        // Container visibility
        videoContainer.style.display = 'block';
        videoContainer.style.visibility = 'visible';
        videoContainer.style.opacity = '1';
        videoContainer.style.position = 'relative';
        videoContainer.style.zIndex = '20';
        videoContainer.style.width = '100%';
        videoContainer.style.maxWidth = '28rem'; // max-w-md
        videoContainer.style.marginBottom = '1.5rem';
        videoContainer.style.overflow = 'hidden';
        videoContainer.style.borderRadius = '0.5rem';
        videoContainer.style.aspectRatio = '16/9';
        videoContainer.style.minHeight = '200px';
        
        // Video element visibility
        video.style.display = 'block';
        video.style.visibility = 'visible';
        video.style.opacity = '1';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.position = 'relative';
        video.style.zIndex = '10';
        
        // Remove any hidden classes
        video.classList.remove('hidden');
        videoContainer.classList.remove('hidden');
        
        console.log('Video visibility forced');
    }
    
    // Apply fixes immediately
    forceVideoVisibility();
    
    // Handle video loading states
    video.addEventListener('loadstart', function() {
        console.log('Video loading started');
        forceVideoVisibility();
    });
    
    video.addEventListener('loadedmetadata', function() {
        console.log('Video metadata loaded');
        forceVideoVisibility();
        
        // Set proper aspect ratio based on video dimensions
        if (video.videoWidth && video.videoHeight) {
            const aspectRatio = video.videoWidth / video.videoHeight;
            videoContainer.style.aspectRatio = aspectRatio.toString();
        }
    });
    
    video.addEventListener('canplay', function() {
        console.log('Video can play');
        forceVideoVisibility();
    });
    
    // Handle play overlay interaction
    if (playOverlay) {
        playOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Play overlay clicked');
            
            // Try to play the video
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Video started playing');
                    playOverlay.style.display = 'none';
                }).catch(error => {
                    console.log('Autoplay prevented:', error);
                    // Hide overlay anyway and show controls
                    playOverlay.style.display = 'none';
                    video.controls = true;
                });
            }
        });
    }
    
    // Hide overlay when video plays
    video.addEventListener('play', function() {
        if (playOverlay) {
            playOverlay.style.display = 'none';
        }
    });
    
    // Show overlay when video is reset to beginning
    video.addEventListener('pause', function() {
        if (playOverlay && video.currentTime === 0) {
            playOverlay.style.display = 'flex';
        }
    });
    
    // Handle video errors
    video.addEventListener('error', function(e) {
        console.error('Video error:', e);
        
        if (playOverlay) {
            playOverlay.innerHTML = `
                <div class="text-center text-white p-4">
                    <div class="w-16 h-16 mx-auto mb-4 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p class="text-sm font-medium">Video could not be loaded</p>
                    <p class="text-xs opacity-75 mt-1">Please check your connection and try again</p>
                </div>
            `;
        }
    });
    
    // Mobile-specific fixes
    function applyMobileFixes() {
        if (window.innerWidth <= 768) {
            console.log('Applying mobile video fixes');
            
            // Ensure video is visible on mobile
            videoContainer.style.margin = '0 auto 1.5rem auto';
            videoContainer.style.display = 'block';
            videoContainer.style.position = 'relative';
            videoContainer.style.zIndex = '25';
            
            // Force video to be visible
            video.style.display = 'block';
            video.style.visibility = 'visible';
            video.style.opacity = '1';
            video.style.position = 'relative';
            video.style.zIndex = '20';
        }
    }
    
    // Apply mobile fixes on load and resize
    applyMobileFixes();
    window.addEventListener('resize', applyMobileFixes);
    
    // Force visibility check every 2 seconds for the first 10 seconds
    let visibilityCheckCount = 0;
    const visibilityInterval = setInterval(() => {
        visibilityCheckCount++;
        
        if (visibilityCheckCount >= 5) {
            clearInterval(visibilityInterval);
            return;
        }
        
        // Check if video is still visible
        const computedStyle = window.getComputedStyle(video);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
            console.log('Video visibility lost, reapplying fixes');
            forceVideoVisibility();
        }
    }, 2000);
    
    console.log('Video display fix script setup complete');
});
