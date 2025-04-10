import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostModal from "./PostModal";
import { PenSquare } from "lucide-react";

const NewPostForm = () => {
    const { user: author } = useAuth();
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleOpenModal = () => setIsPostModalOpen(true);
    const handleCloseModal = () => setIsPostModalOpen(false);

    return (
        <>
            <div className="pt-4 pb-4 border-b border-gray-200 bg-white transition-colors duration-200">
                <div className="flex items-start gap-3">
                    {/* Avatar with gradient border */}
                    <Link
                        to={`/profile/${author?.username}`}
                        className={`relative h-12 w-12 rounded-full p-0.5 ${isHovered ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400'} transition-all duration-300`}
                    >
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                {author?.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                        </div>
                    </Link>

                    {/* Post input area */}
                    <div
                        className="flex-1"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div
                            onClick={handleOpenModal}
                            className="cursor-text w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-2xl p-4 hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">
                                    What's on your mind?
                                </span>
                                <PenSquare
                                    size={20}
                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <PostModal isOpen={isPostModalOpen} onRequestClose={handleCloseModal} />
        </>
    );
};

export default NewPostForm;