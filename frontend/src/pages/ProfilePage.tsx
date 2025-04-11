import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Check } from "lucide-react";
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
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

    useEffect(() => {
        if (user) {
            const avatarUrl = createAvatar(identicon, { seed: user.name }).toDataUri();
            setAvatarUrl(avatarUrl);
        }
    }, [user]);

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

    return (
        <div className="pb-20">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative"></div>

            {/* Profile Header */}
            <div className="px-4 relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-4 border-4 border-white rounded-full">
                    <img
                        src={avatarUrl || user.avatar}
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover"
                    />
                </div>

                {/* Action Buttons */}
                {/* on the action buttons if the username on the path is similar to the username of logged in user then there is no need for follow or following button */}
                <div className="flex justify-between items-center pt-16">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold">{user.name}</h1>
                        {loggedInUser?.username === user.username && (
                            <span className="text-sm text-gray-500">You</span>
                        )}
                    </div>
                    {loggedInUser?.username !== user.username && (
                        <button
                            onClick={toggleFollow}
                            className={`px-4 py-1.5 rounded-full font-medium text-sm flex items-center gap-1 ${isFollowing
                                ? "bg-white text-black border border-gray-300 hover:border-red-300 hover:text-red-500"
                                : "bg-black text-white hover:bg-gray-800"
                                }`}
                            disabled={!user || !loggedInUser}
                        >
                            {isFollowing ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Following
                                </>
                            ) : (
                                "Follow"
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-4 pt-16 pb-4">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold">{user.name}</h1>
                </div>
                <p className="text-gray-500">@{user.username}</p>

                {user.bio && <p className="my-3">{user.bio}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                        <CalendarDays size={16} className="mr-1" />
                        <span>
                            Joined {new Date(Number(user.createdAt)).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                </div>

                <div className="flex gap-5">
                    <Link
                        to={`/profile/${user.username}/following`}
                        className="hover:underline cursor-pointer"
                    >
                        <span className="font-bold">{user.following.length.toLocaleString()}</span>
                        <span className="text-gray-500"> Following</span>
                    </Link>
                    <Link
                        to={`/profile/${user.username}/followers`}
                        className="hover:underline cursor-pointer"
                    >
                        <span className="font-bold">{user.followers.length.toLocaleString()}</span>
                        <span className="text-gray-500"> Followers</span>
                    </Link>
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