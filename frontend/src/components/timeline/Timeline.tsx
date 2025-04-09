import { useState, useEffect, useRef, useCallback } from "react";

import NewPostForm from "../posts/NewPostForm";
import PostCard, { PostProps } from "../posts/PostCard";
import { Loader2, RefreshCw } from "lucide-react";
import { createPost } from "../lib/mockData";

interface TimelineProps {
  title?: string;
  fetchPosts: () => Promise<PostProps[]> | PostProps[];
  headerAction?: React.ReactNode;
  emptyMessage?: string | React.ReactNode;
  onPostDelete?: (postId: string) => void;
}

const Timeline = ({
  title,
  fetchPosts,
  headerAction,
  emptyMessage = "No posts to display",
  onPostDelete
}: TimelineProps) => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadPosts = useCallback(async (reset = false) => {
    try {
      reset ? setRefreshing(true) : setLoading(true);
      const data = await fetchPosts();
      setPosts(prev => reset ? data : [...prev, ...data]);
      setError(null);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
      console.error(err);
    } finally {
      reset ? setRefreshing(false) : setLoading(false);
    }
  }, [fetchPosts]);

  // Infinite scroll setup
  useEffect(() => {
    if (loading || !loadingRef.current) return;

    const handleObserver: IntersectionObserverCallback = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setPage(prev => prev + 1);
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    observer.current.observe(loadingRef.current);

    return () => observer.current?.disconnect();
  }, [loading]);

  // Initial load and refresh
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleSubmitPost = useCallback(async (content: string, image?: File) => {
    try {
      // In a real app, we would upload the image first and get a URL
      let imageUrl;
      if (image) {
        // Mock image upload by just using the local object URL
        imageUrl = URL.createObjectURL(image);
      }

      // Create the post
      await createPost("1", content, imageUrl);

      // Force a refresh of the timeline
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Failed to make a post:", error);
    }
  }, []);

  const handleRefresh = () => {
    setPage(1);
    loadPosts(true);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    onPostDelete?.(postId);
  };

  return (
    <div className="relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {title && <h1 className="text-xl font-bold">{title}</h1>}
          <div className="flex items-center gap-2">
            {headerAction}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw
                size={18}
                className={`${refreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>
      <NewPostForm onSubmit={handleSubmitPost} />
      {/* Timeline Content */}
      <div className="divide-y divide-gray-200">
        {loading && !refreshing ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => loadPosts(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          typeof emptyMessage === 'string' ? (
            <div className="p-8 text-center text-gray-500">
              {emptyMessage}
            </div>
          ) : (
            emptyMessage
          )
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                {...post}
                onDelete={onPostDelete ? () => handleDeletePost(post.id) : undefined}
              />
            ))}

            {/* Infinite scroll loader */}
            <div ref={loadingRef} className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Timeline;