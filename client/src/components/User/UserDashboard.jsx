import {
  HomeIcon,
} from "@heroicons/react/24/outline";
import { Outlet } from "react-router-dom";

import {
  FaUserEdit,
  FaFileAlt,
  FaUsers,
  FaCalendarPlus,
  FaTags,
  FaWallet,
} from "react-icons/fa";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
  {
    name: "Create New Post",
    href: "/dashboard/create-post",
    icon: FaUserEdit,
    current: false,
  },
  {
    name: "My Posts",
    href: "/dashboard/my-posts",
    icon: FaFileAlt,
    current: false,
  },
  {
    name: "My Followers",
    href: "/dashboard/my-followers",
    icon: FaUsers,
    current: false,
  },
  {
    name: "My Followings",
    href: "/dashboard/my-followings",
    icon: FaUsers,
    current: false,
  },
  {
    name: "Create Plan",
    href: "/dashboard/add-plan",
    icon: FaCalendarPlus,
    current: false,
  },
  {
    name: "List All Users",
    href: "/dashboard/list-all-users",
    icon: FaUsers,
    current: false,
  },
  {
    name: "Add Category",
    href: "/dashboard/add-category",
    icon: FaTags,
    current: false,
  },
  {
    name: "My Earnings",
    href: "/dashboard/my-earnings",
    icon: FaWallet,
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserDashboard() {
  //Get the auth user from redux store

  return (
    <main className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </main>
  );
}