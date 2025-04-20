document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for contact links
    document.querySelectorAll('a[href^="#contact"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Download CV button functionality
    const downloadCvButtons = document.querySelectorAll('.download-cv');
    downloadCvButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your CV download logic here
            alert('CV download functionality will be implemented here');
        });
    });

    // Project filtering functionality
    const filterButtons = document.querySelectorAll('.project-filters .btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardCategory = card.getAttribute('data-categories');
                    card.style.display = cardCategory.includes(category) ? 'block' : 'none';
                }
            });

            // Trigger AOS refresh for smooth animations
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    });
}); 