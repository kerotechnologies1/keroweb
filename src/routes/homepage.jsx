import Header from '@/components/Header';
import Footer from '@/components/Footer';
import images from '@/assets/images';

const HomePage = () => {
  return (
    <div className='bg-[#F4F4F4]'>
    <div className='hero one min-h-screen '>
        <div className="absolute inset-0">
            <img src={images.hero}  alt="Background" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black bg-opacity-65"></div>
      </div>

      <Header />

        <div className="absolute bottom-0 left-0 p-4 md:p-0 md:ms-16 mb-6 md:mb-16 w-full md:w-1/2 lg:w-5/12">
          <h1 className="text-4xl md:text-6xl font-medium text-white mb-4 lg:w-10/12">Experience the Future of Transportation</h1>
          <p className="text-lg mb-6 text-white">Convenient, Affordable, and Safe Rides with Kero</p>
          <div className="md:flex gap-4 max-sm:space-y-3 items-center">
            <a href="#" className=" inline-block md:inline bg-primary-800 text-white px-6 py-3 rounded-md">Download App</a>
            <a href="#" className=" inline-block md:inline bg-white text-primary-600 px-6 py-3 rounded-md">Become a Kero Driver</a>
          </div>
        </div>
    </div>
      
      {/* Hero Section */}

      {/* Features Section 1 */}
      <section className="py-16 px-4 md:px-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
            <img src={images.hero2} className="w-full rounded-lg" alt="Kero App" />
          </div>
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-3xl lg:text-5xl font-medium leading-snug mb-4">Book a Safe and Affordable Ride with Kero</h2>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Affordable fares without compromising on quality</li>
              <li>Real-time tracking and updates for a stress-free ride</li>
              <li>Verified drivers for your safety and security</li>
            </ul>
            <a href="#" className="bg-primary-600 text-white px-6 py-3 rounded-md inline-block">Download the App</a>
          </div>
        </div>
      </section>

      {/* Features Section 2 */}
      <section className="py-16 px-4 md:px-16 bg-white">
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
            <img src={images.hero3} className="w-full rounded-lg" alt="Kero Driver" />
          </div>
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-3xl lg:text-5xl font-medium leading-snug mb-4">Drive with Kero, Earn Money on Your Own Terms</h2>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Flexible scheduling to fit your lifestyle</li>
              <li>Competitive earnings and bonuses</li>
              <li>Opportunities for advancement and career growth</li>
            </ul>
            <a href="#" className="text-white bg-secondary-600  px-6 py-3 rounded-md inline-block">Become a Kero Driver</a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-16">
        <div className="rounded-3xl p-8 md:p-12 bg-primary-600 text-white text-center">
          <h2 className="text-3xl lg:text-5xl font-medium mb-4">Ready to Ride with Kero?</h2>
          <p className="text-base mb-8">Get the Kero app today and experience safe and affordable rides!</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="bg-white p-2 rounded-lg w-48 max-sm:mx-auto">
              <img src={images.googlePlay} className="w-full" alt="Google Play" />
            </div>
            <div className="bg-white p-2 rounded-lg w-48 max-sm:mx-auto">
              <img src={images.appStore} className="w-full" alt="App Store" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;