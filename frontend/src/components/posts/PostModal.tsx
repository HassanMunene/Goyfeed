import { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../context/AuthContext";
import { X, Camera } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const PostModal = ({ isOpen, onRequestClose }: { isOpen: boolean; onRequestClose: () => void }) => {
    const { user } = useAuth();
    const [postContent, setPostContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

    // Convert file to full base64 data URL
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    resolve(reader.result as string); // Full data URL
                } else {
                    reject("Failed to convert to base64");
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handlePostSubmit = async () => {
        if (!postContent.trim()) return;

        try {
            setLoading(true);
            setError(null);

            const variables: { content: string; image?: string } = {
                content: postContent
            };

            if (base64Image) {
                variables.image = base64Image; // Full data URL
            }

            const query = `
                mutation CreatePost($content: String!, $image: String) {
                    createPost(content: $content, image: $image) {
                        id
                        content
                        image
                        createdAt
                        author {
                            id
                            name
                            username
                        }
                    }
                }
            `;

            const response = await fetch(graphqlEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            const result = await response.json();

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            if (!result.data?.createPost?.id) {
                throw new Error("Post creation failed - no ID returned");
            }

            // Reset form on success
            setPostContent("");
            setImage(null);
            setBase64Image(null);
            onRequestClose();
            navigate("/", { replace: true });
        } catch (error: any) {
            console.error("Post creation error:", error);
            setError(error.message || "Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                try {
                    const file = acceptedFiles[0];
                    setImage(file);
                    const base64 = await convertToBase64(file);
                    setBase64Image(base64);
                } catch (err) {
                    console.error("Image conversion error:", err);
                    setError("Failed to process image");
                }
            }
        },
    });

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="z-100 relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 outline-none"
            overlayClassName="modal-overlay"
            closeTimeoutMS={200}
        >
            <div className="p-6">
                <button
                    onClick={onRequestClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-pink-500 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                        {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-semibold text-indigo-600">{user?.name}</div>
                        <div className="text-sm text-gray-500">@{user?.username}</div>
                    </div>
                </div>

                <textarea
                    className="w-full p-4 border border-gray-200 rounded-xl mb-4 resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={4}
                />

                {image && base64Image && (
                    <div className="relative mb-4">
                        <img
                            src={base64Image}
                            alt="Preview"
                            className="w-full rounded-lg mb-2 max-h-60 object-cover"
                        />
                        <button
                            onClick={() => {
                                setImage(null);
                                setBase64Image(null);
                            }}
                            className="absolute top-2 right-2 bg-gray-700/80 hover:bg-gray-700 text-white rounded-full p-1 transition"
                            aria-label="Remove image"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-lg p-4 mb-4 text-center cursor-pointer transition"
                >
                    <input {...getInputProps()} />
                    <div className="flex justify-center items-center text-gray-600">
                        <Camera size={24} className="mr-2" />
                        <span>Drag or click to attach an image</span>
                    </div>
                </div>

                {error && (
                    <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
                )}

                <button
                    onClick={handlePostSubmit}
                    disabled={!postContent.trim() || loading}
                    className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </div>
        </Modal>
    );
};

export default PostModal;