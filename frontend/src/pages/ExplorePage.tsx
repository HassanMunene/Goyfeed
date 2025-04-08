import { Search } from "lucide-react";

const ExplorePage = () => {
  const suggestedUsers = [
    { name: 'Alex Designer', handle: '@alexcreative', followers: '12K' },
    { name: 'Tech Guru', handle: '@reactmaster', followers: '45K' },
    { name: 'Travel Blogger', handle: '@wanderlust', followers: '32K' }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-2 -mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search people..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
          />
        </div>
      </div>

      {/* Suggested Users */}
      <section>
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>
        <div className="space-y-4">
          {suggestedUsers.map((user, index) => (
            <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4f46e5] to-[#e946b8] rounded-full mr-3 flex items-center justify-center text-white">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.handle} · {user.followers} followers</p>
                </div>
              </div>
              <button className="px-4 py-1 bg-black text-white text-sm font-bold rounded-full hover:opacity-90 cursor-pointer">
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Posts */}
      <section>
        <h2 className="text-xl font-bold mb-4">Popular Posts</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                <span className="font-medium">@user{i+1}</span>
              </div>
              <p className="mb-3">Just discovered this amazing feature in #SocialApp! The UI is so intuitive and the community is thriving.</p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>♥️ 142</span>
                <span>↩️ 24</span>
                <span>⏱️ 2h</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;