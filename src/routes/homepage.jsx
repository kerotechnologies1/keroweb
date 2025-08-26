import Header from "@/components/Header";
import Footer from "@/components/Footer";
import images from "@/assets/images";
import { useState } from "react";
import Modal from "@/components/modal";

const HomePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="bg-[#F4F4F4]">
            <div className="hero one min-h-screen">
                <div className="absolute inset-0">
                    <img
                        src={images.hero}
                        alt="Background"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-65"></div>
                </div>

                <Header />

                <div className="absolute bottom-0 left-0 mb-6 w-full p-4 md:mb-16 md:ms-16 md:w-1/2 md:p-0 lg:w-5/12">
                    <h1 className="mb-4 text-4xl font-medium text-white md:text-6xl lg:w-10/12">Experience the Future of Transportation</h1>
                    <p className="mb-6 text-lg text-white">Convenient, Affordable, and Safe Rides with Kero</p>
                    <div className="items-center gap-4 max-sm:space-y-3 md:flex">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-block rounded-md bg-primary-800 px-6 py-3 text-white md:inline"
                        >
                            Download App
                        </button>
                        <a
                            href="#"
                            className="inline-block rounded-md bg-white px-6 py-3 text-primary-600 md:inline"
                        >
                            Become a Kero Driver
                        </a>
                    </div>
                </div>
            </div>

            {/* Hero Section */}

            {/* Features Section 1 */}
            <section className="px-4 py-16 md:px-16">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="w-full overflow-hidden rounded-lg md:w-1/2">
                        <img
                            src={images.hero2}
                            className="w-full rounded-lg"
                            alt="Kero App"
                        />
                    </div>
                    <div className="w-full p-4 md:w-1/2">
                        <h2 className="mb-4 text-3xl font-medium leading-snug lg:text-5xl">Book a Safe and Affordable Ride with Kero</h2>
                        <ul className="mb-6 list-disc space-y-2 pl-5">
                            <li>Affordable fares without compromising on quality</li>
                            <li>Real-time tracking and updates for a stress-free ride</li>
                            <li>Verified drivers for your safety and security</li>
                        </ul>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-block rounded-md bg-primary-600 px-6 py-3 text-white"
                        >
                            Download the App
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section 2 */}
            <section className="bg-white px-4 py-16 md:px-16">
                <div className="flex flex-col items-center gap-8 md:flex-row-reverse">
                    <div className="w-full overflow-hidden rounded-lg md:w-1/2">
                        <img
                            src={images.hero3}
                            className="w-full rounded-lg"
                            alt="Kero Driver"
                        />
                    </div>
                    <div className="w-full p-4 md:w-1/2">
                        <h2 className="mb-4 text-3xl font-medium leading-snug lg:text-5xl">Drive with Kero, Earn Money on Your Own Terms</h2>
                        <ul className="mb-6 list-disc space-y-2 pl-5">
                            <li>Flexible scheduling to fit your lifestyle</li>
                            <li>Competitive earnings and bonuses</li>
                            <li>Opportunities for advancement and career growth</li>
                        </ul>
                        <a
                            href="#"
                            className="inline-block rounded-md bg-secondary-600 px-6 py-3 text-white"
                        >
                            Become a Kero Driver
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 py-16 md:px-16">
                <div className="rounded-3xl bg-primary-600 p-8 text-center text-white md:p-12">
                    <h2 className="mb-4 text-3xl font-medium lg:text-5xl">Ready to Ride with Kero?</h2>
                    <p className="mb-8 text-base">Get the Kero app today and experience safe and affordable rides!</p>
                    <div className="flex flex-col justify-center gap-4 md:flex-row">
                        {/* Google Play */}
                        <a
                            href="https://play.google.com/store/apps/details?id=com.user.Kero"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-48 rounded-lg bg-white p-2 max-sm:mx-auto"
                        >
                            <img
                                src={images.googlePlay}
                                className="w-full"
                                alt="Get it on Google Play"
                            />
                        </a>

                        {/* App Store */}
                        <a
                            href="https://apps.apple.com/ca/app/kero/id6745862049?uo=2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-48 rounded-lg bg-white p-2 max-sm:mx-auto"
                        >
                            <img
                                src={images.appStore}
                                className="w-full"
                                alt="Download on the App Store"
                            />
                        </a>
                    </div>
                </div>
            </section>

            <Footer />

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
        </div>
    );
};

export default HomePage;
