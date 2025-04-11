import NewPostForm from "./NewPostForm";

const EmptyPostComponent = () => {
    return (
        <div className="min-h-screen">
            {/* Sticky header with post form */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm pb-2 px-4 md:-mx-4">
                <NewPostForm />
            </div>

            {/* Empty state content */}
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
                <div className="max-w-md mx-auto">
                    {/* Animated illustration */}
                    <div className="relative w-64 h-64 mx-auto mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse opacity-70"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-40 w-40 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Text content */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">It's quiet here...</h2>
                    <p className="text-gray-500 mb-6">
                        No posts yet. Share your thoughts and start the conversation!
                    </p>

                    {/* Secondary CTA */}
                    <button
                        onClick={() => document.getElementById("new-post-input")?.focus()}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg"
                    >
                        Create First Post
                    </button>

                    {/* Fun decorative elements */}
                    <div className="mt-12 flex justify-center space-x-4 opacity-50">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EmptyPostComponent;