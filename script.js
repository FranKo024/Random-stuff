document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slide-dots');
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlides() {
        slides.forEach((slide, index) => {
            // Remove all classes first
            slide.classList.remove('active', 'prev', 'next');
            
            // Add appropriate class based on position
            if (index === currentSlide) {
                slide.classList.add('active');
            } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            } else if (index === (currentSlide + 1) % slides.length) {
                slide.classList.add('next');
            }
        });

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    // Add event listeners
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Initialize slideshow
    updateSlides();

    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance when hovering over slideshow
    const slideshow = document.querySelector('.slideshow-container');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slideshow.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // Confetti Animation
    class ConfettiAnimation {
        constructor() {
            this.container = document.querySelector('.confetti-container');
            this.footer = document.querySelector('footer');
            this.emojis = ['dog', 'tada', 'heart'];
            this.isAnimating = false;
            
            this.init();
        }

        init() {
            this.footer.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent any default click behavior
                this.startConfetti();
            });
        }

        createConfetti(type, x, y, isFlying = false) {
            const confetti = document.createElement('div');
            confetti.className = `confetti ${type}`;
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            
            // Random rotation between -360 and 360 degrees
            const rotation = (Math.random() * 720 - 360);
            confetti.style.setProperty('--rotation', `${rotation}deg`);
            
            // Random horizontal spread with increased range
            const spreadX = (Math.random() - 0.5) * 400; // Increased spread range
            confetti.style.setProperty('--spread-x', `${spreadX}px`);
            
            // Random initial velocity (affects duration)
            const velocity = 0.8 + Math.random() * 0.8; // Between 0.8 and 1.6
            const duration = 2 + velocity * 2; // Between 2 and 3.6 seconds
            
            // Random delay for more natural burst
            const delay = Math.random() * 0.3; // Reduced delay for tighter burst
            
            // Add slight random tilt
            const tilt = (Math.random() - 0.5) * 30; // Random tilt between -15 and 15 degrees
            confetti.style.transform = `rotate(${tilt}deg)`;
            
            confetti.style.animation = `${isFlying ? 'confetti-fly' : 'confetti-fall'} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`;
            
            this.container.appendChild(confetti);
            
            // Remove the confetti element after animation
            setTimeout(() => {
                confetti.remove();
            }, (duration + delay) * 1000);
        }

        startConfetti() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            
            const footerRect = this.footer.getBoundingClientRect();
            const startX = footerRect.left + footerRect.width / 2;
            const startY = footerRect.top;
            
            // Create more confetti pieces with varied starting positions
            for (let i = 0; i < 40; i++) { // Increased number of pieces
                const type = this.emojis[Math.floor(Math.random() * this.emojis.length)];
                
                // Create a more dispersed starting point
                const spread = 50; // Base spread
                const x = startX + (Math.random() - 0.5) * spread;
                const y = startY + (Math.random() - 0.5) * (spread / 2);
                
                // 40% chance of flying up, 60% chance of falling
                const isFlying = Math.random() < 0.4;
                
                this.createConfetti(type, x, y, isFlying);
            }
            
            // Reset animation flag after all confetti are done
            setTimeout(() => {
                this.isAnimating = false;
            }, 4000); // Increased cooldown
        }
    }

    // Initialize confetti animation when the page loads
    new ConfettiAnimation();

    // Add keyframes for the fun message animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes messagePop {
            0% { transform: translateX(-50%) scale(0.8); opacity: 0; }
            50% { transform: translateX(-50%) scale(1.1); opacity: 1; }
            100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        
        @keyframes messageFade {
            0% { transform: translateX(-50%) scale(1); opacity: 1; }
            100% { transform: translateX(-50%) scale(0.8); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
