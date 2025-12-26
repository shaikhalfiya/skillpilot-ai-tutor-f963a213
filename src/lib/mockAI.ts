/**
 * Mock AI Service for SkillPilot MVP
 * 
 * AZURE OPENAI INTEGRATION POINT:
 * Replace this mock service with Azure OpenAI API calls.
 * 
 * Azure OpenAI Setup:
 * 1. Create Azure OpenAI resource in Azure Portal
 * 2. Deploy a model (e.g., gpt-4 or gpt-35-turbo)
 * 3. Get endpoint URL and API key
 * 4. Replace fetch calls with:
 *    
 *    const endpoint = "https://<your-resource>.openai.azure.com/";
 *    const deployment = "<your-deployment-name>";
 *    const apiKey = "<your-api-key>";
 *    
 *    fetch(`${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`, {
 *      method: 'POST',
 *      headers: {
 *        'Content-Type': 'application/json',
 *        'api-key': apiKey
 *      },
 *      body: JSON.stringify({
 *        messages: [{ role: 'user', content: prompt }],
 *        max_tokens: 1000
 *      })
 *    })
 */

import { RoadmapData, ChatMessage } from '@/types/skillpilot';

// Simulated delay to mimic API response time
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock roadmap data for different skills
const mockRoadmaps: Record<string, RoadmapData> = {
  frontend: {
    skill: 'Frontend Development',
    level: 'beginner',
    estimatedTotalTime: '3-4 months',
    steps: [
      {
        id: 1,
        title: 'HTML Fundamentals',
        description: 'Learn the building blocks of web pages. Understand semantic HTML, forms, and accessibility basics.',
        duration: '1 week',
        completed: false,
        resources: [
          { title: 'MDN HTML Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', type: 'documentation', free: true },
          { title: 'freeCodeCamp HTML', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'course', free: true },
        ],
        tasks: [
          { id: 1, title: 'Build a personal bio page', description: 'Create a simple HTML page with your bio, image, and links', difficulty: 'beginner', completed: false },
          { id: 2, title: 'Create a form', description: 'Build a contact form with various input types', difficulty: 'beginner', completed: false },
        ]
      },
      {
        id: 2,
        title: 'CSS Styling',
        description: 'Master CSS for beautiful, responsive designs. Learn Flexbox, Grid, and modern CSS features.',
        duration: '2 weeks',
        completed: false,
        resources: [
          { title: 'CSS Tricks Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'article', free: true },
          { title: 'Grid Garden Game', url: 'https://cssgridgarden.com/', type: 'course', free: true },
        ],
        tasks: [
          { id: 3, title: 'Style your bio page', description: 'Add colors, fonts, and layout to your bio page', difficulty: 'beginner', completed: false },
          { id: 4, title: 'Build a responsive navbar', description: 'Create a navigation bar that works on all screen sizes', difficulty: 'intermediate', completed: false },
        ]
      },
      {
        id: 3,
        title: 'JavaScript Basics',
        description: 'Learn programming fundamentals with JavaScript. Variables, functions, DOM manipulation.',
        duration: '3 weeks',
        completed: false,
        resources: [
          { title: 'JavaScript.info', url: 'https://javascript.info/', type: 'documentation', free: true },
          { title: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net/', type: 'article', free: true },
        ],
        tasks: [
          { id: 5, title: 'Build a calculator', description: 'Create a functional calculator with basic operations', difficulty: 'beginner', completed: false },
          { id: 6, title: 'Todo List App', description: 'Build a todo list with add, delete, and complete functionality', difficulty: 'intermediate', completed: false },
        ]
      },
      {
        id: 4,
        title: 'React Framework',
        description: 'Learn modern frontend development with React. Components, state, and hooks.',
        duration: '4 weeks',
        completed: false,
        resources: [
          { title: 'React Official Docs', url: 'https://react.dev/', type: 'documentation', free: true },
          { title: 'React Tutorial', url: 'https://react.dev/learn/tutorial-tic-tac-toe', type: 'course', free: true },
        ],
        tasks: [
          { id: 7, title: 'Convert Todo to React', description: 'Rebuild your todo list using React components', difficulty: 'intermediate', completed: false },
          { id: 8, title: 'Build a Weather App', description: 'Create a weather app that fetches data from an API', difficulty: 'advanced', completed: false },
        ]
      },
    ],
    projects: [
      {
        id: 1,
        title: 'Personal Portfolio Website',
        description: 'Build a complete portfolio showcasing your projects and skills',
        difficulty: 'intermediate',
        estimatedTime: '1 week',
        skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design']
      },
      {
        id: 2,
        title: 'E-commerce Product Page',
        description: 'Create a product page with image gallery, cart functionality',
        difficulty: 'advanced',
        estimatedTime: '2 weeks',
        skills: ['React', 'State Management', 'CSS Grid']
      },
    ]
  },
  dsa: {
    skill: 'Data Structures & Algorithms',
    level: 'beginner',
    estimatedTotalTime: '2-3 months',
    steps: [
      {
        id: 1,
        title: 'Arrays & Strings',
        description: 'Master the fundamentals of arrays and string manipulation.',
        duration: '2 weeks',
        completed: false,
        resources: [
          { title: 'LeetCode Array Problems', url: 'https://leetcode.com/tag/array/', type: 'course', free: true },
          { title: 'NeetCode Arrays', url: 'https://neetcode.io/', type: 'video', free: true },
        ],
        tasks: [
          { id: 1, title: 'Two Sum Problem', description: 'Find two numbers that add up to target', difficulty: 'beginner', completed: false },
          { id: 2, title: 'Reverse String', description: 'Reverse a string in-place', difficulty: 'beginner', completed: false },
        ]
      },
      {
        id: 2,
        title: 'Linked Lists',
        description: 'Understand linked list operations and common patterns.',
        duration: '1 week',
        completed: false,
        resources: [
          { title: 'Visualgo Linked List', url: 'https://visualgo.net/en/list', type: 'documentation', free: true },
        ],
        tasks: [
          { id: 3, title: 'Reverse Linked List', description: 'Reverse a singly linked list', difficulty: 'intermediate', completed: false },
        ]
      },
      {
        id: 3,
        title: 'Trees & Graphs',
        description: 'Learn tree traversal and graph algorithms.',
        duration: '3 weeks',
        completed: false,
        resources: [
          { title: 'Tree Traversal Guide', url: 'https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/', type: 'article', free: true },
        ],
        tasks: [
          { id: 4, title: 'Binary Tree Inorder', description: 'Implement inorder traversal', difficulty: 'intermediate', completed: false },
        ]
      },
    ],
    projects: [
      {
        id: 1,
        title: 'Solve 50 LeetCode Problems',
        description: 'Complete 50 problems across easy, medium, and hard',
        difficulty: 'intermediate',
        estimatedTime: '1 month',
        skills: ['Problem Solving', 'Time Complexity', 'Space Complexity']
      },
    ]
  },
  ai: {
    skill: 'Artificial Intelligence & ML',
    level: 'beginner',
    estimatedTotalTime: '4-6 months',
    steps: [
      {
        id: 1,
        title: 'Python Fundamentals',
        description: 'Master Python programming for AI/ML development.',
        duration: '2 weeks',
        completed: false,
        resources: [
          { title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'documentation', free: true },
          { title: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com/', type: 'article', free: true },
        ],
        tasks: [
          { id: 1, title: 'Build a CLI tool', description: 'Create a command-line tool in Python', difficulty: 'beginner', completed: false },
        ]
      },
      {
        id: 2,
        title: 'Machine Learning Basics',
        description: 'Learn core ML concepts: regression, classification, clustering.',
        duration: '4 weeks',
        completed: false,
        resources: [
          { title: 'Andrew Ng ML Course', url: 'https://www.coursera.org/learn/machine-learning', type: 'course', free: true },
          { title: 'Scikit-learn Docs', url: 'https://scikit-learn.org/stable/', type: 'documentation', free: true },
        ],
        tasks: [
          { id: 2, title: 'Build a classifier', description: 'Create a spam classifier using scikit-learn', difficulty: 'intermediate', completed: false },
        ]
      },
      {
        id: 3,
        title: 'Deep Learning',
        description: 'Dive into neural networks and deep learning with TensorFlow/PyTorch.',
        duration: '6 weeks',
        completed: false,
        resources: [
          { title: 'Fast.ai Course', url: 'https://course.fast.ai/', type: 'course', free: true },
          { title: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', type: 'documentation', free: true },
        ],
        tasks: [
          { id: 3, title: 'Image Classifier', description: 'Build a CNN for image classification', difficulty: 'advanced', completed: false },
        ]
      },
    ],
    projects: [
      {
        id: 1,
        title: 'Sentiment Analysis App',
        description: 'Build a web app that analyzes sentiment of text input',
        difficulty: 'intermediate',
        estimatedTime: '2 weeks',
        skills: ['NLP', 'Python', 'Flask/FastAPI']
      },
    ]
  },
  software: {
    skill: 'Software Engineering',
    level: 'beginner',
    estimatedTotalTime: '3-4 months',
    steps: [
      {
        id: 1,
        title: 'Programming Fundamentals',
        description: 'Master core programming concepts in any language.',
        duration: '3 weeks',
        completed: false,
        resources: [
          { title: 'CS50 Harvard', url: 'https://cs50.harvard.edu/x/', type: 'course', free: true },
        ],
        tasks: [
          { id: 1, title: 'Complete CS50 Problem Sets', description: 'Finish first 5 problem sets', difficulty: 'beginner', completed: false },
        ]
      },
      {
        id: 2,
        title: 'Version Control with Git',
        description: 'Learn Git and GitHub for collaborative development.',
        duration: '1 week',
        completed: false,
        resources: [
          { title: 'Git Tutorial', url: 'https://www.atlassian.com/git/tutorials', type: 'documentation', free: true },
        ],
        tasks: [
          { id: 2, title: 'Create GitHub Profile', description: 'Set up GitHub with a README profile', difficulty: 'beginner', completed: false },
        ]
      },
      {
        id: 3,
        title: 'System Design Basics',
        description: 'Understand how to design scalable systems.',
        duration: '3 weeks',
        completed: false,
        resources: [
          { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'article', free: true },
        ],
        tasks: [
          { id: 3, title: 'Design URL Shortener', description: 'Create a system design for URL shortening service', difficulty: 'intermediate', completed: false },
        ]
      },
    ],
    projects: [
      {
        id: 1,
        title: 'Full-Stack Application',
        description: 'Build a complete app with frontend, backend, and database',
        difficulty: 'advanced',
        estimatedTime: '3 weeks',
        skills: ['Full Stack', 'Database', 'API Design', 'Deployment']
      },
    ]
  },
};

// Default roadmap for unknown skills
const defaultRoadmap: RoadmapData = {
  skill: 'Custom Learning Path',
  level: 'beginner',
  estimatedTotalTime: '2-3 months',
  steps: [
    {
      id: 1,
      title: 'Foundation Building',
      description: 'Start with the fundamentals of your chosen topic.',
      duration: '2 weeks',
      completed: false,
      resources: [
        { title: 'Start with documentation', url: '#', type: 'documentation', free: true },
      ],
      tasks: [
        { id: 1, title: 'Research fundamentals', description: 'Study the core concepts', difficulty: 'beginner', completed: false },
      ]
    },
    {
      id: 2,
      title: 'Practical Application',
      description: 'Apply what you learned through hands-on practice.',
      duration: '3 weeks',
      completed: false,
      resources: [],
      tasks: [
        { id: 2, title: 'Build a small project', description: 'Create something using your new skills', difficulty: 'intermediate', completed: false },
      ]
    },
  ],
  projects: [
    {
      id: 1,
      title: 'Capstone Project',
      description: 'Build a comprehensive project showcasing your skills',
      difficulty: 'advanced',
      estimatedTime: '2 weeks',
      skills: ['All learned skills']
    },
  ]
};

/**
 * Generate a personalized roadmap based on the skill
 * 
 * AZURE OPENAI INTEGRATION:
 * Replace this function body with Azure OpenAI API call:
 * 
 * const prompt = `Create a detailed learning roadmap for ${skill}. 
 * Include steps, resources, tasks, and project ideas.
 * Format as JSON with structure: { skill, level, steps[], projects[] }`;
 * 
 * const response = await fetch(azureEndpoint, { ... });
 * return response.json();
 */
export async function generateRoadmap(skill: string): Promise<RoadmapData> {
  await simulateDelay(1500); // Simulate API latency
  
  const normalizedSkill = skill.toLowerCase().trim();
  
  // Match skill to predefined roadmaps
  if (normalizedSkill.includes('frontend') || normalizedSkill.includes('web') || normalizedSkill.includes('react') || normalizedSkill.includes('html') || normalizedSkill.includes('css') || normalizedSkill.includes('javascript')) {
    return { ...mockRoadmaps.frontend, skill };
  }
  if (normalizedSkill.includes('dsa') || normalizedSkill.includes('algorithm') || normalizedSkill.includes('data structure') || normalizedSkill.includes('leetcode')) {
    return { ...mockRoadmaps.dsa, skill };
  }
  if (normalizedSkill.includes('ai') || normalizedSkill.includes('machine learning') || normalizedSkill.includes('ml') || normalizedSkill.includes('deep learning') || normalizedSkill.includes('artificial intelligence')) {
    return { ...mockRoadmaps.ai, skill };
  }
  if (normalizedSkill.includes('software') || normalizedSkill.includes('engineering') || normalizedSkill.includes('swe') || normalizedSkill.includes('backend')) {
    return { ...mockRoadmaps.software, skill };
  }
  
  // Return customized default for unknown skills
  return { ...defaultRoadmap, skill };
}

/**
 * Chat with AI teacher
 * 
 * AZURE OPENAI INTEGRATION:
 * Replace with streaming chat completion:
 * 
 * const systemPrompt = `You are SkillPilot, a supportive AI teacher.
 * Help students learn ${currentSkill}. Be encouraging and clear.
 * If beginner, explain simply. If experienced, suggest projects.`;
 * 
 * const response = await fetch(azureEndpoint, {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     messages: [
 *       { role: 'system', content: systemPrompt },
 *       ...conversationHistory,
 *       { role: 'user', content: question }
 *     ],
 *     stream: true
 *   })
 * });
 */
export async function askAI(question: string, context?: string): Promise<string> {
  await simulateDelay(1000);
  
  const lowerQuestion = question.toLowerCase();
  
  // Contextual responses based on question type
  if (lowerQuestion.includes('stuck') || lowerQuestion.includes('help') || lowerQuestion.includes('confused')) {
    return `I understand learning can feel overwhelming sometimes! 💪 Let's break this down together.

**Here's what I suggest:**
1. Take a step back and review the previous concept
2. Try a simpler example first
3. Write out what you understand so far

What specific part is confusing you? I'm here to help explain it in a different way!`;
  }
  
  if (lowerQuestion.includes('next') || lowerQuestion.includes('what should')) {
    return `Based on your progress, here's what I recommend:

**Your Next Steps:**
1. Complete the current practice task in your roadmap
2. Try building a mini-project to solidify your understanding
3. Move to the next topic once you feel comfortable

Would you like me to suggest a specific practice exercise?`;
  }
  
  if (lowerQuestion.includes('resource') || lowerQuestion.includes('tutorial') || lowerQuestion.includes('learn')) {
    return `Great question! Here are some excellent free resources:

📚 **Documentation:** Always start with official docs
🎥 **Videos:** freeCodeCamp, Traversy Media, Fireship
📝 **Practice:** LeetCode, Frontend Mentor, Exercism
🎮 **Interactive:** Codecademy, Scrimba

What format do you prefer for learning? I can give more specific recommendations!`;
  }
  
  if (lowerQuestion.includes('project') || lowerQuestion.includes('build')) {
    return `Building projects is the best way to learn! 🚀

**Project Ideas for Your Level:**
• **Beginner:** Todo app, Calculator, Personal website
• **Intermediate:** Weather app, Blog platform, E-commerce page
• **Advanced:** Full-stack app, Real-time chat, Dashboard

Start small and gradually add features. Would you like detailed guidance on any of these?`;
  }
  
  if (lowerQuestion.includes('job') || lowerQuestion.includes('career') || lowerQuestion.includes('interview')) {
    return `Great to see you thinking about your career! 

**Key Tips:**
1. Build a strong portfolio with 3-5 projects
2. Contribute to open source
3. Practice coding interviews (LeetCode, HackerRank)
4. Network on LinkedIn and attend meetups
5. Apply consistently, even if you don't meet all requirements

You're on the right path! Keep learning and building.`;
  }
  
  // Default encouraging response
  return `That's a great question! 🌟

I'm here to help you on your learning journey. Here are some thoughts:

1. **Stay curious** - Every expert was once a beginner
2. **Practice consistently** - Even 30 minutes daily makes a difference
3. **Build projects** - Apply what you learn immediately
4. **Don't compare** - Focus on your own progress

Is there something specific about ${context || 'your learning path'} you'd like me to explain?`;
}

/**
 * Generate practice tasks based on current progress
 * 
 * AZURE OPENAI INTEGRATION:
 * Use Azure OpenAI to generate personalized tasks based on
 * student's skill level and completed tasks.
 */
export async function generateTasks(skill: string, level: string): Promise<string[]> {
  await simulateDelay(800);
  
  return [
    `Build a simple ${skill} project from scratch`,
    `Solve 3 coding challenges related to ${skill}`,
    `Explain ${skill} concepts to a rubber duck (or a friend!)`,
    `Review and refactor your previous ${skill} code`,
  ];
}
