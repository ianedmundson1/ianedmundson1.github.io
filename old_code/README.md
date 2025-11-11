# Ian Edmundson - Portfolio Website

[![MkDocs](https://img.shields.io/badge/docs-mkdocs-blue)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/material-mkdocs-blue)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/deployed-github%20pages-brightgreen)](https://ianedmundson1.github.io)

This repository contains the source code for my professional portfolio website, showcasing my work in data science, machine learning, and software engineering.

## 🌐 Live Site

Visit the live site at: [ianedmundson1.github.io](https://ianedmundson1.github.io)

## 🏗️ Built With

- **[MkDocs](https://www.mkdocs.org/)** - Static site generator
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** - Modern theme
- **[GitHub Pages](https://pages.github.com/)** - Hosting platform

## 📁 Repository Structure

```text
├── docs/                          # Documentation source files
│   ├── projects/                  # Project showcases
│   │   ├── computer-vision/       # CV projects
│   │   └── data-science/          # Data science projects
│   ├── books/                     # Book recommendations
│   ├── assets/                    # Shared images and media
│   └── scripts/                   # Build and utility scripts
├── extras/                        # Templates and additional resources
├── mkdocs.yml                     # MkDocs configuration
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

## 🚀 Local Development

### Prerequisites

- Python 3.8+
- pip

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ianedmundson1/ianedmundson.github.io.git
   cd ianedmundson.github.io
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Serve the site locally:

   ```bash
   mkdocs serve
   ```

4. Open your browser to `http://127.0.0.1:8000`

### Building for Production

```bash
mkdocs build
```

## 📝 Content Management

### Adding New Projects

1. Create a new directory in `docs/projects/`
2. Add your project documentation and assets
3. Update the navigation in `mkdocs.yml`

### Adding Book Reviews

1. Create a new directory in `docs/books/reviews/`
2. Use the template from `extras/book_review_template.md`
3. Update the books index page

## 🔄 Automated Content Updates

The site includes automated fetching of README files from external repositories using the `fetch_readme.py` script and `readme_config.yaml` configuration.

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome! Please feel free to:

1. Open an issue for bugs or suggestions
2. Submit a pull request for improvements
3. Share feedback on the content or structure

## 📧 Contact

- **GitHub**: [@ianedmundson1](https://github.com/ianedmundson1)
- **LinkedIn**: [Ian Edmundson](https://linkedin.com/in/ian-edmundson-a0979a178)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Last updated: August 2025
