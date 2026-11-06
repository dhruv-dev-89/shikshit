/**
 * Shikshit Custom Video Player & Auto-Scroll Carousel Engine
 * Replaces buggy native browser controls with branded, fluid, 100% responsive controls
 */
(function() {
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function initVideoCard(card, onPlayStateChange) {
    if (!card || card.dataset.playerInitialized) return;

    const video = card.querySelector('video') || (card.tagName === 'VIDEO' ? card : null);
    if (!video) return;

    // Determine the container to attach controls to
    // If the card has a .video-aspect-frame, that inner frame holds the video
    const container = card.querySelector('.video-aspect-frame') || (card.classList.contains('video-aspect-frame') ? card : card);
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    card.dataset.playerInitialized = 'true';
    container.dataset.playerInitialized = 'true';

    // Remove native controls
    video.removeAttribute('controls');
    video.playsInline = true;
    // Keep every Shikshit video looping, including carousel clones and
    // standalone videos initialized through the shared player.
    video.loop = true;
    if (!video.preload) video.preload = 'metadata';

    if (video.readyState === 0) {
      try { video.load(); } catch (err) {}
    }

    // 1. Create Click Overlay across video
    let clickOverlay = container.querySelector('.video-click-overlay');
    if (!clickOverlay) {
      clickOverlay = document.createElement('div');
      clickOverlay.className = 'video-click-overlay';
      clickOverlay.setAttribute('aria-label', 'Toggle Video Playback');
      container.appendChild(clickOverlay);
    }

    // 2. Create Bottom Controls Bar
    let controlsBar = container.querySelector('.custom-video-controls');
    if (!controlsBar) {
      controlsBar = document.createElement('div');
      controlsBar.className = 'custom-video-controls';
      controlsBar.setAttribute('role', 'toolbar');
      controlsBar.setAttribute('aria-label', 'Video Controls');
      controlsBar.innerHTML = `
        <button class="custom-ctrl-btn ctrl-play-toggle" aria-label="Play/Pause" type="button">
          <svg class="icon-play" viewBox="0 0 24 24" width="18" height="18" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg class="icon-pause" viewBox="0 0 24 24" width="18" height="18" fill="white">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
        <div class="custom-progress-container" role="slider" aria-label="Seek video">
          <div class="custom-progress-track">
            <div class="custom-progress-fill"></div>
            <div class="custom-progress-thumb"></div>
          </div>
        </div>
        <button class="custom-ctrl-btn ctrl-mute-toggle" aria-label="Mute/Unmute" type="button">
          <svg class="icon-vol-on" viewBox="0 0 24 24" width="18" height="18" fill="white">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          <svg class="icon-vol-muted" viewBox="0 0 24 24" width="18" height="18" fill="white">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        </button>
        <button class="custom-ctrl-btn ctrl-fullscreen" aria-label="Fullscreen" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
        </button>
      `;
      container.appendChild(controlsBar);
    }

    const playToggleBtn = controlsBar.querySelector('.ctrl-play-toggle');
    const muteToggleBtn = controlsBar.querySelector('.ctrl-mute-toggle');
    const fullscreenBtn = controlsBar.querySelector('.ctrl-fullscreen');
    const progressContainer = controlsBar.querySelector('.custom-progress-container');
    const progressTrack = controlsBar.querySelector('.custom-progress-track');
    const progressFill = controlsBar.querySelector('.custom-progress-fill');

    function syncClasses(cls, add) {
      if (add) {
        card.classList.add(cls);
        container.classList.add(cls);
      } else {
        card.classList.remove(cls);
        container.classList.remove(cls);
      }
    }

    // Play / Pause Toggle
    function togglePlay(e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (video.paused || video.ended) {
        // Pause all other videos
        document.querySelectorAll('video').forEach(function(v) {
          if (v !== video && !v.paused) v.pause();
        });
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(function(err) {
            console.warn('Playback error / blocked:', err);
          });
        }
      } else {
        video.pause();
      }
    }

    clickOverlay.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    playToggleBtn.addEventListener('click', togglePlay);

    // Mute Toggle
    muteToggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      video.muted = !video.muted;
      syncClasses('is-muted', video.muted);
    });

    // Fullscreen Toggle
    fullscreenBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!document.fullscreenElement) {
        const target = container.requestFullscreen ? container : (card.requestFullscreen ? card : video);
        if (target.requestFullscreen) target.requestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });

    // Progress seeking
    let isSeeking = false;
    function seekTo(e) {
      const rect = progressTrack.getBoundingClientRect();
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      progressFill.style.width = (ratio * 100) + '%';
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        video.currentTime = ratio * video.duration;
      }
    }

    progressContainer.addEventListener('mousedown', function(e) {
      e.stopPropagation();
      isSeeking = true;
      seekTo(e);
      function onMove(me) { if (isSeeking) seekTo(me); }
      function onUp() {
        isSeeking = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      }
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });

    progressContainer.addEventListener('touchstart', function(e) {
      e.stopPropagation();
      isSeeking = true;
      seekTo(e);
      function onTouchMove(te) { if (isSeeking) seekTo(te); }
      function onTouchEnd() {
        isSeeking = false;
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
      }
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
    }, { passive: true });

    // Video events
    video.addEventListener('timeupdate', function() {
      if (!isSeeking && video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        const percent = (video.currentTime / video.duration) * 100;
        progressFill.style.width = percent + '%';
      }
    });

    // Hide controls on inactivity
    let hideTimer = null;
    function resetHideTimer() {
      syncClasses('hide-controls', false);
      clearTimeout(hideTimer);
      if (!video.paused && !video.ended) {
        hideTimer = setTimeout(function() {
          syncClasses('hide-controls', true);
        }, 2500);
      }
    }

    card.addEventListener('mousemove', resetHideTimer);
    card.addEventListener('mouseenter', resetHideTimer);
    card.addEventListener('pointerenter', function(event) {
      if (event.pointerType === 'touch') return;

      // Hover previews play with sound. Browsers may reject audible autoplay
      // until the visitor has interacted with the page, so leave the video
      // paused if that happens instead of unexpectedly starting it muted.
      document.querySelectorAll('video').forEach(function(otherVideo) {
        if (otherVideo !== video && !otherVideo.paused) otherVideo.pause();
      });
      video.muted = false;
      syncClasses('is-muted', false);
      if (video.ended) video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function() {});
      }
    });
    card.addEventListener('pointerleave', function(event) {
      if (event.pointerType !== 'touch' && !video.paused) video.pause();
    });
    card.addEventListener('mouseleave', function() {
      if (!video.paused && !video.ended) {
        syncClasses('hide-controls', true);
      }
    });

    video.addEventListener('play', function() {
      syncClasses('is-playing', true);
      resetHideTimer();
      if (typeof onPlayStateChange === 'function') onPlayStateChange(true);
    });

    video.addEventListener('pause', function() {
      syncClasses('is-playing', false);
      syncClasses('hide-controls', false);
      clearTimeout(hideTimer);
      if (typeof onPlayStateChange === 'function') onPlayStateChange(false);
    });

    video.addEventListener('ended', function() {
      syncClasses('is-playing', false);
      syncClasses('hide-controls', false);
      clearTimeout(hideTimer);
      progressFill.style.width = '0%';
      if (typeof onPlayStateChange === 'function') onPlayStateChange(false);
    });

    if (video.muted) {
      syncClasses('is-muted', true);
    }
  }

  // Carousel Marquee Setup
  function initCarousel(track, speedPxPerSec) {
    if (!track) return;
    speedPxPerSec = speedPxPerSec || 35;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) speedPxPerSec = Math.min(speedPxPerSec, 18);

    // Clone items once to create seamless infinite loop
    const originalItems = Array.from(track.querySelectorAll('.video-item'));
    if (originalItems.length && !track.dataset.cloned) {
      track.dataset.cloned = 'true';
      originalItems.forEach(function(item) {
        const clone = item.cloneNode(true);
        delete clone.dataset.playerInitialized;
        track.appendChild(clone);
      });
    }

    let isPaused = false;
    let isVisible = false;
    let rafId = null;
    let lastTime = performance.now();
    let scrollPos = track.scrollLeft;

    function getLoopDistance() {
      const allItems = track.querySelectorAll('.video-item');
      if (allItems.length >= 2 * originalItems.length && originalItems.length > 0) {
        const firstClone = allItems[originalItems.length];
        const firstOrig = allItems[0];
        const dist = firstClone.offsetLeft - firstOrig.offsetLeft;
        if (dist > 0) return dist;
      }
      return track.scrollWidth / 2;
    }

    function step(currentTime) {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (!isPaused && isVisible) {
        scrollPos += speedPxPerSec * delta;
        const loopDist = getLoopDistance();
        if (loopDist > 0 && scrollPos >= loopDist) {
          scrollPos -= loopDist;
        }
        track.scrollLeft = scrollPos;
      }

      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (!rafId) {
        lastTime = performance.now();
        scrollPos = track.scrollLeft;
        rafId = requestAnimationFrame(step);
      }
    }

    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function pauseScroll() {
      isPaused = true;
    }

    function resumeScroll() {
      const anyPlaying = Array.from(track.querySelectorAll('video')).some(function(v) {
        return !v.paused && !v.ended;
      });
      if (!anyPlaying) {
        isPaused = false;
        lastTime = performance.now();
        scrollPos = track.scrollLeft;
      }
    }

    // Initialize all video cards in track (original + clones)
    track.querySelectorAll('.video-item').forEach(function(card) {
      initVideoCard(card, function(isPlaying) {
        if (isPlaying) {
          pauseScroll();
        } else {
          resumeScroll();
        }
      });
    });

    // Visibility Observer
    const section = track.closest('.video-carousel') || track;
    if ('IntersectionObserver' in window && section) {
      const obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          isVisible = entry.isIntersecting;
          if (isVisible) start();
          else stop();
        });
      }, { threshold: 0.05 });
      obs.observe(section);
    } else {
      isVisible = true;
      start();
    }

    // Sync scrollPos on manual scroll/drag
    track.addEventListener('scroll', function() {
      if (isPaused) {
        scrollPos = track.scrollLeft;
      }
    }, { passive: true });

    let wheelResumeTimer = null;
    track.addEventListener('wheel', function(event) {
      if (Math.abs(event.deltaX) < Math.abs(event.deltaY) && !event.shiftKey) return;
      pauseScroll();
      clearTimeout(wheelResumeTimer);
      wheelResumeTimer = setTimeout(resumeScroll, 1200);
    }, { passive: true });

    // Interaction pauses
    track.addEventListener('pointerdown', pauseScroll);
    window.addEventListener('pointerup', resumeScroll);
    track.addEventListener('touchstart', pauseScroll, { passive: true });
    track.addEventListener('touchend', function() {
      setTimeout(resumeScroll, 800);
    }, { passive: true });
  }

  // Global initializer
  function init() {
    // 1. Initialize carousels
    document.querySelectorAll('.carousel-track').forEach(function(track) {
      initCarousel(track, 35);
    });

    // 2. Initialize standalone video items / editorial cards (e.g. Home page)
    document.querySelectorAll('.video-editorial-card, .video-aspect-frame, .video-item').forEach(function(card) {
      if (!card.closest('.carousel-track')) {
        initVideoCard(card);
      }
    });

    // 3. Fallback: any video elements that still haven't been initialized
    document.querySelectorAll('video').forEach(function(vid) {
      const parent = vid.closest('.video-aspect-frame') || vid.closest('.video-item') || vid.closest('.video-editorial-card') || vid.parentElement;
      if (parent && !parent.dataset.playerInitialized) {
        initVideoCard(parent);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.initShikshitVideoCarousels = init;
})();
