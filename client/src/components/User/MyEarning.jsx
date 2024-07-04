import { useQuery } from "@tanstack/react-query";
import { FaRupeeSign } from "react-icons/fa";
import { getMyEarningsAPI } from "../../APIServices/earningsAPI";


const MyEarnings = () => {
  const { data } = useQuery({
    queryKey: ["my-earnings"],
    queryFn: getMyEarningsAPI,
  });

  return (
    <div>
      {data?.earnings?.length <= 0 ? (
        <h2 className="mt-20">No Earnings at the moment</h2>
      ) : (
        <div className="flex justify-center items-center bg-gray-100 mt-16">
          <div className="w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col items-center py-6 bg-gradient-to-r from-green-400 to-blue-500">
              <FaRupeeSign className="text-white text-6xl" />
              <h1 className="text-2xl font-bold text-white mt-3">
                My Earnings
              </h1>
            </div>
            <ul className="divide-y divide-gray-200">
              {data?.earnings?.map((earning) => (
                <li
                  key={earning._id}
                  className="p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800">
                    {earning.post?.author?.username}
                  </span>
                  <div className="text-right">
                    <span className="flex items-center text-lg text-gray-800">
                    <FaRupeeSign />
                      {earning.amount}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {new Date(earning.calculatedOn).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEarnings;