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
        <input id="nav-toggle" type="checkbox" className="hidden peer" />
        <label htmlFor="nav-toggle" className="md:hidden p-2 rounded hover:bg-gray-100">
          <span className="sr-only">Toggle Menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6.75a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 6.75a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </label>
        <nav className="flex-col md:flex-row md:flex items-center gap-2 absolute md:static left-0 right-0 top-full bg-white md:bg-transparent border-t md:border-0 hidden peer-checked:flex md:!flex">
          <div className="flex flex-col md:flex-row md:items-center gap-2 p-3 md:p-0">
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
            <button onClick={logout} className="md:ml-2 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50">
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}


