// Projects page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load projects data
    loadProjects();
});

// Load projects from CSV
async function loadProjects() {
    try {
        showLoading();
        const response = await fetch('data/projects.csv');
        const csvText = await response.text();
        const projects = parseCSV(csvText);
        displayProjects(projects);
        showProjects();
        // Initialize filter functionality
        initProjectFilters(projects);
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
            project[header.trim()] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
        });
        return project;
    });
}

// Display projects in the grid
function displayProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-aos="fade-up" data-technologies="${project.technologies.toLowerCase()}">
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

    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Function to show loading state
function showLoading() {
    const loadingMessage = document.getElementById('loadingMessage');
    const projectsGrid = document.querySelector('.projects-grid');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loadingMessage) loadingMessage.style.display = 'flex';
    if (projectsGrid) projectsGrid.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
}

// Function to show error state
function showError(message) {
    const loadingMessage = document.getElementById('loadingMessage');
    const projectsGrid = document.querySelector('.projects-grid');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (projectsGrid) projectsGrid.style.display = 'none';
    if (errorMessage) {
        errorMessage.style.display = 'block';
        const alertElement = errorMessage.querySelector('.alert');
        if (alertElement) alertElement.textContent = message;
    }
}

// Function to show projects
function showProjects() {
    const loadingMessage = document.getElementById('loadingMessage');
    const projectsGrid = document.querySelector('.projects-grid');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (projectsGrid) projectsGrid.style.display = 'grid';
    if (errorMessage) errorMessage.style.display = 'none';
}

// Initialize project filters
function initProjectFilters(projects) {
    const filterButtons = document.querySelectorAll('.project-filters .btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter').toLowerCase();
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                const technologies = card.getAttribute('data-technologies').toLowerCase();
                const techArray = technologies.split(',').map(t => t.trim());
                
                if (filter === 'all') {
                    card.style.display = 'block';
                    card.classList.add('show');
                } else if (filter === 'machine-learning') {
                    // Special case for machine learning projects
                    const mlTechs = ['tensorflow', 'scikit-learn', 'machine learning'];
                    const isML = techArray.some(tech => mlTechs.some(mlTech => tech.includes(mlTech)));
                    if (isML) {
                        card.style.display = 'block';
                        card.classList.add('show');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('show');
                    }
                } else {
                    // Regular technology filter
                    if (techArray.some(tech => tech.includes(filter))) {
                        card.style.display = 'block';
                        card.classList.add('show');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('show');
                    }
                }
            });

            // Refresh AOS animations
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    });
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
                const technologies = card.getAttribute('data-technologies').split(' ');
                const shouldShow = filter === 'all' || technologies.includes(filter);

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
                const tags = card.getAttribute('data-technologies').toLowerCase();

                const matches = title.includes(searchTerm) || 
                              description.includes(searchTerm) || 
                              tags.includes(searchTerm);

                card.style.display = matches ? 'block' : 'none';
            });
        });
    }
}); 