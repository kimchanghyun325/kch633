/* ===== RESUME WEBSITE SCRIPT ===== */
document.addEventListener('DOMContentLoaded', () => {

    // ---- Navigation ----
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('.section, #hero');

    // Scroll effect on nav
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = scrollY;

        // Active section tracking
        updateActiveNav();
    });

    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('open');
        const spans = navToggle.querySelectorAll('span');
        if (navLinksContainer.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('open');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });

    // ---- Counter Animation ----
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        const heroSection = document.getElementById('hero');
        const rect = heroSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);
                    el.textContent = current.toLocaleString();
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target.toLocaleString();
                    }
                }
                requestAnimationFrame(update);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Run on load

    // ---- Project Slider ----
    const sliderTrack = document.getElementById('slider-track');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dots = document.querySelectorAll('#slider-dots .dot');
    let currentSlide = 0;
    const totalSlides = 5;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.getAttribute('data-index')));
        });
    });

    // Touch/Swipe support for project slider
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderViewport = document.querySelector('.slider-viewport');

    sliderViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderViewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentSlide + 1);
            else goToSlide(currentSlide - 1);
        }
    }, { passive: true });

    // ---- Cover Letter Tabs/Slider ----
    const clTabs = document.querySelectorAll('.cl-tab');
    const clPanels = document.querySelectorAll('.cl-panel');
    const clPrevBtn = document.getElementById('cl-prev');
    const clNextBtn = document.getElementById('cl-next');
    const clIndicator = document.getElementById('cl-indicator');
    let currentCL = 0;
    const totalCL = 5;

    function goToCL(index) {
        if (index < 0) index = totalCL - 1;
        if (index >= totalCL) index = 0;
        currentCL = index;

        clTabs.forEach((tab, i) => {
            tab.classList.toggle('active', i === currentCL);
        });

        clPanels.forEach((panel, i) => {
            panel.classList.toggle('active', i === currentCL);
        });

        clIndicator.textContent = `${currentCL + 1} / ${totalCL}`;

        // Scroll active tab into view
        clTabs[currentCL].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        // Animate bars if Panel 2
        if (currentCL === 1) {
            setTimeout(animateBars, 300);
        }
    }

    clTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            goToCL(parseInt(tab.getAttribute('data-cl')));
        });
    });

    clPrevBtn.addEventListener('click', () => goToCL(currentCL - 1));
    clNextBtn.addEventListener('click', () => goToCL(currentCL + 1));

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            // Check if cover letter is in view
            const clSection = document.getElementById('cover-letter');
            const rect = clSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                goToCL(currentCL - 1);
            }
        }
        if (e.key === 'ArrowRight') {
            const clSection = document.getElementById('cover-letter');
            const rect = clSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                goToCL(currentCL + 1);
            }
        }
    });

    // ---- Bar Animation ----
    function animateBars() {
        const bars = document.querySelectorAll('.cl-bar');
        bars.forEach(bar => {
            const width = bar.style.getPropertyValue('--bar-width');
            bar.style.width = '0%';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bar.style.width = width;
                });
            });
        });
    }

    // ---- Scroll Reveal ----
    const revealElements = document.querySelectorAll(
        '.info-card, .timeline-item, .career-card, .ai-tool-card, .cert-card, .award-card'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger
                const siblings = Array.from(entry.target.parentElement.children);
                const sibIndex = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, sibIndex * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
