const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // Import gray-matter

const postsDir = path.join(__dirname, '../posts');
const outputFilePath = path.join(__dirname, '../posts.json');



/**
 * Main function to generate the posts index.
 */
const generateIndex = () => {
  try {
    const files = fs.readdirSync(postsDir);

    const posts = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const stats = fs.statSync(filePath);
        const { data } = matter(fileContent); // Parse front matter

        return {
          title: data.title || 'Untitled Post', // Use title from front matter
          tags: data.tags || [], // Use tags from front matter
          file: file,
          date: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

    fs.writeFileSync(outputFilePath, JSON.stringify(posts, null, 2));

    console.log(`✅ Successfully generated posts.json with ${posts.length} posts.`);
  } catch (error) {
    console.error('❌ Error generating posts index:', error);
  }
};

generateIndex();
