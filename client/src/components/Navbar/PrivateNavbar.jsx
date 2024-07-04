import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdCurrencyRupee } from "react-icons/md";
import { FaPlus, FaUsers } from "react-icons/fa";
import { FaTags } from "react-icons/fa";
import { TbReceiptRupee } from "react-icons/tb";
import { FaBlog } from "react-icons/fa6";
import { FaBars } from "react-icons/fa6";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import { logoutAPI, userProfileAPI } from "../../APIServices/userAPI";
import { logout } from "../../redux/slices/authSlice";
import NotificationCounts from "../Notification/NotificationCount";

export default function PrivateNavbar() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {userAuth} = useSelector((state) => state.auth);

  const [isProfileButtonActive, setProfileButtonActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const sidebarRef = useRef(null);
  const sidebarBtnRef = useRef(null);

  // sidebar open close
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event.target) &&
        buttonRef?.current &&
        !buttonRef?.current?.contains(event.target)
      ) {
        setProfileButtonActive(false);
      }
    }
    function handleClickOutsideForSidebar(event) {
      if (
        sidebarRef?.current &&
        !sidebarRef?.current?.contains(event.target) &&
        sidebarBtnRef?.current &&
        !sidebarBtnRef?.current?.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    }
    // Attach the listeners on component mount.
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('click', handleClickOutsideForSidebar);
    // Detach the listeners on component unmount.
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('click', handleClickOutsideForSidebar);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount.

  // prevent scrolling when sidebar is open
  if (isSidebarOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
  
  const { data: userData } = useQuery({
    queryKey: ["profile"],
    queryFn: userProfileAPI,
  });

  const profilePic =  userAuth?.profilePicture?.path || userAuth?.profilePicture

  // user mutation
  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutAPI,
  });

  const logoutHandler = async () => {
    logoutMutation
      .mutateAsync()
      .then(() => dispatch(logout()))
      .then(() => setProfileButtonActive(!isProfileButtonActive))
      .then(() => navigate('/posts'))
      .catch((e) => console.log(e));
  };

  const navigation = [
    { name: "Home", to: "/" },
    { name: "Latest Posts", to: "/posts" },
    { name: "Creators Ranking", to: "/ranking" },
  ]

  if (!userAuth?.hasSelectedPlan) navigation.push({ name: "Pricing", to: "/pricing" })
    
  const isActiveCSS = "inline-flex h-16 items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-700 border-indigo-500"
  const unActiveCSS = "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"

  return (
    <div className="fixed top-0 z-40 bg-white flex h-14 md:h-16 justify-between md:justify-start items-center w-full px-4 sm:px-6 lg:px-8 shadow-md">
      {/* Logo & Bar-btn */}
      <div className="flex gap-3 items-center">
        <span
          ref={sidebarBtnRef}
        >
          <FaBars
            className="md:hidden -ml-3 w-10 h-10 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-600 rounded-md cursor-pointer active:bg-gray-300 active:text-gray-800"
            onClick={() => setIsSidebarOpen(true)}
          />
        </span>
        <Link to='/posts'>
          <FaBlog className="h-8 w-8 text-orange-500" />
        </Link>
      </div>

      {/* NAV ITEMS */}
      <div className="hidden w-full md:ml-6 md:flex justify-center md:space-x-8">
        {navigation.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) => isActive ? isActiveCSS : unActiveCSS}
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* profile button */}
      <div className="flex">
        <Link to="/dashboard/create-post"
          className="mr-1 min-w-32 flex items-center justify-center gap-x-1.5 rounded-md bg-orange-500  py-1 md:px-3 md:py-2 text-sm md:font-semibold text-white shadow-sm hover:bg-orange-600"
        >
          <FaPlus className="w-2 md:w-3" />
          <span className="">Create Post</span>
        </Link>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setProfileButtonActive(!isProfileButtonActive)}
            className={`hidden mr-1 min-w-24  md:flex items-center gap-x-1.5 rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 ${isProfileButtonActive ? 'bg-orange-600' : ''}`}
          >
            {userAuth?.profilePicture ? (
              <img
                className="h-6 w-6 rounded-full"
                src={profilePic}
                alt="profile"
              />
            ) : (
              <AiOutlineUser className="h-6 w-6" />
            )}
            <span>Me</span>
            <IoMdArrowDropdown className={`h-5 w-5 transform transition-transform duration-200 ${isProfileButtonActive ? 'rotate-180' : ''}`} />
          </button>
          {/* dropdown*/}
          <div
            ref={dropdownRef}
            className={`absolute right-0 z-10 flex flex-col items-center mt-2 min-w-min origin-top-right rounded-md bg-white py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none ${!isProfileButtonActive && "hidden"}`}
          >
            <Link to="/dashboard"
              onClick={() => setProfileButtonActive(false)}
              className="flex gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
            >
              <LuLayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/dashboard/notifications"
              onClick={() => setProfileButtonActive(false)}
              className="flex gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
            >
              <NotificationCounts />
              Notifications
            </Link>
            <Link to="/dashboard/my-earnings"
              onClick={() => setProfileButtonActive(false)}
              className="flex gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
            >
              <MdCurrencyRupee className="h-5 w-5" />
              Earnings
            </Link>
            {userData?.user?.isAdmin && (
            // {true && (
              <div className="relative">
                <button
                  onMouseEnter={() => setIsAdminPanelOpen(true)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
                >
                  <MdOutlineAdminPanelSettings className="h-5 w-5 mr-1" />
                  <span className="w-20">Admin Panel</span>
                  <IoMdArrowDropdown className="h-3 w-3" />
                </button>
                {isAdminPanelOpen && (
                  <ul
                    onMouseLeave={() => setIsAdminPanelOpen(false)}
                    className="absolute top-8 right-24 w-36 shadow-2xl bg-white py-1 rounded-md">
                    <Link to="/dashboard/list-all-users"
                      onClick={() => setProfileButtonActive(false)}
                      className="flex gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
                    >
                      <FaUsers className="h-5 w-5" />
                      List All Users
                    </Link>
                    <Link to="/dashboard/add-category"
                      onClick={() => setProfileButtonActive(false)}
                      className="flex gap-2 items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
                    >
                      <FaTags className="h-5 w-5" />
                      Add Category
                    </Link>
                    <Link to="/dashboard/add-plan"
                      onClick={() => setProfileButtonActive(false)}
                      className="flex gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
                    >
                      <TbReceiptRupee className="h-5 w-5" />
                      Create Plan
                    </Link>
                  </ul>
                )}
              </div>
            )}
            <Link to="/dashboard/settings"
              onClick={() => setProfileButtonActive(false)}
              className="flex gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
            >
              <IoSettingsOutline className="h-5 w-5" />
              Settings
            </Link>
            <button
              onClick={logoutHandler}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800"
            >
              <IoLogOutOutline className="h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu SideBar */}
      <div
        ref={sidebarRef}
        className={`md:hidden overflow-y-auto fixed ${isSidebarOpen ? "left-0" : "left-[-100%]"} top-0 w-64 h-screen bg-white shadow-2xl shadow-slate-500 transition-all duration-300 ease-in-out rounded-r-xl`}>
        <div className="flex justify-between items-center h-14 px-4 bg-white">
          <FaBlog className="h-8 w-8 text-orange-500" />
          <IoClose
            className="w-10 h-10 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-600 rounded-full cursor-pointer active:bg-gray-300 active:text-gray-800"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>


        <div className="flex px-4 flex-col items-center justify-center gap-y-2">
          <div className="flex flex-col items-center gap-4 mt-2">
            {userData?.user?.profilePicture?.path ?
              <img
                className="h-12 w-12 rounded-full"
                src={userData?.user?.profilePicture?.path}
                alt="profile pic" />
              :
              <AiOutlineUser className="h-16 w-16 rounded-full bg-gray-200 text-gray-500" />
            }
            <div className="text-center">
              <Link
                to="/dashboard"
                onClick={() => setIsSidebarOpen(false)}
                className="text-lg font-semibold text-gray-700 hover:underline">{userData?.user?.username}
              </Link>
              {userData?.user?.isAdmin && <p className="text-green-500 text-sm -mt-1.5">admin</p>}
              <p className="text-sm text-gray-500">{userData?.user?.email}</p>
            </div>
            <Link to='/dashboard/notifications'
              onClick={() => setIsSidebarOpen(false)}
              className="flex hover:bg-orange-100 hover:text-orange-500 p-2 rounded-full"
            >
              <NotificationCounts />
            </Link>
          </div>
          <span className="w-full h-[1px] bg-gray-300"></span>
          <div className="flex flex-col items-center gap-4">
            {navigation.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className="text-md text-gray-500 hover:text-orange-500"
              >
                {item.name}
              </NavLink>
            ))}

            {userData?.user?.isAdmin && (
              <div >
                <button
                  className="flex items-center gap-2 text-gray-500 hover:text-orange-500"
                  onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
                >
                  <MdOutlineAdminPanelSettings className="w-5 h-5" />
                  <span>Admin Panel</span>
                  <IoMdArrowDropdown className={`-ml-2 ${isAdminPanelOpen && "rotate-180"}`} />
                </button>
                {isAdminPanelOpen && <ul className="flex flex-col gap-3 ml-6 text-sm mb-4 mt-2">
                  <Link to="/dashboard/list-all-users"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-500"
                  >
                    <FaUsers className="w-4 h-4" />
                    <span>List All Users</span>
                  </Link>
                  <Link to="/dashboard/add-category"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-500"
                  >
                    <FaTags className="w-4 h-4" />
                    <span>Add Category</span>
                  </Link>
                  <Link to="/dashboard/add-plan"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-500"
                  >
                    <TbReceiptRupee className="w-4 h-4" />
                    <span>Create Plan</span>
                  </Link>
                </ul>}
              </div>
            )}

          </div>
          <span className="w-full h-[1px] bg-gray-300"></span>
          <div className="flex flex-col justify-center items-center my-2 gap-4">
            <Link to="/dashboard/my-earnings"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2 text-gray-500 hover:text-orange-500 -ml-8"
            >
              <MdCurrencyRupee className="w-5 h-5" />
              <span>Earnings</span>
            </Link>
            <Link to="/dashboard/settings"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2 text-gray-500 hover:text-orange-500 -ml-8"
            >
              <IoSettingsOutline className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>
          <span className="w-full h-[1px] bg-gray-300"></span>
          <button
            onClick={logoutHandler}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mt-2 -ml-8"
          >
            <IoLogOutOutline className="w-5 h-5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

    </div>
  );
}