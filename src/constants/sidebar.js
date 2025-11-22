import { LayoutDashboard, Car, UserCog, Users, DollarSign, Receipt, LogOut, Shield, AlertTriangle, Bell, Gift } from "lucide-react";

export const defaultMenuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Rides", path: "/dashboard/rides", icon: Car },
    { label: "Driver", path: "/dashboard/drivers", icon: UserCog },
    { label: "Riders", path: "/dashboard/riders", icon: Users },
    { label: "Pricing", path: "/dashboard/pricing", icon: DollarSign },
    { label: "Transactions", path: "/dashboard/transactions", icon: Receipt },
    { label: "Rewards", path: "/dashboard/rewards", icon: Gift },
    { label: "Push Notifications", path: "/dashboard/notifications", icon: Bell },
    { label: "Admin Management", path: "/dashboard/admins", icon: Shield },
    { label: "Deactivate SOS", path: "/dashboard/deactivate-sos", icon: AlertTriangle, isAction: true },
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

export const supportMenuItems = [
    { label: "Dashboard", path: "/dashboard/support", icon: LayoutDashboard },
    { label: "Rides", path: "/dashboard/support/rides", icon: Car },
    { label: "Driver", path: "/dashboard/support/drivers", icon: UserCog },
    { label: "Riders", path: "/dashboard/support/riders", icon: Users },
    { label: "Transactions", path: "/dashboard/support/transactions", icon: Receipt },
    { label: "Push Notifications", path: "/dashboard/support/notifications", icon: Bell },
    { label: "Deactivate SOS", path: "/dashboard/support/deactivate-sos", icon: AlertTriangle, isAction: true },
    { label: "Logout", path: "/dashboard/support/logout", icon: LogOut },
];

export const financeMenuItems = [
    { label: "Dashboard", path: "/dashboard/finance", icon: LayoutDashboard },
    { label: "Drivers", path: "/dashboard/finance/drivers", icon: UserCog },
    { label: "Users", path: "/dashboard/finance/riders", icon: Users },
    { label: "Trips", path: "/dashboard/finance/rides", icon: Car },
    { label: "Transactions", path: "/dashboard/finance/transactions", icon: Receipt },
    { label: "Logout", path: "/dashboard/finance/logout", icon: LogOut },
];
