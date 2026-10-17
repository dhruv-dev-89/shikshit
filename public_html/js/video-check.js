// Video loading check script
document.addEventListener('DOMContentLoaded', function() {
    console.log("Video check script loaded");
    
    // Find all video elements
    const videos = document.querySelectorAll('video');
    
    // Log how many videos were found
    console.log(`Found ${videos.length} video elements`);
    
    // Check each video
    videos.forEach((video, index) => {
        console.log(`Checking video ${index + 1}:`);
        console.log(`- Source: ${video.src}`);
        console.log(`- Ready state: ${video.readyState}`);
        console.log(`- Network state: ${video.networkState}`);
        console.log(`- Paused: ${video.paused}`);
        console.log(`- Controls: ${video.controls}`);
        console.log(`- Autoplay: ${video.autoplay}`);
        console.log(`- Muted: ${video.muted}`);
        
        // Add event listeners to track video status
        video.addEventListener('loadstart', () => {
            console.log(`Video ${index + 1}: Load started`);
        });
        
        video.addEventListener('loadeddata', () => {
            console.log(`Video ${index + 1}: Data loaded`);
        });
        
        video.addEventListener('canplay', () => {
            console.log(`Video ${index + 1}: Can play`);
            // Try to play the video automatically
            try {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log(`Video ${index + 1}: Playing automatically`);
                    }).catch(error => {
                        console.log(`Video ${index + 1}: Autoplay prevented - ${error}`);
                        // If autoplay is prevented, make sure controls are visible
                        video.controls = true;
                    });
                }
            } catch (error) {
                console.error(`Video ${index + 1}: Error playing - ${error}`);
                // If there's an error, make sure controls are visible
                video.controls = true;
            }
        });
        
        video.addEventListener('playing', () => {
            console.log(`Video ${index + 1}: Playing`);
        });
        
        video.addEventListener('pause', () => {
            console.log(`Video ${index + 1}: Paused`);
        });
        
        video.addEventListener('error', (e) => {
            console.error(`Video ${index + 1}: Error - ${video.error ? video.error.message : 'Unknown error'}`);
            console.error(`Video ${index + 1}: Error code - ${video.error ? video.error.code : 'Unknown'}`);
            
            // Show error message in the video container
            const container = video.closest('.video-container');
            if (container) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full bg-purple-800 text-white p-4 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-center">Video could not be loaded. Please try again later.</p>
                        <p class="text-center text-sm mt-2">Error: ${video.error ? video.error.message : 'Unknown error'}</p>
                    </div>
                `;
            }
        });
        
        // Check if video source exists
        fetch(video.src)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log(`Video ${index + 1}: Source exists and is accessible`);
            })
            .catch(error => {
                console.error(`Video ${index + 1}: Source error - ${error}`);
                
                // Show error message in the video container
                const container = video.closest('.video-container');
                if (container) {
                    container.innerHTML = `
                        <div class="flex flex-col items-center justify-center h-full bg-purple-800 text-white p-4 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-center">Video source not found. Please check the file path.</p>
                            <p class="text-center text-sm mt-2">Path: ${video.src}</p>
                        </div>
                    `;
                }
            });
    });
});
