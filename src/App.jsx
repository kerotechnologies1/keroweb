import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "@/contexts/theme-context";

import { Layout } from "./layouts";
import { handleLogout } from "./utils/api";
import Login from "@/routes/login";
import Dashboard from "./routes/dashboard";
import Rides from "./routes/rides";
import Riders from "./routes/riders";
import Settings from "./routes/setting";
import Drivers from "./routes/drivers";
import Transactions from "./routes/transactions";
import PricingManagement from "./routes/pricing";
import HomePage from "./routes/homepage";
import DriverTerms from "./routes/become-a-driver";
import Policy from "./routes/policy";
import About from "./routes/about";
import AdminUserManagement from "./routes/adminManagement";

// Enhanced authentication functions
const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
};

const getUserRole = () => {
    try {
        const admin = localStorage.getItem("admin");
        if (admin) {
            const adminData = JSON.parse(admin);
            return adminData.role;
        }
        return null;
    } catch (error) {
        // console.error("Error parsing admin data:", error);
        return null;
    }
};

const isAdminRole = () => {
    const role = getUserRole();
    return role === "admin";
};

const isLagosRole = () => {
    const role = getUserRole();
    return role === "lagos";
};

// Protected Route Component for Admin Dashboard
const ProtectedAdminRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (isLagosRole()) {
        return (
            <Navigate
                to="/dashboard/lagos"
                replace
            />
        );
    }

    if (!isAdminRole()) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
};

// Protected Route Component for Lagos Dashboard
const ProtectedLagosRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (isAdminRole()) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    if (!isLagosRole()) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
};

// Smart Login Route Component
const SmartLogin = () => {
    if (!isAuthenticated()) {
        return <Login />;
    }

    // If already authenticated, redirect based on role
    if (isLagosRole()) {
        return (
            <Navigate
                to="/dashboard/lagos"
                replace
            />
        );
    }

    if (isAdminRole()) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    // Unknown role, logout and show login
    handleLogout();
    return <Login />;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/become-a-driver",
        element: <DriverTerms />,
    },
    {
        path: "/privacy",
        element: <Policy />,
    },
    {
        path: "/about",
        element: <About />,
    },
    {
        path: "/login",
        element: <SmartLogin />,
    },
    // Admin Dashboard Routes
    {
        path: "/dashboard",
        element: (
            <ProtectedAdminRoute>
                <Layout />
            </ProtectedAdminRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "rides",
                element: <Rides />,
            },
            {
                path: "drivers",
                element: <Drivers />,
            },
            {
                path: "riders",
                element: <Riders />,
            },
            {
                path: "pricing",
                element: <PricingManagement />,
            },
            {
                path: "transactions",
                element: <Transactions />,
            },
            {
                path: "admins",
                element: <AdminUserManagement />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "logout",
                loader: () => {
                    handleLogout();
                    return null;
                },
                element: (
                    <Navigate
                        to="/login"
                        replace
                    />
                ),
            },
        ],
    },
    // Lagos Dashboard Routes
    {
        path: "/dashboard/lagos",
        element: (
            <ProtectedLagosRoute>
                <Layout location="lagos" />
            </ProtectedLagosRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "rides",
                element: <Rides showKeroCommission={false} />,
            },
            {
                path: "drivers",
                element: (
                    <Drivers
                        showReview={false}
                        showWalletBalance={false}
                    />
                ),
            },
            {
                path: "riders",
                element: <Riders />,
            },
            {
                path: "transactions",
                element: <Transactions lagosAdmin={true} />,
            },
            {
                path: "logout",
                loader: () => {
                    handleLogout();
                    return null;
                },
                element: (
                    <Navigate
                        to="/login"
                        replace
                    />
                ),
            },
        ],
    },
    {
        path: "*",
        element: (
            <Navigate
                to="/"
                replace
            />
        ),
    },
]);

function App() {
    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar
                limit={3}
                newestOnTop
            />
        </ThemeProvider>
    );
}

export default App;
