import { useQuery } from "@tanstack/react-query";
import Avatar from "./Avatar";
import { userProfileAPI } from "../../APIServices/userAPI";
import { AiOutlineUser } from "react-icons/ai";

const MyFollowers = () => {
    //fetch userProfile
    const { data } = useQuery({
        queryKey: ["profile"],
        queryFn: userProfileAPI,
    });

    //get the user following
    // console.log(data?.user)
    const myFollowers = data?.user?.followers;
    // console.log(myFollowers)

    return (
        <section className=" bg-gray-50 mt-16">
            <div className="max-w-2xl mx-auto mb-20 text-center">
                <h1 className="font-heading text-2xl xs:text-xl md:text-3xl font-bold text-gray-900 mb-8">
                    My <span className="text-orange-900">Followers</span>
                </h1>
                <p className="text-lg text-gray-500 mb-4">
                    Here are all the people who follow you.
                </p>
                <p>Total Followers: {myFollowers?.length}</p>
            </div>
            <div className="flex flex-wrap -mx-4 -mb-8">
                {myFollowers?.map((follower) =>
                (
                    <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8"
                        key={follower?._id}
                    >
                        <div className="max-w-56 mx-auto p-6 text-center bg-white rounded-md border-2 border-gray-300">
                            {follower?.profilePicture ? (
                                <img
                                    className="w-16 h-16 rounded-full block mb-2 mx-auto"
                                    src={follower?.profilePicture?.path}
                                    alt="profile-picture"
                                />
                            ) : (
                                <AiOutlineUser className="w-16 h-16 text-gray-400 mx-auto" />
                            )}
                            <h5 className="text-2xl font-bold text-gray-900">
                                {follower?.username}
                            </h5>
                            <span className="block text-orange-900 mb-3">
                                {follower?.email}
                            </span>
                        </div>
                    </div>
                )
                )}
            </div>
        </section>
    );
};

export default MyFollowers;