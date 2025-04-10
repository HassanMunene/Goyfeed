import { useState, useEffect, useCallback } from "react";
import PostCard, { PostProps } from "../posts/PostCard";
import { RefreshCw } from "lucide-react";

interface ProfileTimelineProps {
    title?: string;
    fetchPosts: () => Promise<PostProps[]>;
    emptyMessage?: string | React.ReactNode;
    onPostDelete?: (postId: string) => void;
}

const ProfileTimeline = ({ title, fetchPosts, emptyMessage = "No posts to display", onPostDelete }: ProfileTimelineProps) => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // State for refreshing
    const [error, setError] = useState<string | null>(null);

    // Load posts function
    const loadPosts = useCallback(async (reset: boolean = false) => {
        try {
            if (reset) setRefreshing(true); // Set refreshing state to true on manual refresh
            setLoading(true);
            const data = await fetchPosts();

            console.log("freeeeeeeind", data);
            setPosts(data);
            setError(null);
        } catch (err) {
            setError("Failed to load posts. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false); // Set refreshing state to false after loading
        }
    }, [fetchPosts]);

    // Load posts on mount
    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    // Trigger a manual refresh
    const handleRefresh = () => {
        loadPosts(true); // Trigger refresh by resetting the posts and setting refreshing state to true
    };

    return (
        <div className="relative">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    {title && <h1 className="text-xl font-bold">{title}</h1>}
                    <div className="flex items-center gap-2">
                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing} // Disable button while refreshing
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Refresh"
                        >
                            <RefreshCw
                                size={18}
                                className={`${refreshing ? "animate-spin" : ""}`} // Add spinning animation if refreshing
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Timeline Content */}
            <div className="divide-y divide-gray-200">
                {loading && !refreshing ? (
                    <div className="flex justify-center p-8">Loading...</div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    typeof emptyMessage === "string" ? (
                        <div className="p-8 text-center text-gray-500">{emptyMessage}</div>
                    ) : (
                        emptyMessage
                    )
                ) : (
                    posts.map((post) => {
                        return (
                            <PostCard
                                key={post.id}
                                data={post}
                                onDelete={onPostDelete ? () => onPostDelete(post.id) : undefined} id={""}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProfileTimeline;