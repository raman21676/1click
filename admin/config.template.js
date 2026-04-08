// ⚠️ SECURITY WARNING: This is a TEMPLATE file
// Copy this to config.js and fill in your actual credentials
// config.js is gitignored and will NOT be committed to the repository

const ADMIN_CONFIG = {
    username: 'YOUR_USERNAME_HERE',
    password: 'YOUR_PASSWORD_HERE',
    sessionKey: '1click_admin_session_' + Math.random().toString(36).substring(2),
    version: '1.0'
};

// Export for use in admin panel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ADMIN_CONFIG;
}
