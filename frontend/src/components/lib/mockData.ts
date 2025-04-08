import { PostProps } from "../posts/PostCard";

// Mock Users data
export const USERS = [
    {
        id: "1",
        name: "John Doe",
        username: "johndoe",
        avatar: "https://placehold.co/200x200/3498db/FFFFFF/png?text=JD",
        verified: true,
        bio: "Software engineer. Builder of things. Lover of coffee.",
        following: 243,
        followers: 852,
    },
    {
        id: "2",
        name: "Jane Smith",
        username: "janesmith",
        avatar: "https://placehold.co/200x200/e74c3c/FFFFFF/png?text=JS",
        verified: false,
        bio: "Digital artist and UX designer. Creating beautiful experiences.",
        following: 168,
        followers: 1245,
    },
    {
        id: "3",
        name: "Tech News",
        username: "technews",
        avatar: "https://placehold.co/200x200/27ae60/FFFFFF/png?text=TN",
        verified: true,
        bio: "Your source for the latest tech updates and industry news.",
        following: 12,
        followers: 15823,
    },
    {
        id: "4",
        name: "Sam Wilson",
        username: "samwilson",
        avatar: "https://placehold.co/200x200/f39c12/FFFFFF/png?text=SW",
        verified: false,
        bio: "Photographer and traveler. Capturing the world one frame at a time.",
        following: 493,
        followers: 742,
    },
    {
        id: "5",
        name: "Alex Johnson",
        username: "alexj",
        avatar: "https://placehold.co/200x200/9b59b6/FFFFFF/png?text=AJ",
        verified: true,
        bio: "Entrepreneur and investor. Always looking for the next big thing.",
        following: 223,
        followers: 4582,
    },
];

// Mock Tweets
export const POSTS: PostProps[] = [
    {
        id: "t1",
        user: USERS[0],
        content: "Just finished building a new feature for my app! #coding #webdev",
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        metrics: {
            replies: 12,
            likes: 28,
        },
    },
    {
        id: "t2",
        user: USERS[2],
        content: "Breaking: New AI model can generate code with 95% accuracy, researchers claim. This could revolutionize software development for beginners. #AI #Programming",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        metrics: {
            replies: 42,
            likes: 215,
        },
    },
    {
        id: "t3",
        user: USERS[1],
        content: "Just redesigned my portfolio website after learning some new CSS tricks. It's amazing how much you can do with modern CSS these days!",
        image: "https://placehold.co/600x400/1abc9c/FFFFFF/png?text=Portfolio+Screenshot",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        metrics: {
            replies: 8,
            likes: 47,
        },
    },
    {
        id: "t4",
        user: USERS[4],
        content: "Just closed our Series A funding round! Excited for the next chapter of our journey. Thanks to everyone who believed in our vision from day one. #StartupLife #Funding",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        metrics: {
            replies: 78,
            likes: 827,
        },
    },
    {
        id: "t5",
        user: USERS[3],
        content: "Captured this amazing sunset during my trip to Bali last week. Nature never fails to inspire me.",
        image: "https://placehold.co/600x400/f1c40f/FFFFFF/png?text=Sunset+in+Bali",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        metrics: {
            replies: 23,
            likes: 192,
        },
    },
    {
        id: "t6",
        user: USERS[0],
        content: "Anyone else excited for the new JavaScript features coming this year? The language keeps evolving in amazing ways. #JavaScript #WebDev",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        metrics: {
            replies: 34,
            likes: 89,
        },
    },
    {
        id: "t7",
        user: USERS[2],
        content: "New study shows remote work has increased productivity for 65% of tech companies surveyed. The future of work is changing rapidly. #RemoteWork #FutureOfWork",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        metrics: {
            replies: 56,
            likes: 321,
        },
    },
];

// Mock functions to simulate API calls
export const fetchHomeTimeline = (): Promise<PostProps[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(POSTS);
        }, 800); // Simulate network delay
    });
};

export const fetchUserPosts = (username: string): Promise<PostProps[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userPosts = POSTS.filter((post) => post.user.username === username);
            resolve(userPosts);
        }, 800); // simulate network delay
    });
};

export const fetchUserProfile = (username: string) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = USERS.find((u) => u.username === username);
            if (user) {
                resolve(user);
            } else {
                reject(new Error("User not found"));
            }
        }, 600);
    });
};

// Function to create a new tweet
export const createPost = ( userId: string, content: string, image?: string ): Promise<PostProps> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = USERS.find((u) => u.id === userId) || USERS[0];
            const newPost: PostProps = {
                id: `t${Date.now()}`,
                user,
                content,
                image,
                createdAt: new Date(),
                metrics: {
                    replies: 0,
                    likes: 0,
                },
            };

            // In a real app, this would be added to a database
            POSTS.unshift(newPost);

            resolve(newPost);
        }, 500);
    });
};