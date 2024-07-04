import { useParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaComment,
} from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { dislikePostAPI, getPostAPI, likePostAPI } from "../../APIServices/postsAPI";
import { useState } from "react";
import './postCss.css';
import { followUserAPI, unfollowUserAPI, userProfileAPI } from "../../APIServices/userAPI";
import { RiUserUnfollowFill, RiUserFollowLine } from "react-icons/ri";
import { useFormik } from "formik";
// import * as Yup from "yup";
import { addCommentAPI } from "../../APIServices/commentAPI";
import { timeAgo } from "../../utils/dateFormatter.js";
import SmallSpinner from "../Spinner/SmallSpinner.jsx";

const PostDetail = () => {
  const [comment, setComment] = useState("");

  const { postId } = useParams();

  // get post details query
  const { data, refetch: refetchPost } = useQuery({
    queryKey: ["post-details"],
    queryFn: () => getPostAPI(postId),
  });
  // console.log(data)

  // get profile query
  const { data: profileData, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userProfileAPI(),
  });
  // console.log(profileData)

  // get the id of the author of the post
  const author = data?.post?.author;
  // console.log(author._id)

  // ----Follow post logic----
  // check if the logged in user is already following the author of the post
  const isFollowing = profileData?.user?.following?.find(
    (user) => user?._id?.toString() === author?._id?.toString()
  );
  // follow mutation
  const followUserMutation = useMutation({
    mutationKey: ["follow"],
    mutationFn: followUserAPI
  });
  const { isPending: isFollowPending } = followUserMutation;
  // follow user handler
  const handleFollow = () => {
    followUserMutation
      .mutateAsync(author._id)
      .then(() => refetchProfile())
      .catch((error) => console.log(error));
  }
  // unfollow user mutation
  const unfollowUserMutation = useMutation({
    mutationKey: ["unfollow"],
    mutationFn: unfollowUserAPI
  });
  const { isPending: isUnfollowPending } = unfollowUserMutation;
  const isFollowUnfollowPending = isFollowPending || isUnfollowPending;
  // unfollow user handler
  const handleUnfollow = () => {
    unfollowUserMutation
      .mutateAsync(author._id)
      .then(() => refetchProfile())
      .catch((error) => console.log(error));
  }

  const isLiked = data?.post?.likes.includes(author?._id?.toString());
  // like post mutation
  const likePostMutation = useMutation({
    mutationKey: ["likes"],
    mutationFn: likePostAPI
  });
  const { isPending: isLikePending } = likePostMutation;
  // like post handler
  const handleLike = () => {
    likePostMutation
      .mutateAsync(postId)
      .then(() => refetchPost())
      .catch((error) => console.log(error));
  }

  const isDisliked = data?.post?.dislikes.includes(author?._id?.toString());
  // dislike post mutation
  const dislikePostMutation = useMutation({
    mutationKey: ["dislikes"],
    mutationFn: dislikePostAPI
  });
  const { isPending: isDislikePending } = dislikePostMutation;
  //dislike post handler
  const handleDislike = () => {
    dislikePostMutation
      .mutateAsync(postId)
      .then(() => refetchPost())
      .catch((error) => console.log(error));
  }

  // comment mutation
  const commentMutation = useMutation({
    mutationKey: ["create-comment"],
    mutationFn: addCommentAPI
  });
  const { isPending: isCommentPending } = commentMutation;
  // formik config for comments
  const formik = useFormik({
    initialValues: {
      content: "",
    },
    onSubmit: (values) => {
      const data = {
        content: values.content,
        postId,
      };
      commentMutation
        .mutateAsync(data)
        .then(() => {
          refetchPost();
          formik.resetForm();
        })
        .catch((error) => console.log(error));
    },
  })

  return (
    <div className="container mx-auto md:px-28 p-4 mt-16">
      <div className="bg-white rounded-lg shadow-2xl p-5">

        {/* post author */}
        <div className="flex items-center gap-2">
          {/* author image */}
          {author?.profilePicture ? (
            <img
              src={author?.profilePicture?.path}
              alt={author?.username}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <img
              src="https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
              alt={author?.username}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex flex-col my-4">
            <p>{author?.username}</p>
            <small className="text-gray-500 flex items-center -mt-1 text-xs">
              {timeAgo(data?.post?.createdAt)}
              <LuDot className="mt-1/2"/>
            </small>
          </div>

          {/* Follow/Unfollow button */}
          <div className="ml-auto">
            {isFollowUnfollowPending ? (
              <SmallSpinner classes="w-6 h-6 mr-8 border-gray-500 border-2" />
            ) : isFollowing ? (
              <button
                onClick={handleUnfollow}
                className="inline-flex items-center text-sm font-bold text-orange-500 hover:text-orange-700"
              >
                <RiUserUnfollowFill className="mr-2" />
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="inline-flex items-center text-sm font-bold text-orange-500 hover:text-orange-700"
              >
                Follow
                <RiUserFollowLine className="ml-2" />
              </button>
            )}
          </div>

        </div>

        {/* post img */}
        <img
          src={data?.post?.image?.path}
          alt={data?.post?.image?.description || "post  image"}
          className="w-full h-full object-cover rounded-lg mb-4"
        />

        {/* like, dislike and view */}
        <div className="flex gap-4 items-center text-gray-700 mb-4">
          {/* like icon */}
          <span
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleLike}
          >
            {isLikePending ? <SmallSpinner classes="w-4 h-4 border-2 border-gray-500" /> : <FaThumbsUp className={`${isLiked && "text-orange-500"}`} />}
            {data?.post?.likes?.length || 0}
          </span>
          {/* Dislike icon */}
          <span
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleDislike}
          >
            {isDislikePending ? <SmallSpinner classes="w-4 h-4 border-2 border-gray-500" /> : <FaThumbsDown className={`${isDisliked && "text-orange-500"}`} />}
            {data?.post?.dislikes?.length || 0}
          </span>
          {/* views icon */}
          <span className="flex items-center gap-1">
            <FaEye />
            {data?.post?.viewsCount || 0}
          </span>
        </div>

        {/* post details */}
        <div className="flex justify-between items-center mb-3">
          <div
            className="rendered-html-content mb-2"
            dangerouslySetInnerHTML={{ __html: data?.post?.description }}
          />
        </div>

        {/* Comment Form */}
        <form onSubmit={formik.handleSubmit}>
          <textarea
            className="w-full border border-gray-300 p-2 rounded-lg mb-2"
            rows="3"
            required
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            {...formik.getFieldProps("content")}
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            {isCommentPending ? <SmallSpinner classes="w-4 h-4 border-2 border-white" /> :
              <FaComment className="inline mr-1" />
            }
            Comment
          </button>
        </form>

        {/* Comments List */}
        <div>
          <h2 className="text-xl font-bold mb-2">Comments:</h2>
          {data?.post?.comments?.map(comment => (
            <div key={comment._id} className="border-b border-gray-300 mb-2 pb-2">
              <p className="text-gray-800">{comment.content}</p>
              <div className="flex flex-col">
                <span className="text-gray-600 text-sm">
                - {comment.author?.username}
              </span>
              <small className="text-gray-600 text-xs ml-2 flex">
                {timeAgo(comment.createdAt)}<LuDot className="mt-1"/>
              </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PostDetail