import { useQuery } from "@tanstack/react-query";
import { IoMdNotifications } from "react-icons/io";
import { fetchNotificationsAPI } from "../../APIServices/notificationAPI";


const NotificationCounts = () => {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationsAPI,
  });
  //filter unread notifications
  const unreadNotifications = data?.notifications?.filter(
    (notification) => notification?.isRead === false
  );

  return (
      <div className="relative inline-block">
        <IoMdNotifications className="text-2xl text-gray-700  h-5 w-5" />{" "}
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full -translate-y-1/3 translate-x-1/3">
          {unreadNotifications?.length || 0}
        </span>
      </div>
  );
};

export default NotificationCounts;