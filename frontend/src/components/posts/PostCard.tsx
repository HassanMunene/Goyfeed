import { useState } from "react";
import { MessageCircle, Heart, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { formatNumber } from "../lib/utils";

export interface PostProps {
    id: string;
    data: any;
    content: string;
    image?: string;
    createdAt: string;
    isLiked: boolean;
    likesCount: number;
    commentsCount: number;
    user: any;
    onDelete?: () => void;
}

const PostCard = ({ data }: PostProps) => {
    const {
        content,
        image,
        createdAt,
        author,
        isLiked: initiallyLiked,
        likesCount,
        commentsCount
    } = data;

    const [isLiked, setIsLiked] = useState(initiallyLiked);
    const [likeCount, setLikeCount] = useState<number>(likesCount);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
        // You can also trigger a mutation here
    };

    return (
        <div className="p-6 bg-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <Link to={`/profile/${author.username}`} className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-medium">
                            {author?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                    </Link>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center space-x-2">
                        <Link to={`/profile/${author.username}`}>
                            <p className="font-bold text-gray-900 hover:underline">
                                @{author.username}
                            </p>
                        </Link>
                        <span className="text-gray-500 text-sm">·</span>
                        <p className="text-gray-500 text-sm">
                            {new Date(Number(createdAt)).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>

                    {/* Body Text */}
                    <p className="mt-1 text-gray-800 whitespace-pre-line">{content}</p>

                    {/* Image (if any) */}
                    {image && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                            <img
                                src={image}
                                alt="Post content"
                                className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                            <MessageCircle className="h-5 w-5" />
                            {commentsCount > 0 && (
                                <span className="text-sm">{formatNumber(commentsCount)}</span>
                            )}
                        </button>

                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-1 ${
                                isLiked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-red-500"
                            }`}
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
                            {likeCount > 0 && (
                                <span className="text-sm">{formatNumber(likeCount)}</span>
                            )}
                        </button>

                        <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                            <Upload className="h-5 w-5" />
                            <span className="text-sm">Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;