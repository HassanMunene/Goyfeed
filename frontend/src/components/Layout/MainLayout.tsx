import { Outlet } from "react-router-dom";
import Sidebar from "../sidebars/Sidebar";
import RightSidebar from "../sidebars/RightSidebar";


const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-white text-black">
            {/* Left Sidebar */}
            <div className="w-[275px] border-r border-x-border dark:border-x-border flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 border-r border-x-border dark:border-x-border min-h-screen">
                <Outlet />
            </div>

            {/* Right Sidebar */}
            <div className="w-[350px] sticky top-0 h-screen overflow-y-auto hidden xl:block">
                <RightSidebar />
            </div>
        </div>
    );
};

export default MainLayout;