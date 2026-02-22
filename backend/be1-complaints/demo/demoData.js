const demoData = {
    users: [
        {
            _id: "demo-student-id",
            name: "Demo Student",
            email: "student@demo.com",
            picture: "https://lh3.googleusercontent.com/a/default-user",
            role: "student"
        },
        {
            _id: "demo-admin-id",
            name: "Demo Admin",
            email: "admin@demo.com",
            picture: "https://lh3.googleusercontent.com/a/default-admin",
            role: "admin",
            category: "Mess"
        },
        {
            _id: "demo-superadmin-id",
            name: "Demo SuperAdmin",
            email: "superadmin@demo.com",
            picture: "https://lh3.googleusercontent.com/a/default-superadmin",
            role: "superadmin"
        }
    ],
    admins: [
        {
            _id: "admin-1",
            email: "admin@demo.com",
            name: "Demo Admin",
            category: "Mess"
        },
        {
            _id: "admin-2",
            email: "hosteladmin@demo.com",
            name: "Hostel Admin",
            category: "Hostel"
        }
    ],
    superAdmins: [
        {
            _id: "superadmin-1",
            email: "superadmin@demo.com"
        }
    ],
    complaints: [
        {
            _id: "comp-1",
            complaint_id: "1001",
            title: "Cold food in Mess",
            description: "The food served in the mess was cold today during lunch.",
            category: "Mess",
            user_id: "student@demo.com",
            status: "Pending",
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            likes: 2,
            dislikes: 0,
            comments: [],
            votedUsers: [],
            flagged: false
        },
        {
            _id: "comp-2",
            complaint_id: "1002",
            title: "WiFi not working in Room 302",
            description: "WiFi has been down since morning.",
            category: "IT and Networking",
            user_id: "student@demo.com",
            status: "Resolved",
            timestamp: new Date(Date.now() - 172800000), // 2 days ago
            likes: 5,
            dislikes: 0,
            comments: [
                {
                    id: 123456789,
                    text: "Checked and fixed the router.",
                    role: "admin",
                    email: "admin@demo.com",
                    timestamp: new Date(Date.now() - 43200000).toISOString()
                }
            ],
            votedUsers: [],
            flagged: false,
            it_details: {
                room_number: "302",
                internet_speed: "0 Mbps",
                mobile_number: "9876543210",
                issue_duration: "Since Morning",
                connectionType: "WiFi",
                location: "Boys Hostel"
            }
        }
    ],
    assistants: [
        {
            _id: "assistant-1",
            email: "assistant@demo.com",
            name: "Demo Assistant",
            category: "Hostel"
        }
    ]
};

module.exports = demoData;
