import { Home, Package, ClipboardList, Share2, ListChecks, Clock, Users, CreditCard, LogOut } from "lucide-react";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/dashboard",
            },
            {
                label: "Packages",
                icon: Package,
                path: "/dashboard/packages",
            },
            {
                label: "Engagement",
                icon: Share2,
                path: "/dashboard/engagement",
            },
            {
                label: "Social Platform",
                icon: ClipboardList,
                path: "/dashboard/socialPlatform",
            },
            {
                label: "Tasks",
                icon: ListChecks,
                path: "/dashboard/tasks",
            },
            {
                label: "Tasks Log",
                icon: Clock,
                path: "/dashboard/tasksLog",
            },
            {
                label: "All Users",
                icon: Users,
                path: "/dashboard/users",
            },
            {
                label: "Transactions",
                icon: CreditCard,
                path: "/dashboard/transactions",
            },
            {
                label: "Logout",
                icon: LogOut,
                path: "/dashboard/logout",
            },
        ],
    },
];
