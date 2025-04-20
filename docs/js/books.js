// Function to fetch and parse CSV data
async function fetchBooksData() {
    try {
        const response = await fetch('data/books.csv');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvData = await response.text();
        const books = parseCSV(csvData);
        
        if (books.length === 0) {
            throw new Error('No books found in CSV');
        }
        return books;
    } catch (error) {
        console.error('Error loading books:', error);
        showError(`Failed to load books: ${error.message}`);
        return [];
    }
}

// Function to parse CSV data
function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
        throw new Error('CSV file is empty or has no data rows');
    }

    const headers = lines[0].split(',').map(header => header.trim());
    const books = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
        
        if (values.length !== headers.length) {
            console.warn(`Line ${i} has incorrect number of values`);
            continue;
        }

        const book = {};
        headers.forEach((header, index) => {
            book[header] = values[index];
        });
        
        books.push(book);
    }
    
    return books;
}

// Function to show loading state
function showLoading() {
    const loadingMessage = document.getElementById('loadingMessage');
    const booksContainer = document.getElementById('booksContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loadingMessage) loadingMessage.style.display = 'flex';
    if (booksContainer) booksContainer.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
}

// Function to show error state
function showError(message) {
    const loadingMessage = document.getElementById('loadingMessage');
    const booksContainer = document.getElementById('booksContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (booksContainer) booksContainer.style.display = 'none';
    if (errorMessage) {
        errorMessage.style.display = 'block';
        const alertElement = errorMessage.querySelector('.alert');
        if (alertElement) alertElement.textContent = message;
    }
}

// Function to show books
function showBooks() {
    const loadingMessage = document.getElementById('loadingMessage');
    const booksContainer = document.getElementById('booksContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (booksContainer) {
        booksContainer.style.display = 'flex';
        // Add visible class to all book cards after a short delay
        setTimeout(() => {
            const bookCards = booksContainer.querySelectorAll('.book-card');
            bookCards.forEach(card => card.classList.add('visible'));
        }, 100);
    }
    if (errorMessage) errorMessage.style.display = 'none';
}

// Function to create book card HTML
function createBookCard(book) {
    const stars = generateStars(parseFloat(book.rating));
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="book-card">
                <div class="book-image">
                    <img src="images/${book.image}" alt="${book.title}" class="img-fluid" loading="lazy">
                </div>
                <div class="book-content">
                    <h3>${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <p class="book-description">${book.description}</p>
                    <div class="book-tags">
                        <span class="tag">${book.genre}</span>
                    </div>
                    <div class="book-rating">
                        ${stars}
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

// Function to render books
function renderBooks(books) {
    const booksContainer = document.getElementById('booksContainer');
    if (!booksContainer) return;
    
    booksContainer.innerHTML = books.map(book => createBookCard(book)).join('');
}

// Initialize the books page
async function initializeBooksPage() {
    try {
        showLoading();
        const books = await fetchBooksData();
        if (books.length === 0) {
            showError('No books found');
            return;
        }
        
        renderBooks(books);
        showBooks();
    } catch (error) {
        console.error('Error initializing books page:', error);
        showError('Failed to initialize books page');
    }
}

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBooksPage);
} else {
    initializeBooksPage();
}

async function loadBooks() {
    try {
        const response = await fetch('data/books.csv');
        const csvText = await response.text();
        const books = parseCSV(csvText);
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('booksGrid').innerHTML = '<p class="text-center">Error loading books. Please try again later.</p>';
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const books = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [title, author, description, genre, rating, image] = line.split(',');
        books.push({
            title: title.trim(),
            author: author.trim(),
            description: description.trim(),
            genre: genre.trim(),
            rating: parseFloat(rating),
            image: image.trim()
        });
    }
    
    return books;
}

function displayBooks(books) {
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = '';
    
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-image">
                <img src="images/${book.image}" alt="${book.title}">
            </div>
            <div class="book-content">
                <h3>${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-description">${book.description}</p>
                <div class="book-tags">
                    <span class="tag">${book.genre}</span>
                </div>
                <div class="book-rating">
                    ${generateStars(book.rating)}
                </div>
            </div>
        `;
        booksGrid.appendChild(bookCard);
    });
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', loadBooks); 