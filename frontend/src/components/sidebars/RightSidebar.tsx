import { useState } from "react";
import { Search } from "lucide-react";

// Mock data for trends
const TRENDING_TOPICS = [
    {
        id: 1,
        category: "Sports",
        title: "World Cup",
        posts: "125K",
    },
    {
        id: 2,
        category: "Politics",
        title: "Election Results",
        posts: "340K",
    },
    {
        id: 3,
        category: "Entertainment",
        title: "Movie Awards",
        posts: "85K",
    },
    {
        id: 4,
        category: "Technology",
        title: "X Updates",
        posts: "55K",
    },
    {
        id: 5,
        category: "Science",
        title: "Space Exploration",
        posts: "35K",
    },
];

// Mock data for who to follow
const WHO_TO_FOLLOW = [
    {
        id: 1,
        name: "Tech News",
        handle: "@technews",
        avatar: "https://placehold.co/40",
        verified: true,
    },
    {
        id: 2,
        name: "Music Daily",
        handle: "@musicdaily",
        avatar: "https://placehold.co/40",
        verified: false,
    },
    {
        id: 3,
        name: "Sports Center",
        handle: "@sportscenter",
        avatar: "https://placehold.co/40",
        verified: true,
    },
];

const RightSidebar = () => {
    const [searchInput, setSearchInput] = useState("");

    return (
        <div className="px-4 py-3">
            {/* Search Bar */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-x-gray" />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-x-extraLightGray dark:bg-x-gray/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-x-blue"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            </div>

            {/* Trending Section */}
            <div className="bg-x-extraLightGray dark:bg-x-gray/10 rounded-2xl mb-4">
                <h2 className="text-xl font-bold p-4">Trends for you</h2>
                <div>
                    {TRENDING_TOPICS.map((topic) => (
                        <div
                            key={topic.id}
                            className="px-4 py-3 hover:bg-x-extraLightGray/70 dark:hover:bg-x-gray/20 cursor-pointer transition-colors"
                        >
                            <div className="text-xs text-x-gray">{topic.category}</div>
                            <div className="font-bold mt-0.5">{topic.title}</div>
                            <div className="text-xs text-x-gray mt-0.5">
                                {topic.posts} posts
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4">
                    <button className="text-x-blue w-full text-left">
                        Show more
                    </button>
                </div>
            </div>

            {/* Who to follow */}
            <div className="bg-x-extraLightGray dark:bg-x-gray/10 rounded-2xl">
                <h2 className="text-xl font-bold p-4">Who to follow</h2>
                <div>
                    {WHO_TO_FOLLOW.map((profile) => (
                        <div
                            key={profile.id}
                            className="px-4 py-3 hover:bg-x-extraLightGray/70 dark:hover:bg-x-gray/20 cursor-pointer transition-colors flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <div className="flex items-center">
                                        <span className="font-bold">{profile.name}</span>
                                        {profile.verified && (
                                            <span className="ml-1 text-x-blue">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    aria-label="Verified account"
                                                    className="w-4 h-4 fill-current"
                                                >
                                                    <g>
                                                        <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"></path>
                                                    </g>
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-x-gray text-sm">{profile.handle}</div>
                                </div>
                            </div>
                            <button>
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
                <div className="p-4">
                    <button className="text-x-blue w-full text-left">
                        Show more
                    </button>
                </div>
            </div>

            {/* Footer Links */}
            <div className="mt-4 text-x-gray text-xs">
                <div className="flex flex-wrap gap-2">
                    <a href="#" className="hover:underline">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:underline">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:underline">
                        Cookie Policy
                    </a>
                    <a href="#" className="hover:underline">
                        Accessibility
                    </a>
                    <a href="#" className="hover:underline">
                        Ads Info
                    </a>
                    <a href="#" className="hover:underline">
                        More
                    </a>
                </div>
                <div className="mt-2">© 2024 X Corp.</div>
            </div>
        </div>
    );
};

export default RightSidebar;