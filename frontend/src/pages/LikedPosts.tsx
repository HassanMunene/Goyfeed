import React, { useState } from "react";
import { Heart, HeartOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PostCard from "../components/posts/PostCard";
import { PostProps } from "../components/posts/PostCard";

// Dummy data - replace with your actual PostProps type
const likedPosts: PostProps[] = [
    {
        id: "1",
        content: "Just launched our new product! Check it out at example.com #excited",
        user: {
            id: "u1",
            name: "Tech Startup",
            username: "techstartup",
            avatar: "https://randomuser.me/api/portraits/tech/1.jpg",
            verified: true
        },
        author: {
            name: "Tech Startup",
            avatar: "https://randomuser.me/api/portraits/tech/1.jpg",
            handle: "@techstartup",
            verified: true
        },
        timestamp: new Date(Date.now() - 3600000 * 5),
        createdAt: new Date(Date.now() - 3600000 * 5),
        isLiked: true,
        media: [
            { type: "image", url: "https://source.unsplash.com/random/600x400/?tech" }
        ],
        metrics: {
            replies: 28,
            likes: 124
        }
    },
    {
        id: "2",
        content: "The secret to productivity isn't working more, but working smarter. Here's how:",
        user: {
            id: "u2",
            name: "Productivity Guru",
            username: "productive",
            avatar: "https://randomuser.me/api/portraits/people/1.jpg"
        },
        author: {
            name: "Productivity Guru",
            avatar: "https://randomuser.me/api/portraits/people/1.jpg",
            handle: "@productive"
        },
        timestamp: new Date(Date.now() - 3600000 * 24),
        createdAt: new Date(Date.now() - 3600000 * 24),
        isLiked: true,
        media: [],
        metrics: {
            replies: 134,
            likes: 892
        }
    },
    {
        id: "3",
        content: "Beautiful sunset at the beach today! 🏖️ #vacation",
        user: {
            id: "u3",
            name: "Travel Enthusiast",
            username: "traveler",
            avatar: "https://randomuser.me/api/portraits/people/2.jpg"
        },
        author: {
            name: "Travel Enthusiast",
            avatar: "https://randomuser.me/api/portraits/people/2.jpg",
            handle: "@traveler"
        },
        timestamp: new Date(Date.now() - 3600000 * 48),
        createdAt: new Date(Date.now() - 3600000 * 48),
        isLiked: true,
        media: [
            { type: "image", url: "https://source.unsplash.com/random/600x400/?beach" }
        ],
        metrics: {
            replies: 12,
            likes: 245
        }
    }
];

const LikedPostsPage = () => {
    const [posts, setPosts] = useState(likedPosts);

    const handleUnlike = (postId: string) => {
        setPosts(prev => prev.filter(post => post.id !== postId));
        // In a real app, you'd also update the backend here
    };

    return (
        <div className="max-w-2xl mx-auto border-x border-gray-200 min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm p-4 border-b border-gray-200">
                <div className="flex items-center gap-6">
                    <Link to="/" className="p-1 rounded-full hover:bg-gray-100">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">Liked Posts</h1>
                        <p className="text-sm text-gray-500">{posts.length} liked posts</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <HeartOff size={48} className="text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold mb-2">No liked posts yet</h2>
                    <p className="text-gray-500 max-w-md">
                        Posts you like will appear here. Start exploring and like some content!
                    </p>
                    <Link
                        to="/explore"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                        Explore Posts
                    </Link>
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {posts.map((post) => (
                        <div key={post.id} className="relative">
                            <PostCard {...post} />
                            <button
                                onClick={() => handleUnlike(post.id)}
                                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500"
                                aria-label="Unlike post"
                            >
                                <Heart className="fill-red-500 text-red-500" size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LikedPostsPage;