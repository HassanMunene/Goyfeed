const Home = () => {
    return (
        <div className="flex flex-row justify-start w-full">
            {/* Left Sidebar (hidden on mobile) */}
            <div className="hidden md:block md:w-[30%] lg:w-[20%] relative">
                {/* Sidebar Content */}
                <div className="fixed h-screen p-4 w-[30%] lg:w-[20%] bg-gray-50 border-r">
                    <div className="flex flex-col space-y-4">
                        {/* Logo/Brand */}
                        <div className="p-2 font-bold text-xl">SocialApp</div>
                        
                        {/* Navigation Links */}
                        <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200">
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                            Home
                        </a>
                        
                        <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200">
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            Profile
                        </a>
                        
                        {/* User Profile at Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                            <div className="flex items-center">
                                <img src="https://ui-avatars.com/api/?name=John+Doe" alt="John Doe profile" className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-semibold">John Doe</p>
                                    <p className="text-sm text-gray-500">@johndoe</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sliding Menu (hidden on desktop) */}
            <div className="md:hidden">
                {/* Mobile menu button and sliding menu would go here */}
                <div className="fixed bottom-4 left-4 z-50">
                    <button className="p-3 bg-blue-500 text-white rounded-full shadow-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Main Feed Content */}
            <div className="w-full md:w-[40%] lg:w-[60%]">
                <div className="max-w-2xl mx-auto p-4">
                    {/* Create Post */}
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <div className="flex">
                            <img src="https://ui-avatars.com/api/?name=User+Name" alt="Current user" className="w-10 h-10 rounded-full mr-3" />
                            <input type="text" placeholder="What's on your mind?" className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none" />
                        </div>
                        <div className="flex justify-between mt-3 pt-3 border-t">
                            <button className="flex items-center text-gray-500 hover:text-blue-500">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Photo
                            </button>
                            <button className="px-4 py-1 bg-blue-500 text-white rounded-full">Post</button>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-4">
                        {/* Sample Post 1 */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center mb-3">
                                <img src="https://ui-avatars.com/api/?name=Jane+Doe" alt="Jane Doe profile" className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-semibold">Jane Doe</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <p className="mb-3">Just enjoying a beautiful day at the beach! 🏖️ #summer #vacation</p>
                            <img src="https://source.unsplash.com/random/600x400/?beach" alt="Beach vacation" className="w-full rounded-lg mb-3" />
                            <div className="flex justify-between text-gray-500 border-t pt-2">
                                <button className="flex items-center hover:text-blue-500">
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                    </svg>
                                    24 Likes
                                </button>
                                <button className="hover:text-blue-500">5 Comments</button>
                            </div>
                        </div>

                        {/* Sample Post 2 */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center mb-3">
                                <img src="https://ui-avatars.com/api/?name=John+Smith" alt="John Smith profile" className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-semibold">John Smith</p>
                                    <p className="text-xs text-gray-500">5 hours ago</p>
                                </div>
                            </div>
                            <p className="mb-3">Check out this amazing recipe I tried today! Perfect for a healthy dinner.</p>
                            <div className="flex justify-between text-gray-500 border-t pt-2">
                                <button className="flex items-center hover:text-blue-500">
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                                    </svg>
                                    42 Likes
                                </button>
                                <button className="hover:text-blue-500">12 Comments</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar (hidden on mobile) */}
            <div className="hidden md:block md:w-[30%] lg:w-[20%]">
                <div className="fixed h-screen p-4 w-[30%] lg:w-[20%] bg-gray-50 border-l">
                    {/* Suggested Friends */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-3">Suggested Friends</h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <img src="https://ui-avatars.com/api/?name=Alex+Johnson" alt="Alex Johnson profile" className="w-10 h-10 rounded-full mr-3" />
                                <div className="flex-1">
                                    <p className="font-medium">Alex Johnson</p>
                                    <p className="text-xs text-gray-500">12 mutual friends</p>
                                </div>
                                <button className="text-blue-500 text-sm font-medium">Add</button>
                            </div>
                            <div className="flex items-center">
                                <img src="https://ui-avatars.com/api/?name=Sarah+Williams" alt="Sarah Williams profile" className="w-10 h-10 rounded-full mr-3" />
                                <div className="flex-1">
                                    <p className="font-medium">Sarah Williams</p>
                                    <p className="text-xs text-gray-500">8 mutual friends</p>
                                </div>
                                <button className="text-blue-500 text-sm font-medium">Add</button>
                            </div>
                        </div>
                    </div>

                    {/* Trending Topics */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3">Trending Topics</h3>
                        <div className="space-y-2">
                            <a href="#" className="block p-2 rounded-lg hover:bg-gray-200">#summer2023</a>
                            <a href="#" className="block p-2 rounded-lg hover:bg-gray-200">#technews</a>
                            <a href="#" className="block p-2 rounded-lg hover:bg-gray-200">#travel</a>
                            <a href="#" className="block p-2 rounded-lg hover:bg-gray-200">#foodie</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;