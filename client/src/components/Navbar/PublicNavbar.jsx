import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import { FaBlog } from "react-icons/fa";
import { useState } from "react";

export default function PublicNavbar() {

  const [showMenu, setShowMenu] = useState(false)
  const handleShowMenu = () => {
    setShowMenu(!showMenu);
    if (!showMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const activeClassCSS = "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-700 border-indigo-500"
  const unActiveClassCSS = "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"

  const activeClassMobileCSS = "block border-l-4 py-2 pl-3 pr-4 text-base font-medium text-gray-700 border-indigo-500 sm:pl-5 sm:pr-6";
  const unActiveClassMobileCSS = "block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-indigo-500 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6";

  const navigation = [
    { to: "/", name: "Home" },
    { to: "/posts", name: "Latest Posts" },
    { to: "/ranking", name: "Creators Ranking" },
    { to: "/pricing", name: "Pricing" },
    { to: "/register", name: "Create Account" },
  ]

  return (
    <div className="fixed top-0 w-full z-40 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            {/* Mobile menu button */}
            <div className="-ml-2 mr-2 flex items-center md:hidden">
              <span
                onClick={handleShowMenu}
                className="block h-10 w-10 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 rounded-md">
                {showMenu ?
                  <XMarkIcon aria-hidden="true" />
                  :
                  <Bars3Icon aria-hidden="true" />
                }
              </span>
            </div>

            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <Link to='/'>
                <FaBlog className="h-8 w-auto text-orange-500" />
              </Link>
            </div>

            {/* Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  className={({ isActive }) => isActive ? activeClassCSS : unActiveClassCSS}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* login button */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex gap-2">
              <Link
                to="/register"
                className="relative inline-flex items-center gap-x-1.5 rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 active:bg-orange-700"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="relative inline-flex items-center gap-x-1.5 rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 active:bg-orange-700"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMenu && (
        <div
          className="absolute z-40 shadow-lg bg-white w-full space-y-1 pb-3 pt-2">
          {navigation.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              onClick={handleShowMenu}
              className={({ isActive }) => isActive ? activeClassMobileCSS : unActiveClassMobileCSS}
            >
              {item.name}
            </NavLink>
          ))}
        </div>)}
    </div >
  );
}