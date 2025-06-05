import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">Blog App</Link>
          <div className="flex space-x-4">
            <Link to="/signup" className="text-gray-600 hover:text-gray-900">Sign Up</Link>
            <Link to="/signin" className="text-gray-600 hover:text-gray-900">Sign In</Link>
            <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;