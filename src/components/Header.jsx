import { NavLink } from "react-router-dom";
import svg from "@/assets/svg";
import { useState } from "react";
import { X, Menu } from "lucide-react";
import Modal from "@/components/modal";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navLinks = [
        { path: "/", text: "How it works" },
        { path: "/become-a-driver", text: "Become a rider" },
        { path: "/about", text: "About" },
    ];

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 p-5">
            <nav className="mx-auto max-w-6xl rounded-lg bg-white px-4 shadow-sm sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img
                            className="h-8 w-auto"
                            src={svg.keroLogo}
                            alt="Kero Logo"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden space-x-2 lg:flex">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `rounded-md px-3 py-2 text-sm font-medium ${
                                        isActive ? "bg-secondary-100 text-secondary-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    }`
                                }
                            >
                                {link.text}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop Download Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="ml-8 hidden items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 lg:inline-flex"
                    >
                        Download App
                    </button>

                    {/* Mobile menu button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                            onClick={toggleMobileMenu}
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="rounded-b-lg bg-white shadow-lg lg:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `block rounded-md px-3 py-2 text-base font-medium ${
                                        isActive ? "bg-secondary-100 text-secondary-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    }`
                                }
                                onClick={toggleMobileMenu}
                            >
                                {link.text}
                            </NavLink>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 px-4 pb-3 pt-4">
                        <button
                            onClick={() => {
                                setIsModalOpen(true);
                                setMobileMenuOpen(false);
                            }}
                            className="block w-full rounded-md border border-transparent bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-primary-700"
                        >
                            Download App
                        </button>
                    </div>
                </div>
            )}

            {/* Modal with 4 links */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="space-y-4 text-center">
                    <h3 className="mb-4 text-xl font-semibold">Download Kero Apps</h3>

                    <div className="flex flex-col gap-3">
                        {/* Rider */}
                        <a
                            href="https://play.google.com/store/apps/details?id=com.user.Kero"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-md bg-gray-100 px-4 py-2 font-medium text-primary-600 hover:bg-gray-200"
                        >
                            Rider - Google Play
                        </a>
                        <a
                            href="https://apps.apple.com/ca/app/kero/id6745862049?uo=2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-md bg-gray-100 px-4 py-2 font-medium text-primary-600 hover:bg-gray-200"
                        >
                            Rider - App Store
                        </a>

                        {/* Driver */}
                        <a
                            href="https://play.google.com/store/apps/details?id=com.driver.Kero"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-md bg-gray-100 px-4 py-2 font-medium text-primary-600 hover:bg-gray-200"
                        >
                            Driver - Google Play
                        </a>
                        <a
                            href="https://apps.apple.com/ca/app/kero-driver/id6745798671"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-md bg-gray-100 px-4 py-2 font-medium text-primary-600 hover:bg-gray-200"
                        >
                            Driver - App Store
                        </a>
                    </div>
                </div>
            </Modal>
        </header>
    );
};

export default Header;
