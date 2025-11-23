const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Contest = require('./models/Contest');
const Solution = require('./models/Solution');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codechef_solutions');
        console.log('MongoDB Connected');

        // Clear existing data
        await Contest.deleteMany({});
        await Solution.deleteMany({});
        console.log('Cleared existing data');

        // Seed Contests
        const contests = await Contest.create([
            {
                name: "Starters 100",
                startTime: new Date().toISOString(),
                endTime: "2h 30m",
                participants: 12450,
                status: "Live",
                type: "Rated"
            },
            {
                name: "Long Challenge",
                startTime: new Date().toISOString(),
                endTime: "2d 5h",
                participants: 5400,
                status: "Live",
                type: "Rated"
            },
            {
                name: "Cook-Off",
                startTime: "Tomorrow, 8:00 PM",
                duration: "2.5 hours",
                status: "Upcoming",
                type: "Rated"
            },
            {
                name: "Lunchtime",
                startTime: "Sat, 12:00 PM",
                duration: "3 hours",
                status: "Upcoming",
                type: "Rated"
            }
        ]);
        console.log('Seeded Contests');

        const starters100 = contests.find(c => c.name === "Starters 100");

        // Seed Solutions for Starters 100
        await Solution.create([
            {
                contestId: starters100._id, // Use the actual _id
                problemId: "S100_P1",
                name: "Array Optimization",
                difficulty: "Easy",
                price: 15,
                content: "```cpp\n// Solution for Array Optimization\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int t; cin >> t;\n    while(t--) {\n        int n; cin >> n;\n        // Logic here\n    }\n    return 0;\n}\n```"
            },
            {
                contestId: starters100._id,
                problemId: "S100_P2",
                name: "Dynamic Graph",
                difficulty: "Medium",
                price: 20,
                content: "```cpp\n// Solution for Dynamic Graph\n```"
            },
            {
                contestId: starters100._id,
                problemId: "S100_P3",
                name: "String Permutations",
                difficulty: "Medium",
                price: 20,
                content: "```cpp\n// Solution for String Permutations\n```"
            },
            {
                contestId: starters100._id,
                problemId: "S100_P4",
                name: "Tree Traversal",
                difficulty: "Hard",
                price: 25,
                content: "```cpp\n// Solution for Tree Traversal\n```"
            }
        ]);
        console.log('Seeded Solutions');

        console.log('Data Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
