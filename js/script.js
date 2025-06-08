// Lightbox functionality
document.addEventListener('DOMContentLoaded', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.querySelector('.lightbox-fullscreen');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = document.querySelector('.close-btn');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    
    let currentImageIndex = 0;

    // Mobile menu functionality
    const menuIcon = document.querySelector('.menu-icon');
    const menuToggle = document.getElementById('menu-toggle');
    const desktopNav = document.querySelector('.desktop-nav');
    const menuBars = menuIcon.querySelector('.fa-bars');
    const menuTimes = menuIcon.querySelector('.fa-times');

    // Initially hide the times icon
    menuTimes.style.display = 'none';

    menuIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle menu state
        menuToggle.checked = !menuToggle.checked;
        
        // Toggle icons
        if (menuToggle.checked) {
            menuBars.style.display = 'none';
            menuTimes.style.display = 'block';
            desktopNav.style.display = 'flex';
        } else {
            menuBars.style.display = 'block';
            menuTimes.style.display = 'none';
            desktopNav.style.display = 'none';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-icon') && !e.target.closest('.desktop-nav')) {
            menuToggle.checked = false;
            menuBars.style.display = 'block';
            menuTimes.style.display = 'none';
            desktopNav.style.display = 'none';
        }
    });

    // Prevent menu from closing when clicking inside it
    desktopNav.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Open lightbox
    portfolioItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            const src = item.getAttribute('data-src');
            lightboxImg.src = src;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Navigation between images
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % portfolioItems.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + portfolioItems.length) % portfolioItems.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const newSrc = portfolioItems[currentImageIndex].getAttribute('data-src');
        lightboxImg.src = newSrc;
    }

    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') closeBtn.click();
        }
    });

    // Prevent image dragging
    lightboxImg.addEventListener('dragstart', (e) => e.preventDefault());
});

document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = form.querySelector('.submit-btn');
    const successMsg = form.parentElement.querySelector('.success-message');
    const originalBtnText = submitBtn.innerHTML; // حفظ الحالة الأصلية للزر
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...'; // استخدام innerHTML بدل textContent للحفاظ على الأيقونة

    try {
        const response = await fetch(form.action, {
            method: form.method,
            headers: {
                'Accept': 'application/json',
                // Formspree لا يحتاج إلى تحديد Content-Type عند استخدام FormData
            },
            body: new FormData(form)
        });

        const result = await response.json(); // قراءة رد Formspree

        if (result.ok) {
            form.reset();
            successMsg.classList.add('active');
            setTimeout(() => {
                successMsg.classList.remove('active');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 5000);
        } else {
            throw new Error(result.error || 'Something went wrong');
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert(error.message || 'Failed to send message. Please try again.');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});