import React from "react";
import { IoIosMenu } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";


const Topbar = () => {
    return (
        <div className="flex items-center justify-between h-14 w-full bg-[#1877f2] sticky top-0 z-50 px-4 py-1">
            {/* logo and mobile menu button */}
            <div className="flex items-center w-[30%]">
                <button className="md:hidden text-white mr-2">
                    <IoIosMenu />
                </button>
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-white text-xl font-bold">Goy-Feed</span>
                </Link>
            </div>
            {/* Right section */}
            <div className="flex items-center justify-end w-[30%] text-white space-x-4">
                <div className="relative cursor-pointer">
                    <IoPerson className="text-2xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        2
                    </span>
                </div>

                {/* Settings */}
                <div className="cursor-pointer">
                    <IoMdSettings className="text-2xl" />
                </div>
            </div>
        </div >
    )
}

export default Topbar;