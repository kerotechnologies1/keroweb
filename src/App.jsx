import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
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
import Rewards from "./routes/rewards";
import PushNotifications from "./routes/push-notification";
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
    } catch {
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

const isSupportRole = () => {
    const role = getUserRole();
    return role === "support";
};

const isFinanceRole = () => {
    const role = getUserRole();
    return role === "finance";
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

    const role = getUserRole();

    // Redirect based on role
    if (role === "lagos") {
        return (
            <Navigate
                to="/dashboard/lagos"
                replace
            />
        );
    }
    if (role === "support") {
        return (
            <Navigate
                to="/dashboard/support"
                replace
            />
        );
    }
    if (role === "finance") {
        return (
            <Navigate
                to="/dashboard/finance"
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

ProtectedAdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
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

    const role = getUserRole();

    // Redirect based on role
    if (role === "admin") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }
    if (role === "support") {
        return (
            <Navigate
                to="/dashboard/support"
                replace
            />
        );
    }
    if (role === "finance") {
        return (
            <Navigate
                to="/dashboard/finance"
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

ProtectedLagosRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

// Protected Route Component for Support Dashboard
const ProtectedSupportRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const role = getUserRole();

    // Redirect based on role
    if (role === "admin") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }
    if (role === "lagos") {
        return (
            <Navigate
                to="/dashboard/lagos"
                replace
            />
        );
    }
    if (role === "finance") {
        return (
            <Navigate
                to="/dashboard/finance"
                replace
            />
        );
    }

    if (!isSupportRole()) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
};

ProtectedSupportRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

// Protected Route Component for Finance Dashboard
const ProtectedFinanceRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const role = getUserRole();

    // Redirect based on role
    if (role === "admin") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }
    if (role === "lagos") {
        return (
            <Navigate
                to="/dashboard/lagos"
                replace
            />
        );
    }
    if (role === "support") {
        return (
            <Navigate
                to="/dashboard/support"
                replace
            />
        );
    }

    if (!isFinanceRole()) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
};

ProtectedFinanceRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

// Smart Login Route Component
const SmartLogin = () => {
    if (!isAuthenticated()) {
        return <Login />;
    }

    // If already authenticated, redirect based on role
    const role = getUserRole();

    if (role === "lagos") {
        return (
            <Navigate
                to="/dashboard/lagos"
                replace
            />
        );
    }
    if (role === "admin") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }
    if (role === "support") {
        return (
            <Navigate
                to="/dashboard/support"
                replace
            />
        );
    }
    if (role === "finance") {
        return (
            <Navigate
                to="/dashboard/finance"
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
                <Layout location="admin" />
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
                path: "rewards",
                element: <Rewards />,
            },

            {
                path: "notifications",
                element: <PushNotifications />,
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
                element: (
                    <Rides
                        showKeroCommission={false}
                        showFare={false}
                    />
                ),
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
                element: <Riders showWalletBalance={false} />,
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
    // Support Dashboard Routes
    {
        path: "/dashboard/support",
        element: (
            <ProtectedSupportRoute>
                <Layout location="support" />
            </ProtectedSupportRoute>
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
                path: "transactions",
                element: <Transactions />,
            },
            {
                path: "notifications",
                element: <PushNotifications />,
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
    // Finance Dashboard Routes
    {
        path: "/dashboard/finance",
        element: (
            <ProtectedFinanceRoute>
                <Layout location="finance" />
            </ProtectedFinanceRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "rides",
                element: (
                    <Rides
                        showKeroCommission={false}
                        showFare={false}
                    />
                ),
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
                element: <Riders showWalletBalance={false} />,
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
