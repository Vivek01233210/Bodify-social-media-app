import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { isAuthenticated } from '../../redux/slices/authSlice.js'
import { checkAuthStatusAPI, sendEmailVerificationTokenAPI, userProfileAPI } from "../../APIServices/userAPI";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import AlertMessage from "../Alert/AlertMessage.jsx";

const Profile = () => {

    const dispatch = useDispatch();
    const { userAuth } = useSelector((state) => state.auth);

    const { data: userData } = useQuery({
        queryKey: ["profile"],
        queryFn: userProfileAPI,
    });
    // console.log(userData)

    const profilePic = userAuth?.profilePicture?.path || userAuth?.profilePicture;

    const hasEmail = userData?.user?.email;
    const hasPlan = userData?.user?.hasSelectedPlan;
    const isEmailVerified = userData?.user?.isEmailVerified;

    const { data } = useQuery({
        queryKey: ["user-auth"],
        queryFn: checkAuthStatusAPI,
    });

    useEffect(() => {
        dispatch(isAuthenticated(data));
    }, [data]);

    // send email verification token mutation
    const verificationTokenMutation = useMutation({
        mutationKey: ["send-email-verification-token"],
        mutationFn: sendEmailVerificationTokenAPI,
    });
    // handle send verification email
    const handleSendVerificationEmail = async () => {
        verificationTokenMutation.mutate();
    }

    return (
        <>
            <div className="mt-16">
                {!hasPlan && (
                    <div
                        className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
                        role="alert"
                    >
                        <p className="font-bold">Plan Selection Required</p>
                        <p>
                            Please{" "}
                            <Link to="/pricing" className="underline text-yellow-800">
                                select a plan
                            </Link>{" "}
                            to continue using our services.
                        </p>
                    </div>
                )}

                {verificationTokenMutation.isPending ? (
                    <AlertMessage type="loading" message="Loading..." />
                ) : verificationTokenMutation.isError ? (
                    <AlertMessage
                        type="error"
                        message={
                            verificationTokenMutation?.error?.message || verificationTokenMutation?.error?.response?.data?.message
                        }
                    />
                ) : verificationTokenMutation.isSuccess ? (
                    <AlertMessage type="success" message={verificationTokenMutation?.data?.message} />
                ) : null}

                {!isEmailVerified && (
                    <div
                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                        role="alert"
                    >
                        <p className="font-bold">Account Verification Needed</p>
                        <p>
                            Your account is not verified. Please{" "}
                            <button
                                onClick={handleSendVerificationEmail}
                                className="underline text-red-800"
                            >
                                verify your account
                            </button>{" "}
                            for full access.
                        </p>
                    </div>
                )}
                
                {!hasEmail && (
                    <div
                        className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
                        role="alert"
                    >
                        <p className="font-bold">Email Required</p>
                        <p>
                            Please{" "}
                            <Link to="/dashboard/add-email" className="underline text-blue-800">
                                add an email
                            </Link>{" "}
                            to your account for important notifications.
                        </p>
                    </div>
                )}
            </div>

            <div className="border-2 border-red-700 rounded-xl p-8 my-8 max-w-96 mx-auto flex flex-col items-center mt-16">
                <div className="w-full flex gap-8 justify-around">
                    <div>
                        {userData?.user?.profilePicture ? (
                            <img
                                className="block h-20 w-20 rounded-full"
                                src={profilePic}
                                alt="profile-picture"
                            />
                        ) : (
                            <AiOutlineUser className="h-20 w-20 mb-2 text-gray-400 rounded-full bg-gray-200" />
                        )}
                    </div>
                    <div className="flex flex-col justify-center flex-grow">
                        <span className="text-xl">
                            {data?.username}
                            {userData?.user?.isAdmin && <span className="text-green-500">(admin)</span>}
                        </span>
                        <span className="text-gray-500">{userData?.user?.email}</span>
                    </div>
                </div>

                <div className="w-full mt-2 h-[1px] bg-gray-200"></div>

                <div className="w-full m-2 p-2 grid grid-cols-3 gap-y-1">
                    <Link
                        to='/dashboard/my-posts'
                        className="flex flex-col items-center p-2 rounded-md hover:bg-gray-100">
                        <span>{userData?.user?.posts?.length}</span>
                        <span className="text-gray-500 text-sm">Posts</span>
                    </Link>
                    <Link
                        to='/dashboard/my-followers'
                        className="flex flex-col items-center p-2 rounded-md hover:bg-gray-100">
                        <span>{userData?.user?.followers?.length}</span>
                        <span className="text-gray-500 text-sm">Followers</span>
                    </Link>
                    <Link
                        to='/dashboard/my-followings'
                        className="flex flex-col items-center p-2 rounded-md hover:bg-gray-100">
                        <span>{userData?.user?.following?.length}</span>
                        <span className="text-gray-500 text-sm">Following</span>
                    </Link>
                    <button
                        className="flex flex-col items-center p-2 rounded-md cursor-default">
                        <span>{userData?.user?.posts?.reduce((acc, post) => (acc + post.viewsCount), 0)}</span>
                        <span className="text-gray-500 text-sm">Views</span>
                    </button>
                    <button
                        className="flex flex-col items-center p-2 rounded-md cursor-default">
                        <span>{userData?.user?.posts?.reduce((acc, post) => (acc + post.likes.length), 0)}</span>
                        <span className="text-gray-500 text-sm">Likes</span>
                    </button>
                    <button
                        className="flex flex-col items-center p-2 rounded-md cursor-default">
                        <span>{userData?.user?.posts?.reduce((acc, post) => (acc + post.dislikes.length), 0)}</span>
                        <span className="text-gray-500 text-sm">Dislikes</span>
                    </button>
                    <button
                        className="col-start-2 flex flex-col items-center p-2 rounded-md cursor-default">
                        <span>{userData?.user?.posts?.reduce((acc, post) => (acc + post.dislikes.length), 0)}</span>
                        <span className="text-gray-500 text-sm">Comments</span>
                    </button>
                </div>

                <div className="w-full mb-4 h-[1px] bg-gray-200"></div>

                <div className="w-full">
                    <Link
                        to="/dashboard/create-post"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex justify-center items-center gap-2 w-full py-2 px-6 rounded-md bg-orange-600 shadow font-medium text-white hover:bg-orange-800 transition duration-200">
                        <FaPlus className="w-3" />
                        Create Post
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Profile;