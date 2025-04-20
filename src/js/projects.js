// Projects page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load projects data
    loadProjects();
    
    // Initialize filter functionality
    initProjectFilters();
});

// Load projects from CSV
async function loadProjects() {
    try {
        const response = await fetch('data/projects.csv');
        const csvText = await response.text();
        const projects = parseCSV(csvText);
        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        showError('Failed to load projects. Please try again later.');
    }
}

// Parse CSV text into array of objects
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const project = {};
        headers.forEach((header, index) => {
            project[header.trim()] = values[index] ? values[index].trim() : '';
        });
        return project;
    });
}

// Display projects in the grid
function displayProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-image">
                <img src="images/${project.image}" alt="${project.title}" class="lazy">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.split(',').map(tech => `
                        <span class="tech-tag">${tech.trim()}</span>
                    `).join('')}
                </div>
                <div class="project-links">
                    ${project.github_url ? `
                        <a href="${project.github_url}" class="btn btn-outline-primary" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-github me-2"></i>GitHub
                        </a>
                    ` : ''}
                    ${project.live_url ? `
                        <a href="${project.live_url}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt me-2"></i>Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Initialize lazy loading for images
    common.initLazyLoading();
}

// Initialize project filters
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filters .btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter projects
            projectCards.forEach(card => {
                const technologies = card.querySelector('.project-tech').textContent.toLowerCase();
                if (filter === 'all' || technologies.includes(filter.toLowerCase())) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('show'), 10);
                } else {
                    card.classList.remove('show');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// Show error message
function showError(message) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        projectsGrid.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>${message}
            </div>
        `;
    }
}

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