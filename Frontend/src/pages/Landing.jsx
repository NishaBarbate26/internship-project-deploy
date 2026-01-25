import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <footer className="py-10 text-center text-gray-400 border-t">
        © 2026 Travel Guide AI. All rights reserved.
      </footer>
    </div>
  );
};
export default Landing;