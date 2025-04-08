import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebars/Sidebar";
import RightSidebar from "../sidebars/RightSidebar";


const MainLayout = () => {
    // we need to find a way we can sense the scrolling to add some stylings
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-white text-black">
            {/* Left Sidebar when scrolled we will have a subtle shadow */}
            <div className={`w-[275px] border-r border-[#f0f2f5] flex-shrink-0 sticky top-0 h-screen z-20  ${scrolled ? 'shadow-sm' : ''}`}>
                <Sidebar />
            </div>

            {/* Main Content this section should be flexible*/}
            <main className="flex-1 border-r border-[#f0f2f5] min-h-screen">
                <div className="max-w-2xl mx-auto p-0 sm:p-4">
                    <Outlet />
                </div>
            </main>

            {/* Right Sidebar - Conditional display only on lg screens and above */}
            <aside className="hidden lg:block w-[350px] sticky top-0 h-screen overflow-y-auto no-scrollbar">
                <RightSidebar />
            </aside>
        </div>
    );
};

export default MainLayout;