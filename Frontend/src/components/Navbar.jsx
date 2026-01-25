import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="flex justify-between items-center p-6 bg-white shadow-sm sticky top-0 z-50">
    <div className="text-2xl font-bold text-blue-600">TravelAI</div>
    <div className="space-x-6">
      <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
      <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Sign Up</Link>
    </div>
  </nav>
);
export default Navbar;