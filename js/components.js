// Global Components Loader
class ComponentLoader {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().toLowerCase();
        
        // Map filenames to page identifiers
        const pageMap = {
            '1 homepage.html': 'home',
            '2 issues.html': 'issues',
            '3 about.html': 'about',
            '4 programs.html': 'programs',
            '5 action center.html': 'action',
            '6 partners.html': 'partners',
            '7 news.html': 'news',
            '8 contact.html': 'contact',
            '9 donate.html': 'donate'
        };

        return pageMap[filename] || 'home';
    }

    async loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                return true;
            }
        } catch (error) {
            console.warn(`Could not load component ${componentPath}:`, error);
            return false;
        }
    }

    setActiveNavItem() {
        // Set active navigation item based on current page
        const navLinks = document.querySelectorAll('.header-nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(this.currentPage)) {
                link.classList.add('active');
            }
        });
    }

    initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const headerNav = document.querySelector('.header-nav');

        if (mobileMenuToggle && headerNav) {
            mobileMenuToggle.addEventListener('click', () => {
                const isActive = headerNav.classList.contains('active');
                headerNav.classList.toggle('active');
                mobileMenuToggle.setAttribute('aria-expanded', !isActive);
                
                // Add mobile menu styles dynamically
                if (!isActive) {
                    headerNav.style.display = 'flex';
                    headerNav.style.position = 'absolute';
                    headerNav.style.top = '100%';
                    headerNav.style.left = '0';
                    headerNav.style.right = '0';
                    headerNav.style.background = 'var(--white)';
                    headerNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                    headerNav.style.padding = '20px';
                    headerNav.style.flexDirection = 'column';
                    headerNav.style.gap = '10px';
                    headerNav.style.zIndex = '1002';
                } else {
                    headerNav.style.display = '';
                    headerNav.style.position = '';
                    headerNav.style.top = '';
                    headerNav.style.left = '';
                    headerNav.style.right = '';
                    headerNav.style.background = '';
                    headerNav.style.boxShadow = '';
                    headerNav.style.padding = '';
                    headerNav.style.flexDirection = '';
                    headerNav.style.gap = '';
                    headerNav.style.zIndex = '';
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.header-nav') && !e.target.closest('.mobile-menu-toggle')) {
                    if (headerNav.classList.contains('active')) {
                        headerNav.classList.remove('active');
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        // Reset styles
                        headerNav.style.display = '';
                        headerNav.style.position = '';
                        headerNav.style.top = '';
                        headerNav.style.left = '';
                        headerNav.style.right = '';
                        headerNav.style.background = '';
                        headerNav.style.boxShadow = '';
                        headerNav.style.padding = '';
                        headerNav.style.flexDirection = '';
                        headerNav.style.gap = '';
                        headerNav.style.zIndex = '';
                    }
                }
            });
        }
    }

    initHeaderScrollEffect() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.backdropFilter = 'blur(10px)';
                    header.style.webkitBackdropFilter = 'blur(10px)';
                } else {
                    header.style.background = 'var(--white)';
                    header.style.backdropFilter = 'none';
                    header.style.webkitBackdropFilter = 'none';
                }
            }
        });
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    async init() {
        // Load header and footer components if they exist
        const headerLoaded = await this.loadComponent('global-header', 'includes/header.html');
        const footerLoaded = await this.loadComponent('global-footer', 'includes/footer.html');

        // Wait a bit for DOM to update, then initialize components
        setTimeout(() => {
            if (headerLoaded) {
                this.setActiveNavItem();
                this.initMobileMenu();
                this.initHeaderScrollEffect();
            }
            this.initSmoothScrolling();
            this.initOtherComponents();
        }, 100);
    }

    initOtherComponents() {
        // Initialize dropdown menus
        this.initDropdowns();
        
        // Initialize any form handlers
        this.initForms();
        
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Initialize FAQ accordions
        this.initFAQ();
        
        // Initialize contact form
        this.initContactForm();
    }

    initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!dropdown.contains(e.target)) {
                        menu.style.opacity = '0';
                        menu.style.visibility = 'hidden';
                    }
                });
            }
        });
    }

    initForms() {
        // Newsletter form handling
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                if (email) {
                    console.log('Newsletter signup:', email);
                    // Here you would typically send to your backend
                }
            });
        }
    }

    initScrollAnimations() {
        // Simple fade-in animation for elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate in
        const animateElements = document.querySelectorAll('.change-card, .team-member, .impact-item, .challenge-item');
        animateElements.forEach(el => observer.observe(el));
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // Toggle current item
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    initContactForm() {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const name = contactForm.querySelector('input[type="text"]').value;
                const email = contactForm.querySelector('input[type="email"]').value;
                const message = contactForm.querySelector('textarea').value;
                
                if (name && email && message) {
                    // Show loading state
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                    
                    // Simulate form submission (replace with actual form handler)
                    setTimeout(() => {
                        alert('Thank you for your message! We\'ll get back to you soon.');
                        contactForm.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 1500);
                    
                    console.log('Contact form submitted:', { name, email, message });
                }
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});

// Global utility functions
window.PraxisUtils = {
    // Show loading state for buttons
    showButtonLoading: (button, originalText = null) => {
        if (!originalText) originalText = button.textContent;
        button.dataset.originalText = originalText;
        button.textContent = 'Loading...';
        button.style.opacity = '0.7';
        button.disabled = true;
    },

    // Hide loading state for buttons
    hideButtonLoading: (button) => {
        const originalText = button.dataset.originalText || 'Click Here';
        button.textContent = originalText;
        button.style.opacity = '1';
        button.disabled = false;
    },

    // Smooth scroll to element
    scrollToElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Format numbers with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // Debounce function for search/input handlers
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Add some additional event listeners for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Handle external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // Handle phone number links
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Analytics tracking could go here
            console.log('Phone number clicked:', link.href);
        });
    });

    // Handle email links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Analytics tracking could go here
            console.log('Email link clicked:', link.href);
        });
    });
});

// =================================================================
// ANIMATED STATISTICS COUNTERS
// =================================================================

class AnimatedCounters {
    constructor() {
        this.counters = document.querySelectorAll('.crisis-number');
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        // Create intersection observer to trigger animation when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const text = element.textContent;
        const hasPercent = text.includes('%');
        const hasPlus = text.includes('+');
        const hasComma = text.includes(',');
        
        // Extract the numeric value
        let targetValue = parseFloat(text.replace(/[^\d.]/g, ''));
        
        // Handle special cases
        if (text.includes('215,000')) {
            targetValue = 215000;
        } else if (text.includes('446')) {
            targetValue = 446;
        } else if (text.includes('13')) {
            targetValue = 13;
        } else if (text.includes('4.2')) {
            targetValue = 4.2;
        }

        let currentValue = 0;
        const increment = targetValue / 60; // 60 frames for smooth animation
        const duration = 2000; // 2 seconds
        const frameRate = duration / 60;

        element.textContent = '0';
        element.classList.add('animate');

        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }

            // Format the display value
            let displayValue;
            if (text.includes('4.2')) {
                displayValue = currentValue.toFixed(1);
            } else if (text.includes('215,000')) {
                displayValue = Math.floor(currentValue).toLocaleString();
            } else {
                displayValue = Math.floor(currentValue).toString();
            }

            // Add back the symbols
            if (hasPercent) displayValue += '%';
            if (hasPlus) displayValue += '+';

            element.textContent = displayValue;
        }, frameRate);
    }
}

// =================================================================
// SCROLL-TRIGGERED ANIMATIONS
// =================================================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.program-feature, .program-text, .crisis-stat');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        // Add fade-in-up class to elements
        this.elements.forEach((element, index) => {
            element.classList.add('fade-in-up');
            element.style.transitionDelay = `${index * 0.1}s`;
        });

        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// =================================================================
// INTERACTIVE PROGRAM CARDS
// =================================================================

class InteractiveProgramCards {
    constructor() {
        this.programFeatures = document.querySelectorAll('.program-feature');
        this.init();
    }

    init() {
        if (this.programFeatures.length === 0) return;

        this.programFeatures.forEach(feature => {
            // Add hover sound effect (optional)
            feature.addEventListener('mouseenter', () => {
                feature.style.transform = 'translateY(-5px) scale(1.02)';
                feature.style.transition = 'all 0.3s ease';
            });

            feature.addEventListener('mouseleave', () => {
                feature.style.transform = 'translateY(0) scale(1)';
            });

            // Add click interaction
            feature.addEventListener('click', () => {
                // Add a subtle pulse effect
                feature.style.animation = 'pulse 0.6s ease-in-out';
                setTimeout(() => {
                    feature.style.animation = '';
                }, 600);
            });
        });
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animated counters
    new AnimatedCounters();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize interactive program cards
    new InteractiveProgramCards();
});

// Add pulse animation to CSS if not already present
if (!document.querySelector('#pulse-animation-style')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation-style';
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}


// =================================================================
// EXPANDABLE PROGRAM CARDS
// =================================================================

class ExpandableCards {
    constructor() {
        this.expandButtons = document.querySelectorAll('.expand-btn');
        this.init();
    }

    init() {
        if (this.expandButtons.length === 0) return;

        this.expandButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCard(button);
            });
        });
    }

    toggleCard(button) {
        const card = button.closest('.expandable-card');
        const content = card.querySelector('.expandable-content');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Toggle expanded state
        button.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
            // Expand
            content.style.display = 'block';
            content.classList.add('expanded');
            card.classList.add('expanding');
            
            // Update button text
            button.querySelector('.btn-text').textContent = 'Learn';
            
            // Smooth scroll to keep card in view
            setTimeout(() => {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 200);
            
        } else {
            // Collapse
            content.classList.remove('expanded');
            card.classList.remove('expanding');
            
            // Update button text
            button.querySelector('.btn-text').textContent = 'Learn';
            
            // Hide content after animation
            setTimeout(() => {
                content.style.display = 'none';
            }, 400);
        }

        // Add pulse effect to the card
        card.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 600);
    }
}

// =================================================================
// PROGRAM TIMELINE WIDGET
// =================================================================

class ProgramTimeline {
    constructor() {
        this.timelineContainer = document.querySelector('.program-timeline');
        this.init();
    }

    init() {
        if (!this.timelineContainer) {
            this.createTimeline();
        }
    }

    createTimeline() {
        // Create timeline section if it doesn't exist
        const timelineHTML = `
            <section class="program-timeline section">
                <div class="container">
                    <h2>Our Journey: Key Milestones</h2>
                    <div class="timeline">
                        <div class="timeline-item" data-year="2020">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>Organization Founded</h3>
                                <p>Praxis Initiative established with a mission to transform Arizona's criminal justice system</p>
                            </div>
                        </div>
                        <div class="timeline-item" data-year="2022">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>First Legislative Victory</h3>
                                <p>Successfully advocated for criminal justice reform legislation</p>
                            </div>
                        </div>
                        <div class="timeline-item" data-year="2024">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>Independent Oversight Office</h3>
                                <p>Created Arizona's first Independent Correctional Oversight Office</p>
                            </div>
                        </div>
                        <div class="timeline-item" data-year="2025">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>Expanding Impact</h3>
                                <p>Launching comprehensive programs across all five focus areas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Insert timeline before the last section
        const lastSection = document.querySelector('main section:last-of-type');
        if (lastSection) {
            lastSection.insertAdjacentHTML('beforebegin', timelineHTML);
            this.animateTimeline();
        }
    }

    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.3
        });

        timelineItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(item);
        });
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animated counters
    new AnimatedCounters();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize interactive program cards
    new InteractiveProgramCards();
    
    // Initialize expandable cards
    new ExpandableCards();
    
    // Initialize program timeline
    new ProgramTimeline();
});


// =================================================================
// PARTNERS PAGE INTERACTIVE FUNCTIONALITY
// =================================================================

class PartnersManager {
    constructor() {
        this.searchInput = document.getElementById('partner-search');
        this.categoryFilter = document.getElementById('category-filter');
        this.gridViewBtn = document.getElementById('grid-view');
        this.listViewBtn = document.getElementById('list-view');
        this.partnersContainer = document.getElementById('partners-container');
        this.resultsCount = document.getElementById('results-count');
        this.partnerCards = document.querySelectorAll('.partner-card');
        
        this.init();
    }

    init() {
        if (!this.partnersContainer) return;

        // Initialize search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.debounce(() => {
                this.filterPartners();
            }, 300));
        }

        // Initialize category filtering
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => {
                this.filterPartners();
            });
        }

        // Initialize view toggle
        if (this.gridViewBtn && this.listViewBtn) {
            this.gridViewBtn.addEventListener('click', () => {
                this.setView('grid');
            });

            this.listViewBtn.addEventListener('click', () => {
                this.setView('list');
            });
        }

        // Initialize animated counters for partnership stats
        this.initPartnershipStats();

        // Initial filter
        this.filterPartners();
    }

    filterPartners() {
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';
        const selectedCategory = this.categoryFilter ? this.categoryFilter.value : 'all';
        let visibleCount = 0;

        this.partnerCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || '';
            const cardText = card.textContent.toLowerCase();
            
            const matchesSearch = !searchTerm || cardText.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || cardCategory === selectedCategory;
            
            if (matchesSearch && matchesCategory) {
                this.showCard(card);
                visibleCount++;
            } else {
                this.hideCard(card);
            }
        });

        // Update results count
        if (this.resultsCount) {
            const partnerText = visibleCount === 1 ? 'partner' : 'partners';
            this.resultsCount.textContent = `${visibleCount} ${partnerText} found`;
        }

        // Add staggered animation to visible cards
        this.animateVisibleCards();
    }

    showCard(card) {
        card.classList.remove('hidden', 'fade-out');
        card.classList.add('fade-in');
        setTimeout(() => {
            card.style.display = '';
        }, 50);
    }

    hideCard(card) {
        card.classList.remove('fade-in');
        card.classList.add('fade-out');
        setTimeout(() => {
            card.classList.add('hidden');
            card.style.display = 'none';
        }, 300);
    }

    setView(viewType) {
        if (viewType === 'grid') {
            this.partnersContainer.classList.remove('list-view');
            this.gridViewBtn.classList.add('active');
            this.listViewBtn.classList.remove('active');
        } else {
            this.partnersContainer.classList.add('list-view');
            this.listViewBtn.classList.add('active');
            this.gridViewBtn.classList.remove('active');
        }
    }

    animateVisibleCards() {
        const visibleCards = Array.from(this.partnerCards).filter(card => 
            !card.classList.contains('hidden')
        );

        visibleCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
    }

    initPartnershipStats() {
        const statNumbers = document.querySelectorAll('.partnership-stat .stat-number');
        
        if (statNumbers.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    this.animateStatNumber(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    animateStatNumber(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const targetValue = parseInt(text.replace(/[^\d]/g, ''));
        
        let currentValue = 0;
        const increment = targetValue / 30;
        const duration = 1500;
        const frameRate = duration / 30;

        element.textContent = '0';

        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }

            let displayValue = Math.floor(currentValue).toString();
            if (hasPlus) displayValue += '+';

            element.textContent = displayValue;
        }, frameRate);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// =================================================================
// PARTNERSHIP VISUALIZATION
// =================================================================

class PartnershipVisualization {
    constructor() {
        this.createVisualization();
    }

    createVisualization() {
        // Create partnership network visualization section
        const visualizationHTML = `
            <section class="partnership-network section">
                <div class="container">
                    <h2>Partnership Network</h2>
                    <p>Explore how our partners connect across different focus areas</p>
                    <div class="network-container">
                        <div class="network-node" data-category="criminal-justice">
                            <div class="node-circle">
                                <span class="node-count">6</span>
                            </div>
                            <div class="node-label">Criminal Justice Reform</div>
                        </div>
                        <div class="network-node" data-category="harm-reduction">
                            <div class="node-circle">
                                <span class="node-count">3</span>
                            </div>
                            <div class="node-label">Harm Reduction</div>
                        </div>
                        <div class="network-node" data-category="research">
                            <div class="node-circle">
                                <span class="node-count">4</span>
                            </div>
                            <div class="node-label">Research & Policy</div>
                        </div>
                        <div class="network-node" data-category="advocacy">
                            <div class="node-circle">
                                <span class="node-count">4</span>
                            </div>
                            <div class="node-label">Advocacy & Rights</div>
                        </div>
                        <div class="network-node" data-category="health">
                            <div class="node-circle">
                                <span class="node-count">5</span>
                            </div>
                            <div class="node-label">Health & Wellness</div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Insert before the CTA section
        const ctaSection = document.querySelector('.cta');
        if (ctaSection) {
            ctaSection.insertAdjacentHTML('beforebegin', visualizationHTML);
            this.initNetworkInteractions();
        }
    }

    initNetworkInteractions() {
        const networkNodes = document.querySelectorAll('.network-node');
        const categoryFilter = document.getElementById('category-filter');

        networkNodes.forEach(node => {
            node.addEventListener('click', () => {
                const category = node.getAttribute('data-category');
                if (categoryFilter) {
                    categoryFilter.value = category;
                    categoryFilter.dispatchEvent(new Event('change'));
                    
                    // Scroll to partners section
                    document.getElementById('partners-container').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });

            node.addEventListener('mouseenter', () => {
                node.style.transform = 'scale(1.1)';
            });

            node.addEventListener('mouseleave', () => {
                node.style.transform = 'scale(1)';
            });
        });
    }
}

// Update the main DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animated counters
    new AnimatedCounters();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize interactive program cards
    new InteractiveProgramCards();
    
    // Initialize expandable cards
    new ExpandableCards();
    
    // Initialize program timeline
    new ProgramTimeline();
    
    // Initialize partners manager (only on partners page)
    if (document.getElementById('partners-container')) {
        new PartnersManager();
        new PartnershipVisualization();
    }
});



// ===== NEWS PAGE FUNCTIONALITY =====

// News page filtering and search
function initializeNewsPage() {
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const sortSelect = document.getElementById('sortBy');
    const dateFilter = document.getElementById('dateFilter');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const contentItems = document.querySelector('.content-items');
    const resultsCount = document.getElementById('resultsCount');
    
    let allArticles = [];
    let filteredArticles = [];
    let currentFilter = 'all';
    let currentSort = 'date-desc';
    let currentDateFilter = 'all';
    let searchTerm = '';
    
    // Initialize articles data
    function initializeArticles() {
        const articles = document.querySelectorAll('.content-card, .featured-article');
        allArticles = Array.from(articles).map(article => ({
            element: article,
            type: article.dataset.type || 'article',
            date: new Date(article.dataset.date || '2025-01-01'),
            popularity: parseInt(article.dataset.popularity || '50'),
            title: article.querySelector('.card-title, h2')?.textContent || '',
            excerpt: article.querySelector('.card-excerpt, .featured-description')?.textContent || '',
            tags: Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent),
            author: article.querySelector('.card-meta span:nth-child(2)')?.textContent || ''
        }));
        filteredArticles = [...allArticles];
        updateResultsCount();
    }
    
    // Search functionality with suggestions
    if (searchInput) {
        let searchTimeout;
        const searchSuggestionsList = [
            'bail reform', 'restorative justice', 'mandatory minimums', 'prison reform',
            'criminal justice', 'sentencing disparities', 'community programs', 'recidivism',
            'drug policy', 'mental health courts', 'prosecutorial discretion', 'decarceration'
        ];
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTerm = e.target.value.toLowerCase();
            
            // Show suggestions
            if (searchTerm.length > 1) {
                const suggestions = searchSuggestionsList.filter(suggestion => 
                    suggestion.includes(searchTerm)
                ).slice(0, 5);
                
                if (suggestions.length > 0) {
                    searchSuggestions.innerHTML = suggestions.map(suggestion => 
                        `<div class="suggestion-item" data-suggestion="${suggestion}">${suggestion}</div>`
                    ).join('');
                    searchSuggestions.style.display = 'block';
                } else {
                    searchSuggestions.style.display = 'none';
                }
            } else {
                searchSuggestions.style.display = 'none';
            }
            
            // Debounced search
            searchTimeout = setTimeout(() => {
                filterAndSortArticles();
            }, 300);
        });
        
        // Handle suggestion clicks
        searchSuggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-item')) {
                searchInput.value = e.target.dataset.suggestion;
                searchTerm = e.target.dataset.suggestion.toLowerCase();
                searchSuggestions.style.display = 'none';
                filterAndSortArticles();
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });
    }
    
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            filterAndSortArticles();
        });
    });
    
    // Sort and date filters
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            filterAndSortArticles();
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', (e) => {
            currentDateFilter = e.target.value;
            filterAndSortArticles();
        });
    }
    
    // View toggle
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            contentItems.classList.remove('list-view');
        });
        
        listViewBtn.addEventListener('click', () => {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            contentItems.classList.add('list-view');
        });
    }
    
    // Filter and sort function
    function filterAndSortArticles() {
        filteredArticles = allArticles.filter(article => {
            // Type filter
            if (currentFilter !== 'all' && article.type !== currentFilter) {
                return false;
            }
            
            // Date filter
            if (currentDateFilter !== 'all') {
                const now = new Date();
                const articleDate = article.date;
                let cutoffDate;
                
                switch (currentDateFilter) {
                    case 'week':
                        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case 'month':
                        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                    case 'quarter':
                        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                        break;
                    case 'year':
                        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                        break;
                    default:
                        cutoffDate = new Date(0);
                }
                
                if (articleDate < cutoffDate) {
                    return false;
                }
            }
            
            // Search filter
            if (searchTerm) {
                const searchableText = (
                    article.title + ' ' + 
                    article.excerpt + ' ' + 
                    article.tags.join(' ') + ' ' + 
                    article.author
                ).toLowerCase();
                
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Sort articles
        filteredArticles.sort((a, b) => {
            switch (currentSort) {
                case 'date-desc':
                    return b.date - a.date;
                case 'date-asc':
                    return a.date - b.date;
                case 'popular':
                    return b.popularity - a.popularity;
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
        
        // Update display
        updateArticleDisplay();
        updateResultsCount();
    }
    
    function updateArticleDisplay() {
        // Hide all articles first
        allArticles.forEach(article => {
            article.element.style.display = 'none';
        });
        
        // Show filtered articles
        filteredArticles.forEach((article, index) => {
            article.element.style.display = 'block';
            article.element.style.order = index;
        });
    }
    
    function updateResultsCount() {
        if (resultsCount) {
            const count = filteredArticles.length;
            const articleText = count === 1 ? 'article' : 'articles';
            resultsCount.textContent = `${count} ${articleText} found`;
        }
    }
    
    // Initialize
    initializeArticles();
}

// Bookmarking functionality
function initializeBookmarking() {
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    let bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    
    // Update bookmark button states
    function updateBookmarkStates() {
        bookmarkButtons.forEach(btn => {
            const articleId = btn.dataset.articleId;
            if (bookmarkedArticles.includes(articleId)) {
                btn.classList.add('bookmarked');
                btn.querySelector('i').className = 'fas fa-bookmark';
            } else {
                btn.classList.remove('bookmarked');
                btn.querySelector('i').className = 'far fa-bookmark';
            }
        });
    }
    
    // Handle bookmark clicks
    bookmarkButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = btn.dataset.articleId;
            
            if (bookmarkedArticles.includes(articleId)) {
                bookmarkedArticles = bookmarkedArticles.filter(id => id !== articleId);
                showNotification('Article removed from bookmarks', 'info');
            } else {
                bookmarkedArticles.push(articleId);
                showNotification('Article bookmarked!', 'success');
            }
            
            localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
            updateBookmarkStates();
        });
    });
    
    updateBookmarkStates();
}

// Social sharing functionality
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.social-btn, .social-btn-mini, .share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.dataset.platform;
            const articleElement = btn.closest('.content-card, .featured-article');
            const title = articleElement.querySelector('.card-title, h2')?.textContent || 'Praxis Initiative Article';
            const url = window.location.href;
            
            let shareUrl = '';
            
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + url)}`;
                    break;
            }
            
            if (shareUrl) {
                if (platform === 'email') {
                    window.location.href = shareUrl;
                } else {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
                showNotification('Sharing article...', 'info');
            }
        });
    });
}

// Tag click functionality
function initializeTagFiltering() {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = tag.textContent;
                searchInput.dispatchEvent(new Event('input'));
                showNotification(`Filtering by "${tag.textContent}"`, 'info');
            }
        });
    });
}

// Newsletter preferences
function initializeNewsletterPreferences() {
    const preferenceOptions = document.querySelectorAll('.preference-option');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    // Handle preference selection
    preferenceOptions.forEach(option => {
        const checkbox = option.querySelector('input[type="checkbox"]');
        option.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
        });
    });
    
    // Handle form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            const frequency = newsletterForm.querySelector('select[name="frequency"]').value;
            const interests = Array.from(document.querySelectorAll('.preference-option input:checked'))
                .map(input => input.value);
            
            // Simulate newsletter subscription
            showNotification('Successfully subscribed to newsletter!', 'success');
            console.log('Newsletter subscription:', { email, frequency, interests });
        });
    }
}

// Animated statistics counters for News page
function initializeNewsStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with appropriate suffix
            let displayValue = Math.floor(current);
            if (target >= 1000) {
                if (target >= 1000000) {
                    displayValue = (current / 1000000).toFixed(1) + 'M';
                } else {
                    displayValue = (current / 1000).toFixed(1) + 'K';
                }
            }
            
            element.textContent = displayValue;
        }, 16);
    };
    
    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                let target = parseInt(text.replace(/[^\d]/g, ''));
                
                if (text.includes('K')) {
                    target *= 1000;
                } else if (text.includes('M')) {
                    target *= 1000000;
                }
                
                animateCounter(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'info':
        default:
            notification.style.background = '#007bff';
            break;
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize all News page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the News page
    if (window.location.pathname.includes('News') || document.querySelector('.news-stats')) {
        initializeNewsPage();
        initializeBookmarking();
        initializeSocialSharing();
        initializeTagFiltering();
        initializeNewsletterPreferences();
        initializeNewsStats();
    }
});


// ===== CONTACT PAGE FUNCTIONALITY =====

// Contact page initialization
function initializeContactPage() {
    initializeContactStats();
    initializeMethodSelector();
    initializeMultiStepForm();
    initializeLiveChat();
    initializeAppointmentScheduler();
    initializeFileUpload();
    initializeFormValidation();
}

// Animated statistics for Contact page
function initializeContactStats() {
    const statNumbers = document.querySelectorAll('.contact-stat .stat-number');
    
    const animateCounter = (element, target) => {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with appropriate suffix
            let displayValue = Math.floor(current);
            if (target >= 1000) {
                displayValue = (current / 1000).toFixed(1) + 'K';
            }
            
            element.textContent = displayValue;
        }, 16);
    };
    
    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.target);
                animateCounter(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Contact method selector
function initializeMethodSelector() {
    const methodCards = document.querySelectorAll('.method-card');
    const sections = {
        form: document.getElementById('form-section'),
        chat: document.getElementById('chat-section'),
        appointment: document.getElementById('appointment-section'),
        phone: null // Phone doesn't have a section, just shows contact info
    };
    
    methodCards.forEach(card => {
        card.addEventListener('click', () => {
            const method = card.dataset.method;
            
            // Update active card
            methodCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Show/hide sections
            Object.keys(sections).forEach(key => {
                if (sections[key]) {
                    sections[key].style.display = key === method ? 'block' : 'none';
                }
            });
            
            // Special handling for phone
            if (method === 'phone') {
                // Scroll to contact info
                document.querySelector('.contact-info-section').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Multi-step form functionality
function initializeMultiStepForm() {
    const form = document.getElementById('contact-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtn = document.getElementById('next-step');
    const prevBtn = document.getElementById('prev-step');
    const submitBtn = document.getElementById('submit-form');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    
    function updateStep(step) {
        // Hide all steps
        steps.forEach(s => s.classList.remove('active'));
        progressSteps.forEach(s => {
            s.classList.remove('active', 'completed');
        });
        
        // Show current step
        document.querySelector(`[data-step="${step}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
        
        // Mark completed steps
        for (let i = 1; i < step; i++) {
            document.querySelector(`.progress-step[data-step="${i}"]`).classList.add('completed');
        }
        
        // Update navigation buttons
        prevBtn.style.display = step > 1 ? 'block' : 'none';
        nextBtn.style.display = step < totalSteps ? 'block' : 'none';
        submitBtn.style.display = step === totalSteps ? 'block' : 'none';
        
        // Update review section if on last step
        if (step === totalSteps) {
            updateReviewSection();
        }
    }
    
    function validateStep(step) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
                
                // Additional validation
                if (field.type === 'email' && !isValidEmail(field.value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    function updateReviewSection() {
        const formData = new FormData(form);
        
        // Contact Information
        const contactReview = document.getElementById('review-contact');
        contactReview.innerHTML = `
            <div class="review-item"><span class="review-label">Name:</span> ${formData.get('firstName')} ${formData.get('lastName')}</div>
            <div class="review-item"><span class="review-label">Email:</span> ${formData.get('email')}</div>
            <div class="review-item"><span class="review-label">Phone:</span> ${formData.get('phone') || 'Not provided'}</div>
            <div class="review-item"><span class="review-label">Organization:</span> ${formData.get('organization') || 'Not provided'}</div>
        `;
        
        // Inquiry Details
        const inquiryReview = document.getElementById('review-inquiry');
        const topicSelect = document.getElementById('contact-topic');
        const urgencySelect = document.getElementById('contact-urgency');
        inquiryReview.innerHTML = `
            <div class="review-item"><span class="review-label">Topic:</span> ${topicSelect.options[topicSelect.selectedIndex].text}</div>
            <div class="review-item"><span class="review-label">Urgency:</span> ${urgencySelect.options[urgencySelect.selectedIndex].text}</div>
            <div class="review-item"><span class="review-label">Subject:</span> ${formData.get('subject')}</div>
            <div class="review-item"><span class="review-label">Message:</span> ${formData.get('message').substring(0, 100)}${formData.get('message').length > 100 ? '...' : ''}</div>
        `;
        
        // Additional Information
        const additionalReview = document.getElementById('review-additional');
        const locationSelect = document.getElementById('contact-location');
        const referralSelect = document.getElementById('contact-referral');
        additionalReview.innerHTML = `
            <div class="review-item"><span class="review-label">Location:</span> ${locationSelect.value ? locationSelect.options[locationSelect.selectedIndex].text : 'Not specified'}</div>
            <div class="review-item"><span class="review-label">How you heard about us:</span> ${referralSelect.value ? referralSelect.options[referralSelect.selectedIndex].text : 'Not specified'}</div>
            <div class="review-item"><span class="review-label">Newsletter:</span> ${formData.get('newsletter') ? 'Yes' : 'No'}</div>
            <div class="review-item"><span class="review-label">Files attached:</span> ${document.querySelectorAll('.uploaded-file').length} files</div>
        `;
    }
    
    // Navigation event listeners
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateStep(currentStep);
        }
    });
    
    prevBtn.addEventListener('click', () => {
        currentStep--;
        updateStep(currentStep);
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            // Simulate form submission
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you within 48 hours.', 'success');
                form.reset();
                currentStep = 1;
                updateStep(currentStep);
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                submitBtn.disabled = false;
                
                // Clear uploaded files
                document.getElementById('uploaded-files').innerHTML = '';
            }, 2000);
        }
    });
    
    // Initialize first step
    updateStep(currentStep);
}

// Live chat functionality
function initializeLiveChat() {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${isUser ? 'fa-user' : 'fa-user-tie'}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Auto-respond for demo
        if (isUser) {
            setTimeout(() => {
                const responses = [
                    "Thank you for your message. Let me connect you with the right team member.",
                    "I understand your inquiry. Someone from our team will be with you shortly.",
                    "That's a great question! Let me get you the information you need.",
                    "I'll make sure your request gets to the appropriate department right away."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse);
            }, 1000 + Math.random() * 2000);
        }
    }
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
        }
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.dataset.message;
            addMessage(message, true);
        });
    });
}

// Appointment scheduling functionality
function initializeAppointmentScheduler() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const timeSlots = document.querySelectorAll('.time-slot');
    const bookBtn = document.getElementById('book-appointment');
    
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    function generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.textAlign = 'center';
            dayHeader.style.padding = '0.5rem';
            dayHeader.style.color = 'var(--primary-color)';
            calendarGrid.appendChild(dayHeader);
        });
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.className = 'calendar-day';
            
            const dayDate = new Date(year, month, day);
            const today = new Date();
            
            // Mark as available if it's a future weekday
            if (dayDate > today && dayDate.getDay() !== 0 && dayDate.getDay() !== 6) {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => selectDate(dayDate, dayElement));
            } else {
                dayElement.classList.add('unavailable');
            }
            
            calendarGrid.appendChild(dayElement);
        }
        
        currentMonthElement.textContent = `${months[month]} ${year}`;
    }
    
    function selectDate(date, element) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Select new date
        element.classList.add('selected');
        selectedDate = date;
        
        // Update time slots availability (simulate some being unavailable)
        timeSlots.forEach((slot, index) => {
            slot.classList.remove('selected', 'unavailable');
            if (Math.random() > 0.7) { // 30% chance of being unavailable
                slot.classList.add('unavailable');
            }
        });
        
        updateBookButton();
    }
    
    function selectTime(timeElement) {
        if (timeElement.classList.contains('unavailable')) return;
        
        // Remove previous selection
        timeSlots.forEach(slot => slot.classList.remove('selected'));
        
        // Select new time
        timeElement.classList.add('selected');
        selectedTime = timeElement.dataset.time;
        
        updateBookButton();
    }
    
    function updateBookButton() {
        bookBtn.disabled = !(selectedDate && selectedTime);
    }
    
    // Event listeners
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => selectTime(slot));
    });
    
    bookBtn.addEventListener('click', () => {
        if (selectedDate && selectedTime) {
            const appointmentType = document.getElementById('appointment-type').value;
            const notes = document.getElementById('appointment-notes').value;
            
            // Simulate booking
            bookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            bookBtn.disabled = true;
            
            setTimeout(() => {
                const dateString = selectedDate.toLocaleDateString();
                const timeString = selectedTime;
                showNotification(`Appointment booked for ${dateString} at ${timeString}. You'll receive a confirmation email shortly.`, 'success');
                
                // Reset form
                selectedDate = null;
                selectedTime = null;
                document.querySelectorAll('.calendar-day.selected, .time-slot.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                document.getElementById('appointment-notes').value = '';
                
                bookBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Book Appointment';
                updateBookButton();
            }, 2000);
        }
    });
    
    // Initialize calendar
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

// File upload functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('contact-files');
    const uploadArea = document.getElementById('file-upload-area');
    const uploadedFiles = document.getElementById('uploaded-files');
    const uploadLink = uploadArea.querySelector('.upload-link');
    
    let files = [];
    
    function handleFiles(fileList) {
        Array.from(fileList).forEach(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                showNotification(`File "${file.name}" is too large. Maximum size is 10MB.`, 'error');
                return;
            }
            
            if (files.find(f => f.name === file.name)) {
                showNotification(`File "${file.name}" is already uploaded.`, 'error');
                return;
            }
            
            files.push(file);
            addFileToList(file);
        });
    }
    
    function addFileToList(file) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'uploaded-file';
        
        const fileSize = (file.size / 1024).toFixed(1) + ' KB';
        if (file.size > 1024 * 1024) {
            fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        }
        
        fileDiv.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file file-icon"></i>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
            <button type="button" class="remove-file" data-filename="${file.name}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        uploadedFiles.appendChild(fileDiv);
        
        // Add remove functionality
        fileDiv.querySelector('.remove-file').addEventListener('click', () => {
            files = files.filter(f => f.name !== file.name);
            fileDiv.remove();
        });
    }
    
    // Event listeners
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        e.target.value = ''; // Reset input
    });
    
    uploadLink.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

// Form validation functionality
function initializeFormValidation() {
    const messageTextarea = document.getElementById('contact-message');
    const characterCount = document.querySelector('.character-count');
    
    // Character count for message
    if (messageTextarea && characterCount) {
        const maxLength = 2000;
        const currentSpan = characterCount.querySelector('.current');
        
        messageTextarea.addEventListener('input', () => {
            const length = messageTextarea.value.length;
            currentSpan.textContent = length;
            
            characterCount.classList.remove('warning', 'error');
            if (length > maxLength * 0.8) {
                characterCount.classList.add('warning');
            }
            if (length > maxLength) {
                characterCount.classList.add('error');
                messageTextarea.value = messageTextarea.value.substring(0, maxLength);
                currentSpan.textContent = maxLength;
            }
        });
    }
    
    // Real-time validation for all inputs
    const inputs = document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

// Utility functions
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    } else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        message = 'Please enter a valid phone number';
    }
    
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, message);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const validation = field.parentNode.querySelector('.field-validation');
    if (validation) {
        validation.textContent = message;
        validation.className = 'field-validation error';
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const validation = field.parentNode.querySelector('.field-validation');
    if (validation) {
        validation.textContent = '';
        validation.className = 'field-validation';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Initialize Contact page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the Contact page
    if (window.location.pathname.includes('Contact') || document.querySelector('.contact-stats')) {
        initializeContactPage();
    }
});

