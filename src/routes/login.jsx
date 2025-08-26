import { useState } from "react";
import Swal from "sweetalert2";
import api from "@/utils/api";
import login from "../assets/svg/login.svg";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post(
                "/admin/login",
                { email, password },
                { requiresToken: false }, // THIS IS CRUCIAL
            );
            const { token, admin } = response.data.data;

            localStorage.setItem("token", token);
            localStorage.setItem("admin", JSON.stringify(admin));

            if (admin.role === "lagos") {
                await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                window.location.href = "/dashboard/lagos";
            } else {
                await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                window.location.href = "/dashboard";
            }
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                timer: 1500,
                text: error.response?.data?.message || "Login failed",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 lg:flex-row">
            <div className="hidden w-1/2 lg:block">
                <img
                    src={login}
                    alt="Login Illustration"
                    className="mx-auto w-4/5"
                />
            </div>
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold text-gray-textTitle">Admin Sign In</h1>
                    <p className="text-sm text-gray-600">Login to manage Kero Admin</p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input
                        type="email"
                        className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="hover:bg-primary-dark w-full rounded-lg bg-primary-500 py-2 text-white transition"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="mr-2 h-5 w-5 animate-spin"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                                Signing In...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
