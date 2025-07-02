const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

// --- Configuration ---
const POSTS_DIRECTORY = path.join(__dirname, '..', 'posts');
const NUMBER_OF_POSTS = 20;
const POSSIBLE_TAGS = ['tech', 'lifestyle', 'review', 'tutorial', 'opinion', 'news', 'random'];

// --- Helper Functions ---

/**
 * Creates a URL-friendly slug from a string.
 * @param {string} text - The text to slugify.
 * @returns {string} - The slugified text.
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Selects a random number of unique tags from the possible tags.
 * @returns {string[]} - An array of unique tags.
 */
const getRandomTags = () => {
    const numberOfTags = faker.number.int({ min: 1, max: 3 });
    const shuffled = faker.helpers.shuffle(POSSIBLE_TAGS);
    return shuffled.slice(0, numberOfTags);
};

// --- Main Script ---

const generateDummyPosts = () => {
    if (!fs.existsSync(POSTS_DIRECTORY)) {
        fs.mkdirSync(POSTS_DIRECTORY, { recursive: true });
    }

    console.log(`Generating ${NUMBER_OF_POSTS} dummy posts...`);

    for (let i = 0; i < NUMBER_OF_POSTS; i++) {
        const title = faker.lorem.sentence({ min: 4, max: 8 });
        const filename = `${slugify(title)}.md`;
        const filePath = path.join(POSTS_DIRECTORY, filename);

        const tags = getRandomTags();
        const date = faker.date.past({ years: 2 });

        const frontMatter = `---
title: "${title.replace(/"/g, '\\"')}"
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
---
`;

        const content = `
${faker.lorem.paragraphs(3, '\n\n')}

## ${faker.lorem.sentence()}

${faker.lorem.paragraphs(4, '\n\n')}

> ${faker.lorem.sentence()} - A wise person

${faker.lorem.paragraph()}
`;

        const fileContent = frontMatter + content;

        fs.writeFileSync(filePath, fileContent);

        // We need to manually set the modification time because our indexer relies on it.
        fs.utimesSync(filePath, date, date);
    }

    console.log(`✅ Successfully created ${NUMBER_OF_POSTS} dummy posts in '${POSTS_DIRECTORY}'.`);
    console.log("Don't forget to run `node scripts/generate-index.js` to update the post index!");
};

generateDummyPosts();
