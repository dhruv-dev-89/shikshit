// Video playback enhancement script
document.addEventListener('DOMContentLoaded', function() {
    // Find all video elements in video containers
    const videos = document.querySelectorAll('.video-container video');
    
    // Apply enhancements to each video
    videos.forEach(video => {
        // Make sure video fills container properly
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        
        // Add event listeners for better user experience
        video.addEventListener('loadedmetadata', function() {
            // Once metadata is loaded, ensure video is visible
            video.style.opacity = '1';
            
            // Force video to take full size of container
            const container = video.closest('.video-container');
            if (container) {
                // Ensure container has proper dimensions
                if (!container.style.width) {
                    container.style.width = '100%';
                }
                
                // Set aspect ratio if not already set
                if (!container.style.aspectRatio) {
                    container.style.aspectRatio = '16/9';
                }
            }
        });
        
        // Handle errors
        video.addEventListener('error', function(e) {
            console.error('Video error:', e);
            
            // Show fallback content
            const container = video.closest('.video-container');
            if (container) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full bg-purple-800 text-white p-4 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p class="text-center">Video could not be loaded. Please try again later.</p>
                    </div>
                `;
            }
        });
        
        // Try to force play on mobile devices
        video.addEventListener('canplaythrough', function() {
            // Try to play the video
            const playPromise = video.play();
            
            // Handle autoplay restrictions
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Autoplay prevented:', error);
                    
                    // Add play button overlay for user interaction
                    const container = video.closest('.video-container');
                    if (container && !container.querySelector('.play-button-overlay')) {
                        const overlay = document.createElement('div');
                        overlay.className = 'play-button-overlay';
                        overlay.innerHTML = `
                            <button class="play-button">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="white">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        `;
                        
                        // Style the overlay
                        overlay.style.position = 'absolute';
                        overlay.style.top = '0';
                        overlay.style.left = '0';
                        overlay.style.width = '100%';
                        overlay.style.height = '100%';
                        overlay.style.display = 'flex';
                        overlay.style.alignItems = 'center';
                        overlay.style.justifyContent = 'center';
                        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                        overlay.style.zIndex = '2';
                        overlay.style.cursor = 'pointer';
                        
                        // Add click event to play video
                        overlay.addEventListener('click', function() {
                            video.play();
                            overlay.remove();
                        });
                        
                        container.appendChild(overlay);
                    }
                });
            }
        });
    });
});
