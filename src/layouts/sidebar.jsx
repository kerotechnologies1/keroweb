import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import images from "../assets/images";

export const AppSidebar = ({
    toggled,
    collapsed,
    handleToggleSidebar,
    handleCollapsedChange,
    menuItems = [], // <-- accept menu items as prop
    title = "Kero Admin", // <-- customizable sidebar title
    email = "kero@gmail.com", // <-- customizable subtitle
    logo = images.keroLogo, // <-- customizable logo
}) => {
    const location = useLocation();

    return (
        <Sidebar
            collapsed={collapsed}
            toggled={toggled}
            onToggle={handleToggleSidebar}
            breakPoint="md"
            style={{ height: "100vh" }}
            width="250px"
            collapsedWidth="70px"
            backgroundColor="#ffffff"
            rtl={false}
            onBackdropClick={() => handleToggleSidebar(false)}
        >
            {/* Mobile Header */}
            {toggled && (
                <div className="flex items-center justify-between p-3 md:hidden">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Logo" width="40" />
                        <div>
                            <p className="m-0 text-lg font-medium">{title}</p>
                            <p className="m-0 text-sm font-light">{email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleToggleSidebar(false)}
                        className="btn-close"
                        aria-label="Close"
                    />
                </div>
            )}

            {/* Sidebar Content */}
            <Menu
                menuItemStyles={{
                    button: ({ active }) => ({
                        padding: "10px 15px",
                        margin: "5px 0",
                        backgroundColor: active ? "#aa8642" : "transparent",
                        color: active ? "white" : "inherit",
                        "&:hover": {
                            backgroundColor: active ? "#856833" : "#f3f4f6",
                        },
                    }),
                }}
                rootStyles={{
                    paddingTop: "20px",
                    height: "calc(100% - 20px)",
                }}
            >
                {menuItems.map(({ label, path, icon: Icon }) => (
                    <MenuItem
                        key={path}
                        active={location.pathname === path}
                        icon={Icon && <Icon size={20} />}
                        component={<NavLink to={path} />}
                    >
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </Sidebar>
    );
};
