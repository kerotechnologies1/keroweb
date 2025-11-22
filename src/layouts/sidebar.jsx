// import { useState } from "react";
// import PropTypes from "prop-types";
// import { NavLink, useLocation } from "react-router-dom";
// import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
// import images from "../assets/images";
// import SOSDeactivationModal from "@/components/SOSDeactivationModal";

// export const AppSidebar = ({
//     toggled,
//     collapsed,
//     handleToggleSidebar,
//     menuItems = [],
//     title = "Kero Admin",
//     email = "kero@gmail.com",
//     logo = images.keroLogo,
// }) => {
//     const location = useLocation();
//     const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

//     const handleMenuItemClick = (item) => {
//         // Check if this is the SOS deactivation action
//         if (item.isAction && item.path.includes("deactivate-sos")) {
//             setIsSOSModalOpen(true);
//             return;
//         }

//         // For mobile, close sidebar on navigation
//         if (toggled) {
//             handleToggleSidebar(false);
//         }
//     };

//     return (
//         <>
//             <Sidebar
//                 collapsed={collapsed}
//                 toggled={toggled}
//                 onBackdropClick={() => handleToggleSidebar(false)}
//                 breakPoint="md"
//                 backgroundColor="#ffffff"
//                 style={{
//                     height: "100vh",
//                     position: "fixed",
//                     top: 0,
//                     left: 0,
//                     paddingTop: "64px",
//                 }}
//                 width="250px"
//                 collapsedWidth="70px"
//                 rootStyles={{
//                     ".ps-sidebar-container": {
//                         overflowY: "auto",
//                         scrollbarWidth: "thin",
//                         scrollbarColor: "#cbd5e0 transparent",
//                     },
//                     ".ps-sidebar-container::-webkit-scrollbar": {
//                         width: "2px",
//                     },
//                     ".ps-sidebar-container::-webkit-scrollbar-track": {
//                         background: "transparent",
//                     },
//                     ".ps-sidebar-container::-webkit-scrollbar-thumb": {
//                         background: "#cbd5e0",
//                         borderRadius: "10px",
//                     },
//                     ".ps-sidebar-container::-webkit-scrollbar-thumb:hover": {
//                         background: "#a0aec0",
//                     },
//                 }}
//             >
//                 {/* Mobile Header inside Sidebar */}
//                 <div
//                     className="border-b border-gray-200 bg-white p-4 md:hidden"
//                     style={{ marginTop: "-64px", paddingTop: "80px" }}
//                 >
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <img
//                                 src={logo}
//                                 alt="Logo"
//                                 className="h-10 w-10"
//                             />
//                             <div>
//                                 <p className="text-base font-semibold text-gray-900">{title}</p>
//                                 <p className="text-sm text-gray-500">{email}</p>
//                             </div>
//                         </div>
//                         <button
//                             onClick={() => handleToggleSidebar(false)}
//                             className="rounded-lg p-2 transition-colors hover:bg-gray-100"
//                             aria-label="Close"
//                         >
//                             <svg
//                                 width="20"
//                                 height="20"
//                                 viewBox="0 0 20 20"
//                                 fill="none"
//                             >
//                                 <path
//                                     d="M15 5L5 15M5 5l10 10"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                 />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Sidebar Menu */}
//                 <Menu
//                     menuItemStyles={{
//                         button: ({ active }) => ({
//                             padding: "12px 20px",
//                             margin: "4px 8px",
//                             borderRadius: "8px",
//                             backgroundColor: active ? "#aa8642" : "transparent",
//                             color: active ? "#ffffff" : "#374151",
//                             fontWeight: active ? "500" : "400",
//                             transition: "all 0.2s ease",
//                             "&:hover": {
//                                 backgroundColor: active ? "#8b6d35" : "#f3f4f6",
//                             },
//                         }),
//                     }}
//                     rootStyles={{
//                         padding: "16px 0",
//                     }}
//                 >
//                     {menuItems.map(({ label, path, icon: Icon, isAction }) => {
//                         // If it's an action item (like SOS deactivation), handle differently
//                         if (isAction) {
//                             return (
//                                 <MenuItem
//                                     key={path}
//                                     active={false}
//                                     icon={Icon && <Icon size={20} />}
//                                     onClick={() => handleMenuItemClick({ label, path, icon: Icon, isAction })}
//                                     style={{ cursor: "pointer" }}
//                                 >
//                                     {!collapsed && label}
//                                 </MenuItem>
//                             );
//                         }

//                         // Regular navigation items
//                         return (
//                             <MenuItem
//                                 key={path}
//                                 active={location.pathname === path}
//                                 icon={Icon && <Icon size={20} />}
//                                 component={<NavLink to={path} />}
//                                 onClick={() => handleMenuItemClick({ label, path, icon: Icon, isAction })}
//                             >
//                                 {!collapsed && label}
//                             </MenuItem>
//                         );
//                     })}
//                 </Menu>
//             </Sidebar>

//             {/* SOS Deactivation Modal */}
//             <SOSDeactivationModal
//                 isOpen={isSOSModalOpen}
//                 onClose={() => setIsSOSModalOpen(false)}
//             />
//         </>
//     );
// };

// AppSidebar.propTypes = {
//     toggled: PropTypes.bool.isRequired,
//     collapsed: PropTypes.bool.isRequired,
//     handleToggleSidebar: PropTypes.func.isRequired,
//     handleCollapsedChange: PropTypes.func.isRequired,
//     menuItems: PropTypes.arrayOf(
//         PropTypes.shape({
//             label: PropTypes.string.isRequired,
//             path: PropTypes.string.isRequired,
//             icon: PropTypes.elementType.isRequired,
//             isAction: PropTypes.bool,
//         }),
//     ),
//     title: PropTypes.string,
//     email: PropTypes.string,
//     logo: PropTypes.string,
// };
import { useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import images from "../assets/images";
import SOSDeactivationModal from "@/components/SOSDeactivationModal";
import { useMediaQuery } from "react-responsive";

export const AppSidebar = ({
    toggled,
    collapsed,
    handleToggleSidebar,
    handleCollapsedChange,
    menuItems = [],
    title = "Kero Admin",
    email = "kero@gmail.com",
    logo = images.keroLogo,
}) => {
    const location = useLocation();
    const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
    const minMd = useMediaQuery({ minWidth: 768 });

    const handleMenuItemClick = (item) => {
        if (item.isAction && item.path.includes("deactivate-sos")) {
            setIsSOSModalOpen(true);
            return;
        }

        if (toggled) handleToggleSidebar(false); // mobile close
    };

    return (
        <>
            <Sidebar
                collapsed={collapsed}
                toggled={toggled}
                onBackdropClick={() => handleToggleSidebar(false)}
                breakPoint="md"
                backgroundColor="#ffffff"
                width="280px"
                collapsedWidth="80px"
                style={{
                    ...(minMd && {
                        position: "fixed",
                        top: "64px",
                        bottom: 0,
                        left: 0,
                        height: "calc(100vh - 64px)",
                        borderRight: "1px solid #e5e7eb",
                    }),
                }}
                rootStyles={{
                    ".ps-sidebar-container": {
                        marginTop: minMd ? undefined : "64px",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#d1d5db transparent",
                        background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
                    },
                    ".ps-sidebar-container::-webkit-scrollbar": {
                        width: "6px",
                    },
                    ".ps-sidebar-container::-webkit-scrollbar-track": {
                        background: "transparent",
                    },
                    ".ps-sidebar-container::-webkit-scrollbar-thumb": {
                        background: "#d1d5db",
                        borderRadius: "10px",
                    },
                    ".ps-sidebar-container::-webkit-scrollbar-thumb:hover": {
                        background: "#9ca3af",
                    },
                }}
            >
                {/* Mobile Header */}
                <div className="border-b border-gray-200 bg-white p-4 md:hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-10 w-10"
                            />
                            <div>
                                <p className="text-base font-semibold text-gray-900">{title}</p>
                                <p className="text-sm text-gray-500">{email}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleToggleSidebar(false)}
                            className="rounded-lg p-2 hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Desktop Collapse Button */}
                {!toggled && (
                    <button
                        onClick={() => handleCollapsedChange(!collapsed)}
                        className="fixed left-2 top-20 z-50 hidden h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-all hover:bg-primary-700 md:flex"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                )}

                {/* Sidebar Menu */}
                <Menu
                    menuItemStyles={{
                        button: ({ active }) => ({
                            padding: collapsed ? "14px" : "14px 20px",
                            margin: "4px 12px",
                            borderRadius: "12px",
                            backgroundColor: active ? "#bb9348" : "transparent",
                            color: active ? "#ffffff" : "#4b5563",
                            fontWeight: active ? "600" : "500",
                            fontSize: "14px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: active ? "none" : "1px solid transparent",
                            boxShadow: active ? "0 4px 12px rgba(96, 93, 85, 0.3)" : "none",
                            "&:hover": {
                                backgroundColor: active ? "#856833" : "#f3f4f6",
                                transform: active ? "translateY(-1px)" : "translateX(4px)",
                                borderColor: active ? "transparent" : "#e5e7eb",
                            },
                        }),
                        icon: { marginRight: collapsed ? "0" : "12px" },
                    }}
                    rootStyles={{
                        padding: "20px 0",
                    }}
                >
                    {menuItems.map(({ label, path, icon: Icon, isAction }) => {
                        const isActive = location.pathname === path;

                        if (isAction) {
                            return (
                                <MenuItem
                                    key={path}
                                    active={false}
                                    icon={Icon && <Icon size={20} />}
                                    onClick={() => handleMenuItemClick({ label, path, icon: Icon, isAction })}
                                >
                                    {!collapsed && label}
                                </MenuItem>
                            );
                        }

                        return (
                            <MenuItem
                                key={path}
                                active={isActive}
                                icon={
                                    Icon && (
                                        <Icon
                                            size={20}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                    )
                                }
                                component={<NavLink to={path} />}
                                onClick={() => handleMenuItemClick({ label, path, icon: Icon, isAction })}
                            >
                                {!collapsed && label}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Sidebar>

            <SOSDeactivationModal
                isOpen={isSOSModalOpen}
                onClose={() => setIsSOSModalOpen(false)}
            />
        </>
    );
};

AppSidebar.propTypes = {
    toggled: PropTypes.bool.isRequired,
    collapsed: PropTypes.bool.isRequired,
    handleToggleSidebar: PropTypes.func.isRequired,
    handleCollapsedChange: PropTypes.func,
    menuItems: PropTypes.array.isRequired,
    title: PropTypes.string,
    email: PropTypes.string,
    logo: PropTypes.string,
};
