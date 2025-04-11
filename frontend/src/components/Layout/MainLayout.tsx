import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Outlet } from "react-router-dom";
import Sidebar from "../sidebars/Sidebar";
import RightSidebar from "../sidebars/RightSidebar";


const MainLayout = () => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
        <div className="relative flex min-h-screen bg-white text-black">
            {/* mobile menu only visible on small screens */}
            <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="fixed top-4 right-4 z-50 p-2 md:hidden bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <Menu className="text-[#4f46e5]" />
            </button>

            {/* Left Sidebar when scrolled we will have a subtle shadow */}
            <div
                className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${scrolled ? 'shadow-sm': ''} md:translate-x-0 transform transition-transform 
                    duration-300 ease-in-out w-[275px] border-r border-[#f0f2f5] flex-shrink-0 fixed md:sticky top-0 h-screen z-40 bg-white`}>
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

            {/* Overlay for mobile sidebar (click to close) */}
            {mobileSidebarOpen && (
                <div
                    onClick={() => setMobileSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                />
            )}
        </div>
    );
};

export default MainLayout;