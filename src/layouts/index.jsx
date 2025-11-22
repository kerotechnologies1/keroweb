// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { Header } from "./header";
// import { AppSidebar } from "./sidebar";
// import { Outlet } from "react-router-dom";
// import { useMediaQuery } from "react-responsive";
// import { defaultMenuItems, lagosMenuItems, supportMenuItems, financeMenuItems } from "@/constants/sidebar";

// export const Layout = ({ location = "default", title = "Kero Admin", email = "kero@gmail.com", logo }) => {
//     const [toggled, setToggled] = useState(false);
//     const [collapsed, setCollapsed] = useState(false);
//     const [adminDetails, setAdminDetails] = useState({ fullname: "", email: "" });

//     const isMobile = useMediaQuery({ maxWidth: 768 });
//     const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

//     // Get admin details from localStorage on mount
//     useEffect(() => {
//         try {
//             const admin = localStorage.getItem("admin");
//             if (admin) {
//                 const adminData = JSON.parse(admin);
//                 setAdminDetails({
//                     fullname: adminData.fullname || "",
//                     email: adminData.email || "",
//                 });
//             }
//         } catch (error) {
//             console.error("Error parsing admin data:", error);
//         }
//     }, []);

//     // Handle responsive sidebar
//     useEffect(() => {
//         if (isMobile) {
//             setCollapsed(false);
//             setToggled(false);
//         } else if (isTablet) {
//             setCollapsed(true);
//         } else {
//             setCollapsed(false);
//         }
//     }, [isMobile, isTablet]);

//     const handleToggleSidebar = (value) => {
//         if (isMobile) {
//             setToggled(value);
//         } else {
//             setCollapsed(!collapsed);
//         }
//     };

//     // Pick menu items based on location
//     const getMenuItems = () => {
//         switch (location) {
//             case "lagos":
//                 return lagosMenuItems;
//             case "support":
//                 return supportMenuItems;
//             case "finance":
//                 return financeMenuItems;
//             case "admin":
//             case "default":
//             default:
//                 return defaultMenuItems;
//         }
//     };

//     const menuItems = getMenuItems();

//     return (
//         <div className="flex h-screen bg-gray-50">
//             {/* Header - z-50 */}
//             <Header
//                 toggleSidebar={() => handleToggleSidebar(!toggled)}
//                 adminName={adminDetails.fullname}
//                 adminEmail={adminDetails.email}
//             />

//             {/* Mobile Backdrop - z-40 */}
//             {isMobile && toggled && (
//                 <div
//                     className="fixed inset-0 z-40 bg-black/50 transition-opacity"
//                     style={{ top: "64px" }}
//                     onClick={() => setToggled(false)}
//                 />
//             )}

//             {/* Sidebar - z-45 for mobile, z-30 for desktop */}
//             <div className={isMobile ? "z-45" : "z-30"}>
//                 <AppSidebar
//                     toggled={toggled}
//                     collapsed={collapsed}
//                     handleToggleSidebar={setToggled}
//                     handleCollapsedChange={setCollapsed}
//                     menuItems={menuItems}
//                     title={title}
//                     email={email}
//                     logo={logo}
//                 />
//             </div>

//             {/* Main Content */}
//             <main
//                 className={`flex-1 overflow-y-auto pt-16 transition-all duration-300 ease-in-out ${isMobile ? "ml-0" : collapsed ? "ml-[70px]" : "ml-[250px]"} `}
//             >
//                 <div className="p-4 md:p-6 lg:p-8">
//                     <Outlet />
//                 </div>
//             </main>
//         </div>
//     );
// };

// Layout.propTypes = {
//     location: PropTypes.oneOf(["default", "lagos", "support", "finance", "admin"]),
//     title: PropTypes.string,
//     email: PropTypes.string,
//     logo: PropTypes.string,
// };
// Layout.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Header } from "./header";
import { AppSidebar } from "./sidebar";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { defaultMenuItems, lagosMenuItems, supportMenuItems, financeMenuItems } from "@/constants/sidebar";

export const Layout = ({ location = "default", title = "Kero Admin", email = "kero@gmail.com", logo }) => {
    const [toggled, setToggled] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [adminDetails, setAdminDetails] = useState({ fullname: "", email: "" });

    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

    useEffect(() => {
        try {
            const admin = localStorage.getItem("admin");
            if (admin) {
                const adminData = JSON.parse(admin);
                setAdminDetails({
                    fullname: adminData.fullname || "",
                    email: adminData.email || "",
                });
            }
        } catch (error) {
            console.error("Error parsing admin data:", error);
        }
    }, []);

    useEffect(() => {
        if (isMobile) {
            setCollapsed(false);
            setToggled(false);
        } else if (isTablet) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }, [isMobile, isTablet]);

    const handleToggleSidebar = (value) => {
        if (isMobile) {
            setToggled(value);
        } else {
            setCollapsed(!collapsed);
        }
    };

    const getMenuItems = () => {
        switch (location) {
            case "lagos":
                return lagosMenuItems;
            case "support":
                return supportMenuItems;
            case "finance":
                return financeMenuItems;
            case "admin":
            case "default":
            default:
                return defaultMenuItems;
        }
    };

    const menuItems = getMenuItems();

    return (
        <div className="h-screen overflow-hidden bg-gray-50">
            {/* Header */}
            <Header
                toggleSidebar={() => handleToggleSidebar(!toggled)}
                adminName={adminDetails.fullname}
                adminEmail={adminDetails.email}
            />

            {/* Backdrop for mobile */}
            {isMobile && toggled && (
                <div
                    className="fixed inset-0 z-30 bg-black/50"
                    style={{ top: "64px" }}
                    onClick={() => setToggled(false)}
                />
            )}

            {/* Sidebar - fixed */}
            <div className="z-40">
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

            {/* Main content */}
            <main
                className={`fixed bottom-0 right-0 top-[64px] overflow-y-auto bg-gray-50 transition-all duration-300 ${isMobile ? "left-0" : collapsed ? "left-[70px]" : "left-[280px]"} `}
            >
                <div className="p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

Layout.propTypes = {
    location: PropTypes.oneOf(["default", "lagos", "support", "finance", "admin"]),
    title: PropTypes.string,
    email: PropTypes.string,
    logo: PropTypes.string,
};
