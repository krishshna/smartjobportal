import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-700 font-semibold border-b-2 border-blue-700 pb-1"
      : "text-slate-600 hover:text-blue-700 transition-colors";

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/jobs" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">SJ</span>
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">
            Smart<span className="text-blue-700">Jobs</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/jobs" className={isActive("/jobs")}>Browse Jobs</Link>
          {user && (
            <Link to="/my-applications" className={isActive("/my-applications")}>
              My Applications
            </Link>
          )}
          {user?.role === "ROLE_ADMIN" && (
            <Link to="/admin" className={isActive("/admin")}>
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role === "ROLE_ADMIN" ? "Administrator" : "Job Seeker"}</p>
              </div>
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-5 h-0.5 bg-slate-700 mb-1"></div>
          <div className="w-5 h-0.5 bg-slate-700 mb-1"></div>
          <div className="w-5 h-0.5 bg-slate-700"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
          <Link to="/jobs" className="text-slate-700 font-medium" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          {user && <Link to="/my-applications" className="text-slate-700 font-medium" onClick={() => setMenuOpen(false)}>My Applications</Link>}
          {user?.role === "ROLE_ADMIN" && <Link to="/admin" className="text-slate-700 font-medium" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>}
          {user ? (
            <button onClick={handleLogout} className="text-left text-red-600 font-medium">Logout</button>
          ) : (
            <>
              <Link to="/login" className="text-blue-700 font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="text-blue-700 font-medium" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}