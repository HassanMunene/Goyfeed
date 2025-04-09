const Loading = () => {
    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
            {/* Animated logo */}
            <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-75"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">G</span>
                </div>
            </div>

            {/* Progress indicator */}
            <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-progress"></div>
            </div>

            {/* Loading text with animation */}
            <div className="flex space-x-2">
                <p className="text-gray-600 font-medium">Loading</p>
                <div className="flex space-x-1 items-end">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Loading;