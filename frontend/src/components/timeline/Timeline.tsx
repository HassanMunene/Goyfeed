import { useState, useEffect } from "react";
import PostCard, { PostProps } from "../posts/PostCard";

interface TimelineProps {
    title: string;
    fetchPosts: () => Promise<PostProps[]> | PostProps[];
    headerAction?: React.ReactNode;
    emptyMessage?: string;
}

const Timeline = ({ title, fetchPosts, headerAction, emptyMessage = "No posts to display" }: TimelineProps) => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const data = await fetchPosts();
                setPosts(data);
                setError(null);
            } catch (err) {
                setError("Failed to load tweets. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [fetchPosts]);

    return (
        <div>
            {/* Timeline Header */}
            <div className="sticky top-0 z-10 backdrop-blur-sm bg-white/90 border-b border-x-border dark:border-x-border p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">{title}</h1>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            </div>

            {/* Timeline Content */}
            <div className="pb-16">
                {loading ? (
                    <div className="p-4 flex justify-center">
                        <div className="w-8 h-8 border-4 border-x-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">{error}</div>
                ) : posts.length === 0 ? (
                    <div className="p-8 text-center text-x-gray">{emptyMessage}</div>
                ) : (
                    posts.map((post) => <PostCard key={post.id} {...post} />)
                )}
            </div>
        </div>
    );
};

export default Timeline;