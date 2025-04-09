import { Search, Users, UserPlus } from "lucide-react";
import { useState } from "react";

const RightSidebar = () => {
  const [searchInput, setSearchInput] = useState("");

  const activeFriends = [
    { id: 1, name: "Alex", avatar: "https://i.pravatar.cc/150?img=1", status: "online" },
    { id: 2, name: "Sam", avatar: "https://i.pravatar.cc/150?img=2", status: "online" },
    { id: 3, name: "Jordan", avatar: "https://i.pravatar.cc/150?img=3", status: "away" }
  ];

  const whoToFollow = [
    { id: 1, name: "Lena", username: "@lena_dev", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 2, name: "Chris", username: "@chris88", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 3, name: "Nia", username: "@niawrites", avatar: "https://i.pravatar.cc/150?img=6" }
  ];

  return (
    <div className="w-[350px] p-4 space-y-6 sticky top-0 h-screen overflow-y-auto no-scrollbar">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search people or posts"
          className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Active Friends */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h2 className="flex items-center text-lg font-semibold mb-3">
          <Users className="mr-2 h-5 w-5" />
          Active Now
        </h2>
        <div className="space-y-4">
          {activeFriends.map((friend) => (
            <div key={friend.id} className="flex items-center">
              <div className="relative mr-3">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full"
                />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  friend.status === "online" ? "bg-green-500" : "bg-yellow-500"
                }`}></span>
              </div>
              <div>
                <p className="font-medium">{friend.name}</p>
                <p className="text-xs text-gray-500 capitalize">{friend.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Who to Follow */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h2 className="flex items-center text-lg font-semibold mb-3">
          <UserPlus className="mr-2 h-5 w-5" />
          Who to Follow
        </h2>
        <div className="space-y-4">
          {whoToFollow.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.username}</p>
                </div>
              </div>
              <button className="text-sm bg-black text-white px-3 py-1 rounded-full hover:opacity-90">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;