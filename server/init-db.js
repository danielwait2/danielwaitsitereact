const db = require('./database');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await db.init();
    console.log('Database initialized successfully!');
    console.log('Tables created: links, click_analytics, page_views, sessions, admins');
    console.log('Default admin user created (if it didn\'t exist)');
    
    // Check if admin exists
    const admin = await db.get('SELECT username FROM admins LIMIT 1');
    if (admin) {
      console.log(`Admin user found: ${admin.username}`);
    }
    
    await db.close();
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();


