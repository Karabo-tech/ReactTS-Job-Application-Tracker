// src/components/Navbar.tsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold hover:text-gray-300">Job Tracker</Link>
      <div>
        {!auth?.user ? (
          <>
            <Link to="/login" className="mx-2 hover:text-gray-300">Login</Link>
            <Link to="/register" className="mx-2 hover:text-gray-300">Register</Link>
          </>
        ) : (
          <>
            <Link to="/home" className="mx-2 hover:text-gray-300">Home</Link>
            <button onClick={handleLogout} className="mx-2 hover:text-gray-300">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;