import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Check, UserPlus, Pencil } from "lucide-react";
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface User {
    id: string;
    username: string;
    name: string;
    avatar: string;
    bio?: string;
    createdAt: string;
    followers: { id: string }[];
    following: { id: string }[];
    posts: Post[];
}

interface Post {
    id: string;
    content: string;
    image?: string;
    createdAt: string;
}

const ProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);

    const { user: loggedInUser } = useAuth();

    const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                const query = `query GetUser($username: String!) {
                    getUser(username: $username) {
                        id
                        username
                        name
                        avatar
                        bio
                        createdAt
                        followers {
                            id
                        }
                        following {
                            id
                        }
                        posts {
                            id
                            content
                            image
                            createdAt
                        }
                    }
                }`;

                const response = await fetch(graphqlEndpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        query,
                        variables: { username },
                    }),
                });

                const result = await response.json();

                if (result.errors) {
                    throw new Error(result.errors[0].message);
                }

                if (!result.data?.getUser) {
                    throw new Error("User not found");
                }

                setUser(result.data.getUser);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setError(err instanceof Error ? err.message : "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUserProfile();
        }
    }, [username]);

    const toggleFollow = async () => {
        if (!user || !loggedInUser) return;

        try {
            const mutation = isFollowing
                ? `mutation { unfollowUser(userId: "${user.id}") { success } }`
                : `mutation { followUser(userId: "${user.id}") { success } }`;

            const response = await fetch(graphqlEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ query: mutation }),
            });

            const result = await response.json();

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            // Update the follow status and count
            setIsFollowing(!isFollowing);
            setUser(prev => {
                if (!prev) return null;

                const newFollowers = isFollowing
                    ? prev.followers.filter(f => f.id !== loggedInUser.id)
                    : [...prev.followers, { id: loggedInUser.id }];

                return {
                    ...prev,
                    followers: newFollowers
                };
            });

        } catch (err) {
            console.error("Failed to toggle follow:", err);
            // Optionally show error to user
        }
    };

    // Add this useEffect to initialize follow status
    useEffect(() => {
        if (user && loggedInUser) {
            const isFollowing = user.followers.some(f => f.id === loggedInUser.id);
            setIsFollowing(isFollowing);
        }
    }, [user, loggedInUser]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-10 h-10 border-4 border-x-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error || !user) return (
        <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
            <p className="text-gray-500 max-w-md">
                {error || "This account doesn't exist. Try searching for another."}
            </p>
        </div>
    );

    function generateUserGradient(userId: string) {
        const gradients = [
            'from-blue-500 to-purple-600',
            'from-emerald-500 to-cyan-600',
            'from-rose-500 to-pink-600',
            'from-amber-500 to-orange-600',
            'from-violet-500 to-fuchsia-600'
        ];
        // Simple hash for consistent color assignment
        const hash = Array.from(userId).reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        return gradients[hash % gradients.length];
    }

    return (
        <div className="pb-20">
            {/* Modern Cover Photo with Gradient */}
            <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-700 relative overflow-hidden">
                {/* Subtle noise texture for depth */}
                <div className="absolute inset-0 bg-noise opacity-10"></div>
            </div>

            {/* Profile Header Container */}
            <div className="px-4 sm:px-6 relative">
                {/* Enhanced Avatar with Multiple Fallbacks */}
                <div className="absolute -top-20 left-4 sm:left-6">
                    <div className="relative group w-32 h-32">
                        {/* Avatar Container */}
                        <div className="w-full h-full rounded-full border-[5px] border-white bg-white shadow-xl overflow-hidden flex items-center justify-center">
                            {/* 1. Try uploaded avatar first */}
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        // Will fall through to the gradient initial
                                    }}
                                />
                            ) : null}

                            {/* 2. Fallback to gradient with initial */}
                            {(!user.avatar || !user.avatar.startsWith('http')) && (
                                <div
                                    className={`w-full h-full flex items-center justify-center text-white text-5xl font-bold bg-gradient-to-br 
              ${generateUserGradient(user.id)}`}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Edit Pencil for current user */}
                        {loggedInUser?.username === user.username && (
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                                <Pencil className="h-4 w-4 text-gray-700" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-24 pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            {loggedInUser?.username === user.username && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">You</span>
                            )}
                        </div>
                        <p className="text-gray-500 mt-1">@{user.username}</p>
                    </div>

                    {/* Follow Button - Enhanced Interaction */}
                    {loggedInUser?.username !== user.username && (
                        <button
                            onClick={toggleFollow}
                            className={`px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-all duration-200 ${isFollowing
                                ? "bg-white text-gray-800 border border-gray-300 hover:border-red-200 hover:text-red-500 shadow-sm"
                                : "bg-black text-white hover:bg-gray-800 shadow-md"
                                }`}
                            disabled={!user || !loggedInUser}
                        >
                            {isFollowing ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    <span>Following</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4" />
                                    <span>Follow</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
                {/* PROFILE DETAILS SECTION HERE */}
                <div className="mt-4 space-y-3">
                    {user.bio && (
                        <p className="text-gray-700 text-sm sm:text-base">
                            {user.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <CalendarDays size={16} className="mr-1.5" />
                            <span>
                                Joined {new Date(Number(user.createdAt)).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-5 pt-2">
                        <Link
                            to={`/profile/${user.username}/following`}
                            className="hover:underline cursor-pointer flex items-center gap-1"
                        >
                            <span className="font-bold text-gray-900">{user.following.length.toLocaleString()}</span>
                            <span className="text-gray-500">Following</span>
                        </Link>
                        <Link
                            to={`/profile/${user.username}/followers`}
                            className="hover:underline cursor-pointer flex items-center gap-1"
                        >
                            <span className="font-bold text-gray-900">{user.followers.length.toLocaleString()}</span>
                            <span className="text-gray-500">Followers</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Posts Section */}
            <div className="mt-8">
                {user.posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="p-6 bg-gray-100 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            @{user.username} hasn't posted yet
                        </h3>
                        <p className="text-gray-500 max-w-md text-center">
                            When they share their thoughts, you'll find them here. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {user.posts.map((post) => (
                            <div
                                key={post.id}
                                className="p-6 bg-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                            <span className="text-white font-medium">
                                                {user.username.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <p className="font-bold text-gray-900">
                                                @{user.username}
                                            </p>
                                            <span className="text-gray-500 text-sm">
                                                ·
                                            </span>
                                            <p className="text-gray-500 text-sm">
                                                {new Date(Number(post.createdAt)).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        <p className="mt-1 text-gray-800 whitespace-pre-line">
                                            {post.content}
                                        </p>
                                        {post.image && (
                                            <div className="mt-3 rounded-lg overflow-hidden">
                                                <img
                                                    src={post.image}
                                                    alt="Post content"
                                                    className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200"
                                                />
                                            </div>
                                        )}
                                        <div className="mt-4 flex items-center space-x-4">
                                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                    />
                                                </svg>
                                                <span className="text-sm">Comment</span>
                                            </button>
                                            <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                    />
                                                </svg>
                                                <span className="text-sm">Like</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;