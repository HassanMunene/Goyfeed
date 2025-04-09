import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Link as LinkIcon, MapPin, Mail, MoreHorizontal } from "lucide-react";
import Timeline from "../components/timeline/Timeline";
import { fetchUserPosts, fetchUserProfile, USERS } from "../components/lib/mockData";

const ProfilePage = () => {
    const { username = USERS[0].username } = useParams<{ username: string }>();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setLoading(true);
                const userData = await fetchUserProfile(username);
                setUser(userData);
                setError(null);
            } catch (err) {
                setError("Failed to load user profile");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadUserProfile();
    }, [username]);

    const fetchPosts = useCallback(() => fetchUserPosts(username), [username]);

    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
        // API call would go here
    };

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
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {user.coverPhoto && (
                    <img 
                        src={user.coverPhoto} 
                        alt="Cover" 
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Profile Header */}
            <div className="px-4 relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-4 border-4 border-white rounded-full">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-3">
                    <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100">
                        <Mail size={18} />
                    </button>
                    <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100">
                        <MoreHorizontal size={18} />
                    </button>
                    <button
                        onClick={toggleFollow}
                        className={`px-4 py-1.5 rounded-full font-bold ${
                            isFollowing 
                                ? "bg-white text-black border border-gray-300 hover:border-red-300 hover:text-red-500"
                                : "bg-black text-white hover:bg-gray-800"
                        }`}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </button>
                </div>
            </div>

            {/* Profile Info */}
            <div className="px-4 pt-16 pb-4">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    {user.verified && (
                        <svg viewBox="0 0 24 24" className="w-5 h-5 ml-1 text-blue-500 fill-current">
                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                        </svg>
                    )}
                </div>
                <p className="text-gray-500">@{user.username}</p>

                {user.bio && <p className="my-3">{user.bio}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    {user.location && (
                        <div className="flex items-center">
                            <MapPin size={16} className="mr-1" />
                            <span>{user.location}</span>
                        </div>
                    )}
                    {user.website && (
                        <a href={user.website} className="flex items-center text-blue-500 hover:underline">
                            <LinkIcon size={16} className="mr-1" />
                            <span>{user.website.replace(/(^\w+:|^)\/\//, '')}</span>
                        </a>
                    )}
                    <div className="flex items-center">
                        <CalendarDays size={16} className="mr-1" />
                        <span>Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>

                <div className="flex gap-5">
                    <div className="hover:underline cursor-pointer">
                        <span className="font-bold">{user.following.toLocaleString()}</span>
                        <span className="text-gray-500"> Following</span>
                    </div>
                    <div className="hover:underline cursor-pointer">
                        <span className="font-bold">{user.followers.toLocaleString()}</span>
                        <span className="text-gray-500"> Followers</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex">
                    {['posts', 'replies', 'media', 'likes'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 font-medium text-sm ${
                                activeTab === tab
                                    ? 'text-black border-b-2 border-blue-500'
                                    : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <Timeline
                title=""
                fetchPosts={fetchPosts}
                emptyMessage={
                    <div className="text-center py-10">
                        <h3 className="text-xl font-bold mb-2">
                            @{username} hasn't posted
                        </h3>
                        <p className="text-gray-500">
                            When they do, their posts will show up here.
                        </p>
                    </div>
                }
            />
        </div>
    );
};

export default ProfilePage;