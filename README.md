# Personal Portfolio Website

A modern, responsive portfolio website showcasing my projects, reading list, and food adventures.

## Project Structure

```
Portfolio Test/
├── docs/               # GitHub Pages deployment directory
│   ├── css/           # Stylesheets
│   ├── data/          # CSV data files
│   ├── images/        # Image assets
│   ├── js/            # JavaScript files
│   └── *.html         # HTML pages
├── src/               # Source files
│   ├── css/
│   ├── data/
│   ├── images/
│   ├── js/
│   └── *.html
└── README.md
```

## Features

- **Projects Page**: Showcase of technical projects with filtering by technology
- **Books Page**: Curated reading list with ratings and reviews
- **Food Trail**: Collection of favorite restaurants and food experiences
- **Responsive Design**: Mobile-friendly layout
- **Modern UI**: Clean, professional design with animations
- **Dynamic Content**: Content loaded from CSV files for easy updates
- **Filter & Search**: Easy navigation through projects and books

## Recent Updates

- Added Naval Ravikant's book cover image
- Updated project filtering functionality
- Enhanced CSS styles for better visual appeal
- Improved responsive design
- Added loading states and error handling

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- AOS (Animate On Scroll)
- Font Awesome Icons

## Local Development

To run the website locally:

1. Clone the repository
2. Navigate to the project directory
3. Start a local server:
   ```bash
   cd docs
   python3 -m http.server 8080
   ```
4. Visit `http://localhost:8080` in your browser

## Deployment

The website is deployed using GitHub Pages from the `/docs` directory. Any changes pushed to the main branch will be automatically deployed.

## Contributing

Feel free to submit issues and enhancement requests! 