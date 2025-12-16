// Page Navigation Function
function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Close mobile menu if open
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        $('.navbar-collapse').collapse('hide');
    }
}

// Form Validation
function validateForm() {
    const businessName = document.getElementById('businessName').value.trim();
    const contactPerson = document.getElementById('contactPerson').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();
    const inquiryType = document.getElementById('inquiryType').value;
    const message = document.getElementById('message').value.trim();
    
    // Check required fields
    if (!businessName || !contactPerson || !email || !phone || !location || !inquiryType || !message) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    // Validate phone format (basic)
    const phonePattern = /^[\d\s\-\(\)\+]+$/;
    if (!phonePattern.test(phone)) {
        alert('Please enter a valid phone number.');
        return false;
    }
    
    return true;
}

// Get selected products from checkboxes
function getSelectedProducts() {
    const products = [];
    if (document.getElementById('timothy').checked) {
        products.push('Timothy Hay');
    }
    if (document.getElementById('alfalfa').checked) {
        products.push('Alfalfa Hay');
    }
    if (document.getElementById('both').checked) {
        products.push('Both Products');
    }
    return products.join(', ') || 'None selected';
}

// Form Submission Handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return false;
    }
    
    // Gather form data
    const formData = {
        businessName: document.getElementById('businessName').value,
        contactPerson: document.getElementById('contactPerson').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        inquiryType: document.getElementById('inquiryType').value,
        products: getSelectedProducts(),
        volume: document.getElementById('volume').value || 'Not specified',
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Send data to backend
    fetch('php/contact_handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        if (data.success) {
            // Show success message
            const successMsg = document.getElementById('successMessage');
            successMsg.classList.add('show');
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMsg.classList.remove('show');
            }, 5000);
            
            // Log to console (for development)
            console.log('Form submitted successfully:', formData);
        } else {
            alert('There was an error submitting your inquiry. Please try again or contact us directly.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        alert('There was an error submitting your inquiry. Please try again or contact us directly.');
    });
    
    return false;
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

// Initialize animations on scroll (optional)
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe elements
    document.querySelectorAll('.product-card, .feature-box, .client-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPlus = target.includes('+');
        const isPercent = target.includes('%');
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
        
        let current = 0;
        const increment = numericValue / 50; // Adjust speed here
        
        const updateCounter = () => {
            if (current < numericValue) {
                current += increment;
                let displayValue = Math.ceil(current);
                if (isPlus) displayValue += '+';
                if (isPercent) displayValue += '%';
                counter.textContent = displayValue;
                setTimeout(updateCounter, 30);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialize product filtering (if needed in future)
function initProductFilter() {
    // Placeholder for future product filtering functionality
    console.log('Product filter initialized');
}

// Handle product inquiry buttons
function handleProductInquiry(productName) {
    showPage('contact');
    
    // Pre-fill the form with product selection
    setTimeout(() => {
        if (productName === 'Timothy Hay') {
            document.getElementById('timothy').checked = true;
        } else if (productName === 'Alfalfa Hay') {
            document.getElementById('alfalfa').checked = true;
        }
        
        // Scroll to form
        const form = document.getElementById('contactForm');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }, 300);
}

// Document Ready - Initialize all functions
document.addEventListener('DOMContentLoaded', function() {
    console.log('A-OK Hay website loaded');
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize scroll animations (optional)
    // initScrollAnimations();
    
    // Animate counters
    animateCounters();
    
    // Attach form submit handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Set home page as active by default
    showPage('home');
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            showPage(e.state.page);
        }
    });
});

// Export functions for use in inline onclick handlers
window.showPage = showPage;
window.handleProductInquiry = handleProductInquiry;