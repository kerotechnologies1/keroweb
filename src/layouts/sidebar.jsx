import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { LayoutDashboard, Car, UserCog, Users, DollarSign, Receipt, Settings, LogOut } from "lucide-react";
import images from "../assets/images";

export const AppSidebar = ({ toggled, collapsed, handleToggleSidebar, handleCollapsedChange }) => {
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
                        <img src={images.keroLogo} alt="Kero" width="40" />
                        <div>
                            <p className="m-0 text-lg font-medium">Kero Admin</p>
                            <p className="m-0 text-sm font-light">kero@gmail.com</p>
                        </div>
                    </div>
                    <button onClick={() => handleToggleSidebar(false)} className="btn-close" aria-label="Close" />
                </div>
            )}

            {/* Sidebar Content */}
            <Menu
                menuItemStyles={{
                    button: ({ active }) => ({
                        padding: "10px 15px",
                        margin: "5px 0",
                        // borderRadius: "8px",
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
                <MenuItem active={location.pathname === "/dashboard"} icon={<LayoutDashboard size={20} />} component={<NavLink to="/dashboard" />}>
                    Dashboard
                </MenuItem>

                <MenuItem active={location.pathname === "/dashboard/rides"} icon={<Car size={20} />} component={<NavLink to="/dashboard/rides" />}>
                    Rides
                </MenuItem>

                <MenuItem active={location.pathname === "/dashboard/drivers"} icon={<UserCog size={20} />} component={<NavLink to="/dashboard/drivers" />}>
                    Driver
                </MenuItem>

                <MenuItem active={location.pathname === "/dashboard/riders"} icon={<Users size={20} />} component={<NavLink to="/dashboard/riders" />}>
                    Riders
                </MenuItem>

                <MenuItem active={location.pathname === "/dashboard/pricing"} icon={<DollarSign size={20} />} component={<NavLink to="/dashboard/pricing" />}>
                    Pricing
                </MenuItem>

                <MenuItem active={location.pathname === "/dashboard/transactions"} icon={<Receipt size={20} />} component={<NavLink to="/dashboard/transactions" />}>
                    Transactions
                </MenuItem>

                <MenuItem active={location.pathname === "/dashboard/settings"} icon={<Settings size={20} />} component={<NavLink to="/dashboard/settings" />}>
                    Settings
                </MenuItem>

                <MenuItem active={location.pathname === "/dashboard/logout"} icon={<LogOut size={20} />} component={<NavLink to="/dashboard/logout" />}>
                    Logout
                </MenuItem>
            </Menu>
        </Sidebar>
    );
};
