// Project filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.project-filters .btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            projectCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    card.style.display = cardCategory === category ? 'block' : 'none';
                }
            });

            // Trigger AOS refresh for smooth animations
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    });
});

// Add smooth scroll animation for project cards
document.querySelectorAll('.card').forEach(card => {
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-duration', '1000');
}); 