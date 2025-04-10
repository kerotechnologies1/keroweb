import { NavLink } from 'react-router-dom';
import svg from "@/assets/svg";
import images from "@/assets/images";

const Footer = () => {
    const footerLinks = {
        keroTech: [
            { path: "/", text: "How it works" },
            { path: "/become-a-driver", text: "Become a rider" },
            { path: "/about", text: "About Us" },
        ],
        legal: [
            { path: "/policy", text: "Privacy Policy" },
            { path: "/become-a-driver", text: "Terms & Condition" },
        ]
    };

    return (
        <section className="footer bg-[#393730] text-white py-10">
            <div className="container p-4 md:p-8 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-around">
                    <div className="col-span-1">
                        <NavLink to="/" className="block mb-4">
                            <img src={svg.keroLogoDark} className="w-1/2" alt="Kero Logo" />
                        </NavLink>
                        <p className="text-xl font-medium mb-2">Sign up to our newsletter</p>
                        <p className="mb-4 text-sm">Stay up to date with our newsletters, announcement and articles</p>
                        <div className="flex mt-4">
                            <input 
                                type="text" 
                                className="text-xs flex-grow px-4 py-2 rounded-l-md text-gray-800" 
                                placeholder="Enter Email Address" 
                            />
                            <button 
                                type="submit" 
                                className="bg-secondary-600 text-white text-sm px-4 py-2 rounded-r-md"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <p className="font-semibold mb-2">Kero Technologies</p>
                        {footerLinks.keroTech.map((link) => (
                            <p key={link.path}>
                                <NavLink 
                                    to={link.path}
                                    className={({ isActive }) => 
                                        `text-sm hover:text-secondary-300 block py-1 ${
                                            isActive ? 'text-secondary-400' : ''
                                        }`
                                    }
                                >
                                    {link.text}
                                </NavLink>
                            </p>
                        ))}
                    </div>

                    <div className="col-span-1">
                        <p className="font-semibold mb-2">Legal</p>
                        {footerLinks.legal.map((link) => (
                            <p key={link.path}>
                                <NavLink 
                                    to={link.path}
                                    className={({ isActive }) => 
                                        `text-sm hover:text-secondary-300 block py-1 ${
                                            isActive ? 'text-secondary-400' : ''
                                        }`
                                    }
                                >
                                    {link.text}
                                </NavLink>
                            </p>
                        ))}
                    </div>

                    <div className="col-span-1">
                        <p className="font-semibold mb-2">Socials</p>
                        <div className="flex gap-3">
                            <a href="#" className="hover:opacity-80">
                                <img src={images.twitter} alt="Twitter" className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:opacity-80">
                                <img src={images.linkedin} alt="LinkedIn" className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:opacity-80">
                                <img src={images.youtube} alt="YouTube" className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Footer;