// Function to fetch and parse CSV data
async function fetchBooksData() {
    try {
        console.log('Starting to fetch books data...');
        const response = await fetch('./books.csv');
        console.log('Response status:', response.status);
        console.log('Response OK:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvData = await response.text();
        console.log('CSV Data received:', csvData.substring(0, 100) + '...');
        
        const books = parseCSV(csvData);
        console.log('Parsed books:', books);
        
        if (books.length === 0) {
            throw new Error('No books found in CSV');
        }
        return books;
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        showError(`Failed to load books: ${error.message}`);
        return [];
    }
}

// Function to parse CSV data
function parseCSV(csv) {
    console.log('Starting CSV parsing...');
    const lines = csv.split('\n').filter(line => line.trim());
    console.log('Number of lines found:', lines.length);
    
    if (lines.length < 2) {
        console.error('CSV file is empty or has no data rows');
        throw new Error('CSV file is empty or has no data rows');
    }

    const headers = lines[0].split(',').map(header => header.trim());
    console.log('Headers found:', headers);
    
    const books = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
            console.log(`Skipping empty line ${i}`);
            continue;
        }

        const values = line.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
        console.log(`Line ${i} values:`, values);
        
        if (values.length !== headers.length) {
            console.warn(`Line ${i} has incorrect number of values:`, {
                expected: headers.length,
                got: values.length,
                line: line
            });
            continue;
        }

        const book = {};
        headers.forEach((header, index) => {
            book[header] = values[index];
        });
        
        books.push(book);
    }
    
    console.log('Total books parsed:', books.length);
    return books;
}

// Function to show loading state
function showLoading() {
    console.log('Showing loading state...');
    const loadingMessage = document.getElementById('loadingMessage');
    const booksContainer = document.getElementById('booksContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!loadingMessage || !booksContainer || !errorMessage) {
        console.error('Missing required DOM elements:', {
            loadingMessage: !!loadingMessage,
            booksContainer: !!booksContainer,
            errorMessage: !!errorMessage
        });
        return;
    }
    
    loadingMessage.style.display = 'block';
    booksContainer.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Function to show error state
function showError(message) {
    console.log('Showing error:', message);
    const loadingMessage = document.getElementById('loadingMessage');
    const booksContainer = document.getElementById('booksContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!loadingMessage || !booksContainer || !errorMessage) {
        console.error('Missing required DOM elements for error state');
        return;
    }
    
    loadingMessage.style.display = 'none';
    booksContainer.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.querySelector('.alert').textContent = message;
}

// Function to show books
function showBooks() {
    console.log('Showing books...');
    const loadingMessage = document.getElementById('loadingMessage');
    const booksContainer = document.getElementById('booksContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!loadingMessage || !booksContainer || !errorMessage) {
        console.error('Missing required DOM elements for showing books');
        return;
    }
    
    loadingMessage.style.display = 'none';
    booksContainer.style.display = 'flex';
    errorMessage.style.display = 'none';
}

// Function to create book card HTML
function createBookCard(book) {
    const stars = generateStars(parseFloat(book.rating));
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="book-card" data-genres="${book.genres}">
                <div class="book-image">
                    <img src="${book.image_url}" alt="${book.title}" class="img-fluid" loading="lazy">
                </div>
                <div class="book-content">
                    <h3>${book.title}</h3>
                    <p class="author">${book.author}</p>
                    <p>${book.description}</p>
                    <div class="book-tags">
                        ${book.tags.split(' ').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                    </div>
                    <div class="book-rating">
                        ${stars}
                        <span class="rating-text">${book.rating_text}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Function to filter books
function filterBooks(books, filter) {
    if (filter === 'all') return books;
    return books.filter(book => book.genres.split(' ').some(genre => genre.trim().toLowerCase() === filter.toLowerCase()));
}

// Function to search books
function searchBooks(books, query) {
    if (!query) return books;
    const lowerQuery = query.toLowerCase();
    return books.filter(book => 
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.description.toLowerCase().includes(lowerQuery) ||
        book.tags.toLowerCase().includes(lowerQuery)
    );
}

// Initialize the books page
async function initializeBooksPage() {
    console.log('Initializing books page...');
    showLoading();
    
    try {
        const books = await fetchBooksData();
        console.log('Books data loaded:', books);
        
        if (books.length === 0) {
            console.error('No books found in data');
            showError('No books found.');
            return;
        }

        const booksContainer = document.getElementById('booksContainer');
        const filterButtons = document.querySelectorAll('.book-filters .btn');
        const searchInput = document.getElementById('bookSearch');
        
        if (!booksContainer) {
            console.error('Books container not found');
            showError('Error: Could not find books container');
            return;
        }
        
        // Render initial books
        function renderBooks(booksToRender) {
            console.log('Rendering books:', booksToRender.length);
            if (booksToRender.length === 0) {
                booksContainer.innerHTML = '<div class="col-12 text-center"><p>No books match your criteria.</p></div>';
            } else {
                booksContainer.innerHTML = booksToRender.map(createBookCard).join('');
                // Add visible class to cards after a short delay for animation
                setTimeout(() => {
                    document.querySelectorAll('.book-card').forEach(card => {
                        card.classList.add('visible');
                    });
                }, 100);
            }
            showBooks();
        }
        
        // Initial render
        renderBooks(books);
        
        // Set up event listeners
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('Filter clicked:', button.dataset.filter);
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                const searchQuery = searchInput.value;
                const filteredBooks = filterBooks(books, filter);
                const searchedBooks = searchBooks(filteredBooks, searchQuery);
                renderBooks(searchedBooks);
            });
        });
        
        searchInput.addEventListener('input', () => {
            console.log('Search input:', searchInput.value);
            const searchQuery = searchInput.value;
            const activeFilter = document.querySelector('.book-filters .btn.active').dataset.filter;
            const filteredBooks = filterBooks(books, activeFilter);
            const searchedBooks = searchBooks(filteredBooks, searchQuery);
            renderBooks(searchedBooks);
        });
        
    } catch (error) {
        console.error('Error in initialization:', error);
        showError('An error occurred while loading the books.');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting initialization...');
    initializeBooksPage();
}); 