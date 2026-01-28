import React, { useState, useRef, useEffect } from "react";
import { Hammer, UserCircle, Bookmark, LayoutDashboard, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="bg-zinc-900 shadow-lg">
      <div
        className="max-w-7xl mx-auto flex items-center justify-between h-[96px]"
        style={{ padding: "0px 30px" }}
      >
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
          <Hammer className="text-indigo-500" size={60} />
          <span className="text-3xl font-bold text-white tracking-wide ml-2">
            CareerForge
          </span>
        </div>
        <div className="hidden md:flex gap-10 text-gray-300">
          {[
            { to: "/resume", label: "Resume Analyzer" },
            { to: "/mock-interview", label: "Mock Interview" },
            { to: "/job-finder", label: "Job Finder" },
            { to: "/roadmap", label: "Roadmap" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400 font-semibold"
                  : "hover:text-white transition"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="relative"  ref={dropdownRef}>
          {!user || !user.targetRole ? (
            <NavLink
              to="/login"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            >
              Login
            </NavLink>
          ) : (
            <>
              <div
                className="flex items-center gap-2 cursor-pointer text-white"
                onClick={() => setOpen(true)}
              >
                <UserCircle size={36} className="text-gray-300" />
                <span className="hidden md:block">{user.name}</span>
              </div>
              {open && (
                <div className="absolute right-0 mt-4 w-52 bg-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
                  <div
                    className="flex items-center gap-2 px-4 py-3 hover:bg-zinc-700 cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    <UserCircle size={18} />
                    Profile
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-3 hover:bg-zinc-700 cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-3 hover:bg-zinc-700 cursor-pointer"
                    onClick={() => navigate("/Savedjobs")}
                  >
                    <Bookmark size={18} />
                    Saved Jobs
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-3 hover:bg-red-600 cursor-pointer text-red-400 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Logout
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Navbar;
