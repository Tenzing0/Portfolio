document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.project-filters .btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Initialize with 'all' filter active
    document.querySelector('[data-filter="all"]').classList.add('active');

    // Filter button click handler
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-categories').split(' ');
                const shouldShow = filter === 'all' || categories.includes(filter);

                if (shouldShow) {
                    card.style.display = 'block';
                    // Trigger AOS refresh for smooth animations
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Initialize AOS for scroll animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Search functionality
    const searchInput = document.querySelector('#projectSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            projectCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const tags = card.getAttribute('data-categories').toLowerCase();

                const matches = title.includes(searchTerm) || 
                              description.includes(searchTerm) || 
                              tags.includes(searchTerm);

                card.style.display = matches ? 'block' : 'none';
            });
        });
    }
}); 