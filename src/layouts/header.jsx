import images from "../assets/images";
import svg from "../assets/svg";

export const Header = ({ toggleSidebar }) => {
    return (
        <header className="fixed top-0 z-10 w-full bg-white px-3 shadow-sm md:px-5">
            <nav className="flex items-center justify-between gap-5 py-3">
                <div className="flex items-center">
                    <img
                        src={images.keroLogo}
                        className="h-8 md:h-10"
                        alt="1Kero Logo"
                    />
                </div>

                <div className="flex flex-grow items-center justify-end gap-3 md:justify-end">
                    <div className="hidden items-center md:flex">
                        <div className="ml-4 hidden items-center gap-2 md:flex">
                            <img
                                src={images.user}
                                alt="User"
                                className="h-10 w-10 rounded-full"
                            />
                            <div>
                                <p className="text-lg font-medium">Kero Admin</p>
                                <p className="text-sm text-gray-500">kero@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={toggleSidebar}
                        className="toggler flex items-center justify-center md:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 6h18M3 12h18M3 18h18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    );
};
