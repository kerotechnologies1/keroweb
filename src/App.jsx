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

const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
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
        path: "/policy",
        element: <Policy />,
    },
    {
        path: "/about",
        element: <About />,
    },
    {
        path: "/login",
        element: isAuthenticated() ? (
            <Navigate
                to="/dashboard"
                replace
            />
        ) : (
            <Login />
        ),
    },
    {
        path: "/dashboard",
        element: isAuthenticated() ? (
            <Layout />
        ) : (
            <Navigate
                to="/login"
                replace
            />
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "rides",
                element: <Rides />, // Make sure to create this component
            },
            {
                path: "drivers",
                element: <Drivers />, // Make sure to create this component
            },
            {
                path: "riders",
                element: <Riders />, // Make sure to create this component
            },
            {
                path: "pricing",
                element: <PricingManagement />, // Make sure to create this component
            },
            {
                path: "transactions",
                element: <Transactions />, // Make sure to create this component
            },
            {
                path: "settings",
                element: <Settings />, // Make sure to create this component
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
            {
                index: true,
                element: (
                    <Navigate
                        to="/dashboard"
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
