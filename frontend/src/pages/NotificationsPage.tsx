import { Heart, UserPlus, MessageSquare, Repeat, Bell } from "lucide-react";

const NotificationsPage = () => {
  // Sample notification data
  const notifications = [
    {
      type: 'like',
      user: 'Alex Designer',
      handle: '@alexcreative',
      time: '2m ago',
      postPreview: 'Your UI design tips are amazing!',
      read: false
    },
    {
      type: 'follow',
      user: 'Tech Guru',
      handle: '@reactmaster',
      time: '15m ago',
      read: false
    },
    {
      type: 'comment',
      user: 'Travel Blogger',
      handle: '@wanderlust',
      time: '1h ago',
      postPreview: 'Just tried your recommendation in Bali!',
      read: true
    },
    {
      type: 'repost',
      user: 'Dev Newbie',
      handle: '@codingjourney',
      time: '3h ago',
      postPreview: 'Learned so much from your post!',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'like': return <Heart className="text-red-500" />;
      case 'follow': return <UserPlus className="text-blue-500" />;
      case 'comment': return <MessageSquare className="text-green-500" />;
      case 'repost': return <Repeat className="text-purple-500" />;
      default: return <Bell className="text-yellow-500" />;
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Bell className="mr-2" />
        Notifications
      </h1>

      {/* Notification Tabs */}
      <div className="flex border-b mb-4">
        <button className="px-4 py-2 font-medium border-b-2 border-black">
          All
        </button>
        <button className="px-4 py-2 text-gray-500">
          Mentions
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${notification.read ? 'bg-white' : 'bg-blue-50 border-l-4 border-blue-500'}`}
          >
            <div className="flex items-start">
              <div className="p-2 mr-3 bg-gray-100 rounded-full">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-semibold mr-1">{notification.user}</span>
                  <span className="text-gray-500">{notification.handle}</span>
                  <span className="mx-1">·</span>
                  <span className="text-gray-400 text-sm">{notification.time}</span>
                </div>
                {notification.postPreview && (
                  <p className="mt-1 text-gray-700">
                    {notification.postPreview}
                  </p>
                )}
                {notification.type === 'follow' && (
                  <button className="mt-2 px-3 py-1 bg-black text-white text-xs font-bold rounded-full hover:opacity-90">
                    Follow back
                  </button>
                )}
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;