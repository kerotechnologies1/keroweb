import { NavLink } from "react-router-dom";
import svg from "@/assets/svg";
import { useState } from "react";
import { X, Menu } from "lucide-react";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <nav className="mx-auto shadow-sm bg-white max-w-6xl rounded-lg px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img className="h-8 w-auto" src={svg.keroLogo} alt="Kero Logo" />
                    </div>

                    {/* Desktop Navigation - hidden on mobile */}
					<div className="hidden lg:flex space-x-2">
						{navLinks.map((link) => (
							<NavLink
								key={link.path}
								to={link.path}
								className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md ${isActive ? "bg-secondary-100 text-secondary-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
							>
								{link.text}
							</NavLink>
						))}
					</div>
                    
                    <a href="#" className="ml-8 hidden lg:inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700">
                        Download App
                    </a>

                    {/* Mobile menu button - hidden on desktop */}
                    <div className="lg:hidden flex items-center">
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

            {/* Mobile menu - show/hide based on menu state */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white shadow-lg rounded-b-lg">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "bg-secondary-100 text-secondary-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
                                onClick={toggleMobileMenu}
                            >
                                {link.text}
                            </NavLink>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 pb-3 px-4">
                        <a href="#" className="block w-full rounded-md border border-transparent bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-primary-700">
                            Download App
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
