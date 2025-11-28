const db = require('./database');
require('dotenv').config();

async function addLinks() {
  try {
    await db.init();
    
    const links = [
      {
        title: '$34.5 billion for Google Chrome',
        url: 'https://www.wsj.com/tech/perplexity-ai-google-chrome-offer-5ddb7a22?st=YNBJ1J&reflink=article_copyURL_share',
        description: "I don't see how a browser can be worth so much. It's basically just for the existing market share of users."
      },
      {
        title: 'Google AI Mode',
        url: 'https://search.google/ways-to-search/ai-mode/',
        description: 'Will this kill SEO?'
      },
      {
        title: 'ChatGPT-5 Announced',
        url: 'https://openai.com/gpt-5/',
        description: 'Consolidation of all models together for an improved AI model! I used this and cursor to add the Wait List page.'
      }
    ];

    console.log('Adding links...\n');
    
    for (const link of links) {
      // Check if link already exists
      const existing = await db.get('SELECT * FROM links WHERE url = ?', [link.url]);
      
      if (existing) {
        console.log(`✓ Link already exists: ${link.title}`);
      } else {
        await db.run(
          'INSERT INTO links (title, url, description) VALUES (?, ?, ?)',
          [link.title, link.url, link.description]
        );
        console.log(`✓ Added: ${link.title}`);
      }
    }
    
    // List all links
    const allLinks = await db.all('SELECT id, title, url FROM links ORDER BY date_added DESC');
    console.log(`\nTotal links in database: ${allLinks.length}`);
    
    await db.close();
    process.exit(0);
  } catch (error) {
    console.error('Error adding links:', error);
    process.exit(1);
  }
}

addLinks();


