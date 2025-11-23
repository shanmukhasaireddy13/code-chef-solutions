const mongoose = require('mongoose');
const Solution = require('./models/Solution');
require('dotenv').config();

// Sample solutions for Contest 1
const solutions = [
    {
        contestId: '1',
        problemId: '101',
        name: 'Array Optimization',
        difficulty: 'Easy',
        price: 15,
        content: `# Array Optimization Solution

## Approach
This problem can be solved using a two-pointer technique.

## Code
\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // Your solution here
    
    return 0;
}
\`\`\`

## Time Complexity
O(n)

## Space Complexity
O(1)
`
    },
    {
        contestId: '1',
        problemId: '102',
        name: 'Dynamic Graph',
        difficulty: 'Medium',
        price: 20,
        content: `# Dynamic Graph Solution

## Approach
Use BFS/DFS with dynamic programming.

## Code
\`\`\`cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    // Graph solution implementation
    return 0;
}
\`\`\`

## Time Complexity
O(V + E)

## Space Complexity
O(V)
`
    },
    {
        contestId: '1',
        problemId: '103',
        name: 'String Permutations',
        difficulty: 'Medium',
        price: 20,
        content: `# String Permutations Solution

## Approach
Use backtracking to generate all permutations.

## Code
\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

void permute(string s, int l, int r) {
    if (l == r) {
        cout << s << endl;
    } else {
        for (int i = l; i <= r; i++) {
            swap(s[l], s[i]);
            permute(s, l + 1, r);
            swap(s[l], s[i]);
        }
    }
}

int main() {
    string str;
    cin >> str;
    permute(str, 0, str.length() - 1);
    return 0;
}
\`\`\`

## Time Complexity
O(n!)

## Space Complexity
O(n)
`
    },
    {
        contestId: '1',
        problemId: '104',
        name: 'Tree Traversal',
        difficulty: 'Hard',
        price: 25,
        content: `# Tree Traversal Solution

## Approach
Implement all three traversals: inorder, preorder, and postorder.

## Code
\`\`\`cpp
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;
};

void inorder(Node* root) {
    if (root == NULL) return;
    inorder(root->left);
    cout << root->data << " ";
    inorder(root->right);
}

void preorder(Node* root) {
    if (root == NULL) return;
    cout << root->data << " ";
    preorder(root->left);
    preorder(root->right);
}

void postorder(Node* root) {
    if (root == NULL) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->data << " ";
}

int main() {
    // Tree implementation
    return 0;
}
\`\`\`

## Time Complexity
O(n)

## Space Complexity
O(h) where h is height
`
    }
];

async function seedSolutions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Clear existing solutions
        await Solution.deleteMany({});
        console.log('Cleared existing solutions');

        // Insert new solutions
        await Solution.insertMany(solutions);
        console.log('Solutions seeded successfully!');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding solutions:', error);
        process.exit(1);
    }
}

seedSolutions();
