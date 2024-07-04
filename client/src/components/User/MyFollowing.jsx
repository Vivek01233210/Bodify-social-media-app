import { useQuery } from "@tanstack/react-query";
import Avatar from "./Avatar";
import { userProfileAPI } from "../../APIServices/userAPI";

const MyFollowing = () => {
  //fetch userProfile
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: userProfileAPI,
  });
  //get the user following
  const myFollowing = data?.user?.following;

  return (
    <section className="bg-gray-50 mt-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-heading text-2xl xs:text-xl md:text-3xl font-bold text-gray-900 mb-8">
          <span>
            My <span className="text-orange-900">Following</span>
          </span>
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          Here are all the people you follow.
        </p>
        <p>Total Following: {myFollowing?.length}</p>
      </div>
      <div className="flex flex-wrap -mx-4 -mb-8">
        {myFollowing?.map((follower) =>
        (
          <div key={follower._id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
            <div className="max-w-md mx-auto py-4 px-4 text-center bg-white rounded-md">
              {follower?.profilePicture ? (
                <img
                  className="w-24 h-24 rounded-full block mb-6 mx-auto"
                  src={follower?.profilePicture.path}
                  alt="profile-pictures"
                />
              ) : (
                <Avatar />
              )}
              <h5 className="text-2xl font-bold text-gray-900 mb-2">
                {follower?.username}
              </h5>
            </div>
          </div>
        )
        )}
      </div>
    </section>
  );
};

export default MyFollowing;