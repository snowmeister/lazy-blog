document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const postListUl = document.getElementById('posts-list-ul');
    const postContent = document.getElementById('post-content');
    const tagFilterContainer = document.getElementById('tag-filter');
    const paginationContainer = document.getElementById('pagination-container');
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const postsListNav = document.getElementById('posts-list');

    // --- Mobile Menu Logic ---
    const openMenu = () => {
        postsListNav.classList.add('is-visible');
        postsListNav.setAttribute('aria-hidden', 'false');
        menuClose.focus(); // Move focus to the close button
        document.addEventListener('keydown', trapFocus);
    };

    const closeMenu = () => {
        postsListNav.classList.remove('is-visible');
        postsListNav.setAttribute('aria-hidden', 'true');
        menuToggle.focus(); // Return focus to the menu toggle button
        document.removeEventListener('keydown', trapFocus);
    };

    if (menuToggle && postsListNav) {
        menuToggle.addEventListener('click', openMenu);
    }

    if (menuClose && postsListNav) {
        menuClose.addEventListener('click', closeMenu);
    }

    // --- Focus Trap Logic ---
    const trapFocus = (e) => {
        if (e.key !== 'Tab') return;

        const focusableElements = postsListNav.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };

    // Close menu when a post link is clicked
    if (postListUl && postsListNav) {
        postListUl.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                closeMenu();
            }
        });
    }

    // --- State ---
    let allPosts = [];
    let filteredPosts = [];
    let currentPage = 1;
    const postsPerPage = 5;

    /**
     * Formats an ISO date string into "DD MMM YYYY" format.
     * @param {string} dateString - The ISO date string to format.
     * @returns {string} The formatted date string.
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    /**
     * Fetches a post's markdown content and renders it as HTML.
     * @param {string} postFile - The filename of the post to load.
     * @param {string} postDate - The date of the post.
     */
    const loadPost = async (postFile, postDate) => {
        try {
            const response = await fetch(`posts/${postFile}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawContent = await response.text();
            const markdown = rawContent.replace(/^---[\s\S]*?---/, '').trim();
            const post = allPosts.find(p => p.file === postFile);

            const titleHtml = post ? `<h1>${post.title}</h1>` : '';
            const tagsHtml = post && post.tags.length > 0
                ? `<div class="tags-container">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
                : '';
            const dateHtml = postDate ? `<p class="post-meta">${formatDate(postDate)}</p>` : '';

            postContent.innerHTML = `<div class="post-header">${dateHtml}${titleHtml}</div>` + tagsHtml + marked.parse(markdown);

            document.querySelectorAll('nav#posts-list li a').forEach(a => a.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${postFile}"]`);
            if (activeLink) activeLink.classList.add('active');

        } catch (error) {
            console.error('Error loading post:', error);
            postContent.innerHTML = `<p>Error loading post. Please check the console for details.</p>`;
        }
    };

    /**
     * Renders the pagination controls (Previous/Next buttons).
     */
    const renderPaginationControls = () => {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

        if (totalPages <= 1) return;

        const createButton = (text, onClick, disabled) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.disabled = disabled;
            button.addEventListener('click', onClick);
            return button;
        };

        const prevButton = createButton('Previous', () => {
            currentPage--;
            renderPostsForPage();
        }, currentPage === 1);

        const nextButton = createButton('Next', () => {
            currentPage++;
            renderPostsForPage();
        }, currentPage === totalPages);
        
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        pageInfo.className = 'page-info';

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(nextButton);
    };

    /**
     * Renders the list of posts for the current page.
     */
    const renderPostsForPage = () => {
        postListUl.innerHTML = '';
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const postsToShow = filteredPosts.slice(start, end);

        if (postsToShow.length === 0 && currentPage === 1) {
            postListUl.innerHTML = '<li>No posts found.</li>';
            postContent.innerHTML = '<p>Select a post from the list to read it, or try a different filter.</p>';
        } else {
            postsToShow.forEach(post => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${post.file}`;
                a.innerHTML = `${post.title}<br><small class="post-date-nav">${formatDate(post.date)}</small>`;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadPost(post.file, post.date);
                });
                li.appendChild(a);
                postListUl.appendChild(li);
            });

            if (postsToShow.length > 0) {
                loadPost(postsToShow[0].file, postsToShow[0].date);
            }
        }
        renderPaginationControls();
    };

    /**
     * Filters posts by a tag and triggers a re-render.
     * @param {string|null} activeTag - The tag to filter by.
     */
    const filterAndRender = (activeTag = null) => {
        filteredPosts = activeTag
            ? allPosts.filter(post => post.tags.includes(activeTag))
            : [...allPosts];
        currentPage = 1;
        renderPostsForPage();
    };

    /**
     * Renders the tag filter buttons.
     */
    const renderTagFilters = () => {
        const allTags = [...new Set(allPosts.flatMap(post => post.tags))];
        tagFilterContainer.innerHTML = '';

        const createButton = (text, tag) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = 'tag-button';
            button.addEventListener('click', () => {
                document.querySelectorAll('.tag-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterAndRender(tag);
            });
            return button;
        };

        const allButton = createButton('All Posts', null);
        allButton.classList.add('active');
        tagFilterContainer.appendChild(allButton);

        allTags.sort().forEach(tag => {
            tagFilterContainer.appendChild(createButton(tag, tag));
        });
    };

    /**
     * Main initialization function.
     */
    const init = async () => {
        try {
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allPosts = await response.json();
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (allPosts.length === 0) {
                postListUl.innerHTML = '<li>No posts found.</li>';
                return;
            }

            renderTagFilters();
            filterAndRender(null);

        } catch (error) {
            console.error('Error initializing blog:', error);
            postListUl.innerHTML = `<li>Could not load post index. Is posts.json present?</li>`;
        }
    };

    init();
});
