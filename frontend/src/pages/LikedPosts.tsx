import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";


const LikedPostsPage = () => {


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
                        <p className="text-sm text-gray-500">liked posts</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LikedPostsPage;