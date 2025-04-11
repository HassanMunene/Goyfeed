import { useState } from "react";
import { MessageCircle, Heart, Upload, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { formatNumber } from "../lib/utils";

export interface PostProps {
    id: string;
    data: any;
    onDelete?: () => void;
}

const PostCard = ({ data }: PostProps) => {

    console.log("yooooooananan", data);
    const {
        content,
        image,
        createdAt,
        author,
        isLiked: initiallyLiked,
        likesCount,
        commentsCount
    } = data;

    console.log("umamamamamma", createdAt);

    const [isLiked, setIsLiked] = useState(initiallyLiked);
    const [likeCount, setLikeCount] = useState<number>(likesCount);

    const handleLike = () => {
        if (isLiked) {
            setLikeCount((prev) => prev - 1);
        } else {
            setLikeCount((prev) => prev + 1);
        }
        setIsLiked(!isLiked);
        // You could also trigger a like mutation here
    };

    return (
        <div className="border-b border-x-border p-4 hover:bg-black/[0.02] cursor-pointer transition-colors relative">
            <div className="flex">
                <Link to={`/profile/${author.username}`} className="mr-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4f46e5] to-[#e946b8] rounded-full mr-3 flex items-center justify-center text-white font-bold">
                        {author?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                </Link>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <Link to={`/${author.username}`} className="flex items-center">
                                <span className="font-bold hover:underline mr-1">
                                    {author.name}
                                </span>
                                <span className="text-x-gray ml-1">@{author.username}</span>
                                <span className="mx-1 text-x-gray">·</span>
                                <span className="text-gray-500 text-sm hover:underline truncate md:text-base">
                                    {isNaN(new Date(Number(createdAt)).getTime())
                                        ? "Invalid Date"
                                        : new Date(Number(createdAt)).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
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

                    {/* Content */}
                    <div className="mb-3">
                        <p className="whitespace-pre-wrap">{content}</p>
                    </div>

                    {/* Image */}
                    {image && (
                        <div className="mb-3 rounded-2xl overflow-hidden border border-x-border">
                            <img src={image} alt="Post media" className="w-full h-auto" />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between mt-2 tweet-actions max-w-md">
                        <button className="flex items-center" aria-label="Reply">
                            <MessageCircle className="h-5 w-5" />
                            {commentsCount > 0 && (
                                <span className="ml-1 text-sm">
                                    {formatNumber(commentsCount)}
                                </span>
                            )}
                        </button>
                        <button
                            className={`flex items-center ${isLiked ? "text-rose-500 hover:text-rose-600" : ""}`}
                            onClick={handleLike}
                            aria-label="Like"
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? "fill-rose-500" : ""}`} />
                            {likeCount > 0 && (
                                <span className="ml-1 text-sm">
                                    {formatNumber(likeCount)}
                                </span>
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