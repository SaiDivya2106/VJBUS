const demoData = require('./demoData');

const demoUserFactory = {
    getUser: (role = 'student') => {
        if (role === 'admin') return demoData.users.find(u => u.role === 'admin');
        if (role === 'superadmin') return demoData.users.find(u => u.role === 'superadmin');
        return demoData.users.find(u => u.role === 'student');
    },

    // Switch role helper for frontend to use via headers if we implement that way
    // or just a utility for the middleware
};

module.exports = demoUserFactory;
