const db = require('./database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updateAdmin() {
  try {
    await db.init();
    
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'daniel2025';
    
    console.log(`Updating admin credentials for username: ${adminUsername}`);
    
    // Check if admin exists
    const existingAdmin = await db.get('SELECT * FROM admins WHERE username = ?', [adminUsername]);
    
    if (existingAdmin) {
      // Update existing admin password
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await db.run(
        'UPDATE admins SET password_hash = ? WHERE username = ?',
        [passwordHash, adminUsername]
      );
      console.log(`✓ Admin password updated successfully for user: ${adminUsername}`);
    } else {
      // Create new admin if it doesn't exist
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await db.run(
        'INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)',
        [adminUsername, passwordHash, 'admin']
      );
      console.log(`✓ New admin user created: ${adminUsername}`);
    }
    
    // List all admins
    const admins = await db.all('SELECT id, username, role, created_at FROM admins');
    console.log('\nAll admin users:');
    admins.forEach(admin => {
      console.log(`  - ${admin.username} (${admin.role}) - Created: ${admin.created_at}`);
    });
    
    await db.close();
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin:', error);
    process.exit(1);
  }
}

updateAdmin();


