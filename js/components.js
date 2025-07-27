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

