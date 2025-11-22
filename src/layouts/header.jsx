// import PropTypes from "prop-types";
// import images from "../assets/images";

// export const Header = ({ toggleSidebar, adminName, adminEmail }) => {
//     return (
//         <header className="fixed left-0 right-0 top-0 z-50 bg-white shadow-sm">
//             <nav className="flex items-center justify-between gap-5 px-4 py-3 md:px-6">
//                 <div className="flex items-center gap-3">
//                     {/* Mobile Menu Toggle */}
//                     <button
//                         onClick={toggleSidebar}
//                         className="flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
//                         aria-label="Toggle sidebar"
//                     >
//                         <svg
//                             width="24"
//                             height="24"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 d="M3 6h18M3 12h18M3 18h18"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                             />
//                         </svg>
//                     </button>

//                     <img
//                         src={images.keroLogo}
//                         className="h-8 md:h-10"
//                         alt="1Kero Logo"
//                     />
//                 </div>

//                 <div className="flex items-center gap-3">
//                     <div className="hidden items-center gap-3 md:flex">
//                         <img
//                             src={images.user}
//                             alt="User"
//                             className="h-10 w-10 rounded-full object-cover"
//                         />
//                         <div>
//                             <p className="text-sm font-medium text-gray-900">{adminName || "Kero Admin"}</p>
//                             <p className="text-xs text-gray-500">{adminEmail || "kero@gmail.com"}</p>
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//         </header>
//     );
// };

// Header.propTypes = {
//     toggleSidebar: PropTypes.func.isRequired,
//     adminName: PropTypes.string,
//     adminEmail: PropTypes.string,
// };
import PropTypes from "prop-types";
import { Menu, Bell, Search } from "lucide-react";
import images from "../assets/images";

export const Header = ({ toggleSidebar, adminName, adminEmail }) => {
    return (
        <header className="fixed left-0 right-0 top-0 z-50 h-16 bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
            <nav className="flex h-full items-center justify-between px-4 md:px-6">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleSidebar}
                        className="rounded-lg p-2 text-white transition-all duration-200 hover:bg-white/10 md:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src={images.keroLogoWhite}
                            className="h-5 md:h-6"
                            alt="1Kero Logo"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Search - Desktop only */}
                    <button className="hidden items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white transition-all duration-200 hover:bg-white/20 lg:flex">
                        <Search size={18} />
                        <span className="text-sm">Search...</span>
                    </button>

                    {/* Notifications */}
                    <button className="relative rounded-lg p-2 text-white transition-all duration-200 hover:bg-white/10">
                        <Bell size={20} />
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>

                    {/* User Profile */}
                    <div className="hidden items-center gap-3 border-l border-white/20 pl-3 md:flex">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-white">{adminName || "Kero Admin"}</p>
                            <p className="text-xs text-primary-100">{adminEmail || "kero@gmail.com"}</p>
                        </div>
                        <img
                            src={images.user}
                            alt="User"
                            className="h-10 w-10 rounded-full border-2 border-white/30 object-cover"
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
};

Header.propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
    adminName: PropTypes.string,
    adminEmail: PropTypes.string,
};
