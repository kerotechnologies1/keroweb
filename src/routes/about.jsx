import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamMember from "@/components/TeamMember";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import images from "../assets/images";

// Dummy team data
const teamData = [
    {
        id: 1,
        name: "Orimadegun Promise",
        position: "Chief Executive Officer",
        image: images.staff
    },
    {
        id: 2,
        name: "Sulaimon Promise",
        position: "Chief Technology Officer",
        image: images.staff,
    },
    {
        id: 3,
        name: "Adeola Johnson",
        position: "Chief Operating Officer",
        image: images.staff,
    },
    {
        id: 4,
        name: "Chinedu Okoro",
        position: "Head of Marketing",
        image: images.staff,
    },
    {
        id: 5,
        name: "Amina Mohammed",
        position: "Head of Customer Service",
        image: images.staff,
    },
];

const About = () => {
    return (
        <div className='bg-[#F4F4F4]'>
            {/* Hero Section */}
            <div className="hero bg-primary-900 min-h-screen relative overflow-hidden">
                <Header />

                <div className="container mx-auto px-4 h-full flex items-center pt-16 pb-24">
                    <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                        {/* Text Content */}
                        <div className="text-white md:w-1/2 z-10">
                            <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-4 md:w-11/12">Transforming Transportation, One Ride at a Time</h1>
                            <p className="text-lg mb-8">Discover the story behind our mission to transform transportation</p>

                            <div className="flex gap-8 mb-8">
                                <div className="text-center">
                                    <p className="text-4xl font-medium">100k+</p>
                                    <p className="text-sm">Dedicated Riders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-medium">100k+</p>
                                    <p className="text-sm">Satisfied Users</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-medium">100k+</p>
                                    <p className="text-sm">Safe and Reliable Rides</p>
                                </div>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="md:w-1/2 relative">
                            <div className="hidden md:flex justify-end">
                                <div className="absolute global-img left-0 top-0 rounded-br-full h-[90%] w-1/2 overflow-hidden z-20">
                                    <img src={images.about1} className="h-full w-1/2" alt="Hero 1" />
                                </div>
                                <div className="w-1/2 global-img">
                                    <img src={images.about2} className="w-full" alt="Hero 2" />
                                </div>
                            </div>
                            <div className="mt-8 md:mt-0 global-img">
                                <img src={images.about3} className="w-full rounded-lg" alt="Hero 3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="py-16 px-4 md:px-8">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-stretch gap-8">
                        <div className="md:w-1/2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <div className="global-img">
                                        <img src={images.about4} className="w-full h-full object-cover rounded-lg" alt="Urban mobility with Kero Ride" />
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <div className="global-img">
                                        <img src={images.about5} className="w-full mb-4 rounded-lg" alt="Kero Ride driver at work" />
                                    </div>
                                    <div className="global-img">
                                        <img src={images.about6} className="w-full rounded-lg" alt="Kero Ride passenger experience" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6">Our Mission</h2>
                            <p className="text-lg leading-relaxed mb-4">
                                At Kero Ride, our mission is to revolutionize urban mobility by providing safe, reliable, affordable, and tech-driven transportation solutions tailored to meet the dynamic needs of individuals and communities across Nigeria.
                            </p>
                            <p className="text-lg leading-relaxed mb-4">
                                We are committed to enhancing the everyday commuting experience through innovation, empowering local drivers, and prioritizing customer satisfaction. Rooted in integrity and driven by a vision of inclusive economic growth, we offer not just a ride, but an experience that promotes safety, dignity, and accessibility for all.
                            </p>
                            <p className="text-lg leading-relaxed mb-4">
                                Our mission includes advancing smart mobility solutions that address Nigerian cities’ unique challenges—from traffic congestion to infrastructural gaps—creating a more fluid and equitable urban experience.
                            </p>
                            <p className="text-lg leading-relaxed">
                                Through strategic partnerships, cutting-edge technology, and data-driven decisions, Kero Ride aims to contribute to Nigeria’s digital economy and position Lagos as a model for intelligent transportation across Africa.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 md:px-8 bg-white">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                        <div className="md:w-1/2 global-img">
                            <img src={images.hero3} className="w-full rounded-lg" alt="Our Values at Kero Ride" />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6">Our Values</h2>
                            <ul className="list-disc pl-5 space-y-4 text-lg leading-relaxed">
                                <li><strong>Safety First:</strong> We prioritize safety with rigorous standards, real-time features, and continuous training.</li>
                                <li><strong>Excellence & Innovation:</strong> We embrace tech and continuous improvement to redefine urban transport quality.</li>
                                <li><strong>Integrity & Accountability:</strong> We operate transparently, uphold ethics, and build public trust through responsibility.</li>
                                <li><strong>Empowerment & Inclusion:</strong> Our platform lifts drivers and ensures equal opportunity regardless of background.</li>
                                <li><strong>Customer-Centricity:</strong> Riders are central to our service. We listen, learn, and adapt to deliver satisfaction.</li>
                                <li><strong>Environmental Responsibility:</strong> We commit to sustainability and eco-conscious growth practices.</li>
                                <li><strong>Community Impact:</strong> Kero Ride empowers communities through employment, partnerships, and local initiatives.</li>
                                <li><strong>Technology-Driven Solutions:</strong> We optimize routes and services through data and innovation for efficiency.</li>
                                <li><strong>Transparency & Fair Pricing:</strong> Our pricing is honest, clear, and fair for both riders and drivers.</li>
                                <li><strong>Collaboration & Growth:</strong> We grow together—drivers, riders, policymakers, and partners alike.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            {/*             <section className="py-16 px-4 md:px-8">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <div className="global-img">
                                        <img src={images.about4} className="w-full h-full object-cover rounded-lg" alt="About 1" />
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <div className="global-img">
                                        <img src={images.about5} className="w-full mb-4 rounded-lg" alt="About 2" />
                                    </div>
                                    <div className="global-img">
                                        <img src={images.about6} className="w-full rounded-lg" alt="About 3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6">Our Mission</h2>
                            <p className="text-lg leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                deserunt mollit anim id est laborum.
                            </p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Values Section */}
            {/*             <section className="py-16 px-4 md:px-8 bg-white">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                        <div className="md:w-1/2 global-img">
                            <img src={images.hero3} className="w-full rounded-lg" alt="Our Values" />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-6">Our Values</h2>
                            <p className="text-lg leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                deserunt mollit anim id est laborum.
                            </p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Team Section */}
{/*             <section className="py-16 px-4 md:px-8">
                <div className="container mx-auto">
                    <h2 className="text-4xl md:text-5xl font-medium text-center mb-12">Meet our Team</h2>

                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                        }}
                        navigation
                        pagination={{ clickable: true }}
                        className="teamSwiper"
                    >
                        {teamData.map((member) => (
                            <SwiperSlide key={member.id}>
                                <TeamMember name={member.name} position={member.position} image={member.image} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section> */}

            <Footer />
        </div>
    );
};

export default About;
