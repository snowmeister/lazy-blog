# Lazy Blog Template

A simple, accessible, and lightweight file-based blog template built with vanilla JavaScript, HTML, and CSS. No database required.

This project provides a "quick and dirty" frontend-only blog that is easy to set up and customize. Blog posts are written in simple Markdown files, and a Node.js script generates the necessary index for the frontend to display them.

## Features

- **Simple & File-Based**: No database or complex backend setup needed.
- **Markdown Support**: Write your posts in `.md` files using standard Markdown syntax.
- **Responsive Design**: A clean layout that works on desktop and mobile devices.
- **Accessible**: Includes an accessible off-canvas mobile menu with focus management and keyboard navigation.
- **Tag Filtering**: Automatically generates a list of tags to filter posts.
- **Pagination**: Simple "Previous" and "Next" controls to navigate through posts.
- **Easy to Customize**: Change the look and feel by editing CSS variables.

---

## Getting Started

Follow these steps to set up your own blog using this template.

### Prerequisites

- You need to have [Node.js](https://nodejs.org/) and `npm` installed to run the post-indexing script.

### 1. Set Up the Project

First, clone this repository to your local machine:

```bash
git clone https://github.com/snowmeister/lazy-blog
cd your-repo-name
```

Next, install the single development dependency (`gray-matter`) required for the build script:

```bash
npm install
```

### 2. Add Your Content

- **Posts**: Add your blog posts as `.md` files inside the `/posts` directory. You can delete the example posts.
- **Images**: Add any images you want to use in your posts to the `/images` directory.

Each post **must** begin with a YAML front matter block to define its metadata. The `title` and `tags` fields are required.

**Example (`/posts/my-first-post.md`):**

```markdown
---
title: "My First Post"
tags:
  - introduction
  - general
---

This is the content of my first post, written in Markdown.

To include an image, use the following syntax:

![An image description](../images/my-cool-image.png)
```

### 3. Build the Post Index

After adding, deleting, or modifying the front matter of any post, you must run the indexer script. This script scans your `/posts` directory and creates the `posts.json` file that the frontend uses.

```bash
node scripts/generate-index.js
```

### 4. Run Locally

Since this is a static website, you can open `index.html` directly in your browser. However, for best results (to avoid potential CORS issues with `fetch`), it's recommended to use a simple local server.

If you use VS Code, the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension is a great option.

---

## Customization

### Site Title & Header

To change the main title of your blog, edit the following lines in `index.html`:

- The `<title>` tag in the `<head>`.
- The `<h1>` tag in the `<header>`.

### Styling

To change the colors, fonts, or other core styles, edit the CSS variables at the top of the `/css/style.css` file. This is the easiest way to re-theme the entire site.

```css
:root {
    --font-heading: 'Poppins', sans-serif;
    --font-body: 'Poppins', sans-serif;
    --color-text: #555;
    --color-primary: #355e5e;
    /* ...and so on ... */
}
```

## License

This project is open source and available under the [MIT License](LICENSE).
