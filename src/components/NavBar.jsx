import { NavLink, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <header className="bg-white border-b sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-lg">Lab Manager</div>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/patients/new" className={linkClass}>
            Patient Entry
          </NavLink>
          <NavLink to="/reports/new" className={linkClass}>
            Test Entry
          </NavLink>
          <NavLink to="/reports" className={linkClass}>
            Reports
          </NavLink>
          <button onClick={logout} className="ml-2 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}


