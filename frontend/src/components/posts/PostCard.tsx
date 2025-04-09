import { useState } from "react";
import { MessageCircle, Heart, Upload, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate, formatNumber } from "../lib/utils";


export interface PostProps {
    id: string;
    user: {
        id: string;
        name: string;
        username: string;
        avatar: string;
        verified?: boolean;
    };
    content: string;
    timestamp: Date;
    isLiked: boolean;
    media?: { type: string; url: string }[];
    image?: string;
    createdAt: string | Date;
    metrics: {
        replies: number;
        likes: number;
    };
    author: {
        name: string;
        avatar: string;
        handle: string;
        verified?: boolean;
    };
    onDelete?: () => void;
}


const PostCard = ({ user, content, image, createdAt, metrics }: PostProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(metrics.likes);

    const handleLike = () => {
        if (isLiked) {
            setLikeCount(prev => prev - 1);
        } else {
            setLikeCount(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    return (
        <div className="border-b border-x-border p-4 hover:bg-black/[0.02] cursor-pointer transition-colors relative">
            {/* User who posted */}
            <div className="flex">
                <Link to={`/${user.username}`} className="mr-3">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </Link>
                <div className="flex-1">
                    {/* User Info and Date */}
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <Link to={`/${user.username}`} className="flex items-center">
                                <span className="font-bold hover:underline mr-1">
                                    {user.name}
                                </span>
                                {user.verified && (
                                    <span className="text-x-blue">
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-label="Verified account"
                                            className="w-4 h-4 fill-current"
                                        >
                                            <g>
                                                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                                            </g>
                                        </svg>
                                    </span>
                                )}
                                <span className="text-x-gray ml-1">@{user.username}</span>
                                <span className="mx-1 text-x-gray">·</span>
                                <span className="text-x-gray hover:underline">
                                    {formatDate(createdAt)}
                                </span>
                            </Link>
                        </div>
                        <button
                            aria-label="More options"
                            className="text-x-gray hover:text-x-blue hover:bg-x-blue/10 rounded-full p-1.5"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Post Content */}
                    <div className="mb-3">
                        <p className="whitespace-pre-wrap">{content}</p>
                    </div>

                    {/* Post Image (if any) */}
                    {image && (
                        <div className="mb-3 rounded-2xl overflow-hidden border border-x-border">
                            <img src={image} alt="Tweet media" className="w-full h-auto" />
                        </div>
                    )}

                    {/* Tweet Actions */}
                    <div className="flex justify-between mt-2 tweet-actions max-w-md">
                        <button
                            className="flex items-center"
                            aria-label={`Reply, ${metrics.replies} ${metrics.replies === 1 ? "reply" : "replies"
                                }`}
                        >
                            <MessageCircle className="h-5 w-5" />
                            {metrics.replies > 0 && (
                                <span className="ml-1 text-sm">{formatNumber(metrics.replies)}</span>
                            )}
                        </button>
                        <button
                            className={`flex items-center ${isLiked ? "text-rose-500 hover:text-rose-600" : ""
                                }`}
                            onClick={handleLike}
                            aria-label={`Like, ${likeCount} ${likeCount === 1 ? "like" : "likes"
                                }`}
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? "fill-rose-500" : ""}`} />
                            {likeCount > 0 && (
                                <span className="ml-1 text-sm">{formatNumber(likeCount)}</span>
                            )}
                        </button>
                        <button className="flex items-center" aria-label="Share">
                            <Upload className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;