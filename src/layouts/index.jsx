import { useState, useEffect, useRef } from "react";
import { Header } from "./header";
import { AppSidebar } from "./sidebar";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { defaultMenuItems, lagosMenuItems } from "@/constants/sidebar";

export const Layout = ({
    location = "default", // "default" | "lagos"
    title = "Kero Admin",
    email = "kero@gmail.com",
    logo,
}) => {
    const [toggled, setToggled] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const sidebarRef = useRef(null);
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 991 });

    useEffect(() => {
        if (isMobile) {
            setCollapsed(false);
        } else if (isTablet) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }, [isMobile, isTablet]);

    const toggleSidebar = () => {
        if (isMobile) {
            setToggled(!toggled);
        } else if (isTablet) {
            setCollapsed(!collapsed);
        }
    };

    const handleMouseEnter = () => {
        if (isTablet && collapsed) {
            setIsHovering(true);
            setCollapsed(false);
        }
    };

    const handleMouseLeave = () => {
        if (isTablet && !collapsed) {
            setIsHovering(false);
            setCollapsed(true);
        }
    };

    // Pick menu items based on location
    const menuItems = location === "lagos" ? lagosMenuItems : defaultMenuItems;

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            {/* Fixed Header */}
            <div className="fixed left-0 right-0 top-0 z-50 bg-white shadow-sm">
                <Header toggleSidebar={toggleSidebar} />
            </div>

            <div className="flex h-screen pt-16">
                {/* Sidebar */}
                {isMobile ? (
                    <div
                        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
                            toggled ? "visible opacity-100" : "invisible opacity-0"
                        }`}
                        onClick={() => setToggled(false)}
                    >
                        <div
                            className="absolute left-0 top-0 h-full w-64 transform bg-white shadow-lg transition-transform duration-300"
                            style={{
                                transform: toggled ? "translateX(0)" : "translateX(-100%)",
                            }}
                            ref={sidebarRef}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AppSidebar
                                toggled={toggled}
                                collapsed={false}
                                handleToggleSidebar={setToggled}
                                handleCollapsedChange={setCollapsed}
                                menuItems={menuItems}
                                title={title}
                                email={email}
                                logo={logo}
                            />
                        </div>
                    </div>
                ) : (
                    <div
                        ref={sidebarRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={`fixed bottom-0 top-16 z-40 transition-all duration-300 ease-in-out ${collapsed ? "w-[70px]" : "w-[250px]"}`}
                    >
                        <AppSidebar
                            toggled={toggled}
                            collapsed={collapsed}
                            handleToggleSidebar={setToggled}
                            handleCollapsedChange={setCollapsed}
                            menuItems={menuItems}
                            title={title}
                            email={email}
                            logo={logo}
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className={`flex-1 overflow-y-auto bg-[#F4F4F4] transition-all duration-300 ${
                        isMobile ? "ml-0" : collapsed ? "ml-[70px]" : "ml-[250px]"
                    }`}
                    style={{ height: "calc(100vh - 64px)" }}
                >
                    <div className="p-4 md:p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};
