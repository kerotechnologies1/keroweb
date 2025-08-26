// src/constants/sidebar.js
import { LayoutDashboard, Car, UserCog, Users, DollarSign, Receipt, Settings, LogOut, Shield } from "lucide-react";

export const defaultMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Rides", path: "/dashboard/rides", icon: Car },
    { label: "Driver", path: "/dashboard/drivers", icon: UserCog },
    { label: "Riders", path: "/dashboard/riders", icon: Users },
    { label: "Pricing", path: "/dashboard/pricing", icon: DollarSign },
    { label: "Transactions", path: "/dashboard/transactions", icon: Receipt },
    { label: "Admin Management", path: "/dashboard/admins", icon: Shield },
    // { label: "Settings", path: "/dashboard/settings", icon: Settings },
    { label: "Logout", path: "/dashboard/logout", icon: LogOut },
];

export const lagosMenuItems = [
    { label: "Dashboard", path: "/dashboard/lagos", icon: LayoutDashboard },
    { label: "Drivers", path: "/dashboard/lagos/drivers", icon: UserCog },
    { label: "Users", path: "/dashboard/lagos/riders", icon: Users },
    { label: "Trips", path: "/dashboard/lagos/rides", icon: Car },
    { label: "Transactions", path: "/dashboard/lagos/transactions", icon: Receipt },
    { label: "Logout", path: "/dashboard/lagos/logout", icon: LogOut },
];
