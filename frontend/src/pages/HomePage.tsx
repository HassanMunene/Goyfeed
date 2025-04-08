import { useCallback, useState } from "react";

import Timeline from "../components/timeline/Timeline";
import NewPostForm from "../components/posts/NewPostForm";
import { fetchHomeTimeline, createPost } from "../components/lib/mockData";

const HomePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

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

  const fetchPosts = useCallback(async () => {
    return fetchHomeTimeline();
  }, [refreshKey]); // Depend on refreshKey to refetch when it changes

  return (
    <div className="min-h-screen">
      {/* New Tweet Form */}
      <NewPostForm onSubmit={handleSubmitPost} />

      {/* Timeline */}
      <Timeline
        title="Home"
        fetchPosts={fetchPosts}
        emptyMessage="No posts to display. Follow some users to see their posts here!"
      />
    </div>
  );
};

export default HomePage;