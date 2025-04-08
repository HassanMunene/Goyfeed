import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  Settings,
  MoreHorizontal,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full p-4">
      {/* X Logo */}
      <Link to="/" className="p-3 rounded-full hover:bg-x-extraLightGray dark:hover:bg-x-gray/10 inline-block mb-2">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-7 h-7 fill-current"
        >
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
      </Link>

      {/* Nav Items */}
      <nav className="mb-4 mt-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <Home className="sidebar-icon mr-4" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <Search className="sidebar-icon mr-4" />
          <span>Explore</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <Bell className="sidebar-icon mr-4" />
          <span>Notifications</span>
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <Mail className="sidebar-icon mr-4" />
          <span>Messages</span>
        </NavLink>

        <NavLink
          to="/bookmarks"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <Bookmark className="sidebar-icon mr-4" />
          <span>Bookmarks</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <User className="sidebar-icon mr-4" />
          <span>Profile</span>
        </NavLink>

        <div className="sidebar-item">
          <MoreHorizontal className="sidebar-icon mr-4" />
          <span>More</span>
        </div>
      </nav>

      {/* Post Button */}
      <button className="font-bold">
        Post
      </button>

      {/* Profile Button */}
      <div className="mt-auto pt-2">
        <button
          className="flex items-center justify-between w-full p-3 rounded-full hover:bg-x-extraLightGray dark:hover:bg-x-gray/10"
          type="button">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <div className="font-bold">Username</div>
              <div className="text-x-gray">@username</div>
            </div>
          </div>
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;