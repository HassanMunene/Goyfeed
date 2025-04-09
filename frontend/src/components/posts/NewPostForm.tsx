import { useState, useRef } from "react";
import { Image, Smile, MapPin, Calendar, BarChart2, X as XIcon} from "lucide-react";

interface NewPostFormProps {
    onSubmit?: (content: string, image?: File) => void;
    placeholder?: string;
    buttonText?: string;
    showReplyInfo?: boolean;
    replyingTo?: string;
}

const NewPostForm = ({ onSubmit, placeholder = "What's on your mind?", buttonText = "Post", showReplyInfo = false, replyingTo = "" }: NewPostFormProps) => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);

        // Auto resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() !== "" || image) {
            onSubmit?.(content, image || undefined);
            setContent("");
            setImage(null);
            setImagePreview(null);
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="border-b border-x-border p-4">
            {showReplyInfo && replyingTo && (
                <div className="text-x-gray text-sm mb-2 pl-12">
                    Replying to <span className="text-x-blue">@{replyingTo}</span>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="flex">
                    <div className="mr-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    </div>
                    <div className="flex-1">
                        <textarea
                            ref={textareaRef}
                            className="w-full bg-transparent text-foreground border-none resize-none outline-none text-xl mb-3"
                            placeholder={placeholder}
                            value={content}
                            onChange={handleTextAreaChange}
                            rows={1}
                        />

                        {imagePreview && (
                            <div className="relative mb-3 rounded-2xl overflow-hidden border border-x-border">
                                <img
                                    src={imagePreview}
                                    alt="Tweet preview"
                                    className="max-h-96 w-auto"
                                />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white"
                                    onClick={removeImage}
                                >
                                    <XIcon size={16} />
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t border-x-border">
                            <div className="flex space-x-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    className="text-x-blue p-2 rounded-full hover:bg-x-blue/10"
                                    onClick={handleClickUpload}
                                >
                                    <Image size={18} />
                                </button>

                                <button type="button" className="text-x-blue p-2 rounded-full hover:bg-x-blue/10">
                                    <Smile size={18} />
                                </button>

                                <button type="button" className="text-x-blue p-2 rounded-full hover:bg-x-blue/10">
                                    <MapPin size={18} />
                                </button>

                                <button type="button" className="text-x-blue p-2 rounded-full hover:bg-x-blue/10">
                                    <Calendar size={18} />
                                </button>

                                <button type="button" className="text-x-blue p-2 rounded-full hover:bg-x-blue/10">
                                    <BarChart2 size={18} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!content.trim() && !image}
                            >
                                {buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewPostForm;