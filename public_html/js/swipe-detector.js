/**
 * SwipeDetector - A simple class to detect swipe gestures on touch devices
 */
class SwipeDetector {
    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({
            threshold: 50,  // Minimum distance required for a swipe
            restraint: 100, // Maximum perpendicular distance allowed
            allowedTime: 300 // Maximum time allowed for the swipe
        }, options);
        
        this.onSwipeLeft = null;
        this.onSwipeRight = null;
        this.onSwipeUp = null;
        this.onSwipeDown = null;
        
        this.startX = 0;
        this.startY = 0;
        this.startTime = 0;
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    }
    
    handleTouchStart(e) {
        const firstTouch = e.touches[0];
        this.startX = firstTouch.clientX;
        this.startY = firstTouch.clientY;
        this.startTime = new Date().getTime();
    }
    
    handleTouchMove(e) {
        // Prevent default behavior to avoid scrolling while swiping
        if (e.touches.length > 1) return; // Ignore multi-touch
    }
    
    handleTouchEnd(e) {
        const endTime = new Date().getTime();
        const elapsedTime = endTime - this.startTime;
        
        if (elapsedTime > this.options.allowedTime) return; // Too slow
        
        const touchEndEvent = e.changedTouches[0];
        const distX = touchEndEvent.clientX - this.startX;
        const distY = touchEndEvent.clientY - this.startY;
        
        // Check if horizontal or vertical swipe
        if (Math.abs(distX) >= this.options.threshold && Math.abs(distY) <= this.options.restraint) {
            // Horizontal swipe
            if (distX > 0 && this.onSwipeRight) {
                this.onSwipeRight(e);
            } else if (distX < 0 && this.onSwipeLeft) {
                this.onSwipeLeft(e);
            }
        } else if (Math.abs(distY) >= this.options.threshold && Math.abs(distX) <= this.options.restraint) {
            // Vertical swipe
            if (distY > 0 && this.onSwipeDown) {
                this.onSwipeDown(e);
            } else if (distY < 0 && this.onSwipeUp) {
                this.onSwipeUp(e);
            }
        }
    }
}
