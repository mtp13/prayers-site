# AGENTS.md

This file contains guidelines for agentic coding assistants working on this Jekyll-based prayers site repository.

## Project Overview

This is a Jekyll static site generator project that creates a Catholic Rosary prayers website. The site uses:
- **Jekyll 4.4.1** as the static site generator
- **Minima theme** as the base theme
- **Kramdown** for Markdown processing
- **Liquid templating** for dynamic content
- **Collections** for organizing prayers and mysteries
- **Ruby/Bundler** for dependency management

## Build and Development Commands

### Prerequisites
```bash
# Install Ruby dependencies (run first)
bundle install
```

### Development Server
```bash
# Start local development server with live reload
bundle exec jekyll serve

# Start with draft posts
bundle exec jekyll serve --drafts

# Start with specific host/port
bundle exec jekyll serve --host 0.0.0.0 --port 4000
```

### Build Commands
```bash
# Build the site for production
bundle exec jekyll build

# Clean and rebuild
bundle exec jekyll clean && bundle exec jekyll build
```

### Linting and Validation
```bash
# Markdown linting (if .markdownlint.json is present)
npx markdownlint "**/*.md" --config .markdownlint.json

# Alternative markdownlint if available globally
markdownlint "**/*.md" --config .markdownlint.json
```

### Testing
This project currently has no automated tests. For any future testing:
- Check for Ruby test frameworks in Gemfile
- Look for test directories (test/, spec/, features/)
- Run tests with `bundle exec rake test` or `bundle exec rspec` if available

## Code Style Guidelines

### File Organization
```
├── _config.yml          # Jekyll configuration
├── _includes/           # Reusable Liquid templates
├── _layouts/            # Page layout templates
├── _prayers/            # Prayer collection items
├── _mysteries/          # Mystery collection items
├── assets/              # CSS, JS, images
├── index.md             # Homepage
├── about.md             # About page
├── 404.html             # Custom 404 page
└── bible_script.py      # Python scripture fetching utility
```

### Markdown Files
- **Front Matter**: All content files must have YAML front matter
- **Line Length**: Max 120 characters (per .markdownlint.json)
- **Indentation**: 2 spaces for Markdown files
- **File Naming**: Use lowercase with underscores (snake_case)

#### Front Matter Structure
```yaml
---
layout: [layout_name]           # Required: default, page, prayer, mystery
title: "Page Title"            # Required: Display title
order: [number]                 # Optional: For sorting collections
permalink: /custom-path/        # Optional: Custom URL
mysteries:                      # For mystery files only
  - "First Mystery Name"
  - "Second Mystery Name"
---
```

### Liquid Templating
- **Indentation**: 2 spaces for Liquid code blocks
- **Variable Naming**: Use snake_case for custom variables
- **Conditionals**: Use `{% if %}...{% endif %}` with proper spacing
- **Loops**: Use `{% for %}...{% endfor %}` with descriptive iterator names

#### Common Patterns
```liquid
# Sorting collections
{% assign sorted_items = site.collection_name | sort: 'order' %}

# Date formatting
{{ 'now' | date: '%A, %B %d, %Y' }}

# Conditional content based on day of week
{% assign current_day = 'now' | date: '%u' %}
{% if current_day == '1' %}
  <!-- Monday content -->
{% endif %}
```

### Python Script (bible_script.py)
- **Indentation**: 4 spaces (Python standard)
- **Line Length**: Max 100 characters (per .editorconfig)
- **Imports**: Group standard library imports first, then third-party
- **Error Handling**: Use specific exceptions with descriptive messages
- **Docstrings**: Add docstrings for functions with parameters and return types

### Configuration Files
- **_config.yml**: Follow Jekyll's configuration structure
- **.editorconfig**: Maintain consistent editor settings
- **.markdownlint.json**: Define Markdown linting rules
- **Gemfile**: Use specific version pinning for Ruby gems

### HTML Includes and Layouts
- **Semantic HTML**: Use appropriate HTML5 semantic elements
- **CSS Classes**: Use kebab-case for class names
- **Accessibility**: Include proper ARIA labels and semantic structure
- **Responsive Design**: Ensure mobile-friendly layouts

### Content Guidelines
- **Scripture Citations**: Use format "Book Chapter:Verse" (e.g., "Luke 1:26-38")
- **Prayer Text**: Maintain original formatting and capitalization
- **Mystery Structure**: Include Scripture, Meditation, and Fruit sections
- **Titles**: Use title case for page and prayer titles

### Naming Conventions
- **Files**: snake_case for all file names
- **Collections**: plural names (prayers, mysteries)
- **Variables**: snake_case in Liquid and Python
- **CSS Classes**: kebab-case
- **Page Titles**: Title Case with proper capitalization

### Git and Repository
- **Branches**: Use descriptive branch names
- **Commits**: Follow conventional commit format if established
- **Ignore Files**: Respect .gitignore (excludes _site/, vendor/, .bundle/)
- **Deploy**: Site configured for Vercel deployment

## Important Notes
- **No Node.js**: This is a Ruby/Jekyll project, avoid npm commands
- **Static Site**: All content is static; no server-side processing beyond build
- **Collections**: Use Jekyll collections for organized content management
- **Permalinks**: Custom permalinks configured for SEO-friendly URLs
- **Plugins**: Minimal plugin usage (jekyll-feed, jekyll-sitemap only)