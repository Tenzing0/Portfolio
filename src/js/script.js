// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

// Update scroll progress
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links
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

// Animate timeline items on scroll
const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.5s ease forwards';
        }
    });
}, {
    threshold: 0.1
});

timelineItems.forEach(item => {
    observer.observe(item);
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Update active nav link based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Book Filtering Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.book-filters .btn');
    const bookCards = document.querySelectorAll('.book-card');
    const searchInput = document.getElementById('bookSearch');
    
    // Function to filter books
    const filterBooks = (genre, searchTerm = '') => {
        bookCards.forEach(card => {
            const cardGenres = card.getAttribute('data-genres').toLowerCase();
            const bookTitle = card.querySelector('h3').textContent.toLowerCase();
            const bookAuthor = card.querySelector('.author').textContent.toLowerCase();
            const bookDescription = card.querySelector('p').textContent.toLowerCase();
            
            const matchesGenre = genre === 'all' || cardGenres.includes(genre.toLowerCase());
            const matchesSearch = searchTerm === '' || 
                bookTitle.includes(searchTerm) || 
                bookAuthor.includes(searchTerm) || 
                bookDescription.includes(searchTerm);
            
            if (matchesGenre && matchesSearch) {
                card.style.display = 'block';
                // Trigger animation
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                card.style.display = 'none';
            }
        });
    };
    
    // Handle filter button clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const selectedGenre = this.getAttribute('data-filter');
            const searchTerm = searchInput.value.toLowerCase();
            filterBooks(selectedGenre, searchTerm);
        });
    });
    
    // Handle search input
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const activeFilter = document.querySelector('.book-filters .btn.active');
        const selectedGenre = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        filterBooks(selectedGenre, searchTerm);
    });
}); 