import asyncHandler from 'express-async-handler';
import Post from '../models/post.js';
import Category from '../models/category.js';
import User from '../models/user.js';
import Notification from '../models/notification.js';
import { sendEmailNotification } from '../utils/sendEmailNotification.js';


//@desc     Create a post
//@route    POST  /posts/create
//@access   Private
export const createPost = asyncHandler(async (req, res) => {
    const { description, category } = req.body;
    // console.log(req.file)
    const postCreated = await Post.create({ description, image: req.file, author: req.user, category });

    const categoryFound = await Category.findById(category);
    if (!categoryFound) {
        throw new Error('Category not found!');
    }
    // push the id of the newly created post into Category db and resave it.
    categoryFound.posts.push(categoryFound?._id);
    categoryFound.save();

    const userFound = await User.findById(req.user);
    if (!userFound) {
        throw new Error('User not found!');
    }
    // push postId in the user and resave it. 
    userFound.posts.push(postCreated?._id);
    await userFound.save();

    // update user acount type via mongoose method
    userFound.updateAccountType();
    await userFound.save();

    // create notification
    await Notification.create({
        userId: req.user,
        postId: postCreated?._id,
        message: `New post created by ${userFound?.username}`,
    });

    // Send email notification to all followers
    userFound?.followers.forEach(async (followerId) => {
        // find the users by ids
        const followerUsers = await User.find({ _id: followerId });

        followerUsers.forEach(user => {
            // console.log(user.email)
            // sendEmailNotification(user?.email, postCreated?._id);
        })
    });

    res.status(200).json({
        status: "success",
        message: "Post created successfully",
        post: postCreated,
    });
});

//@desc     get all posts
//@route    GET  /posts
//@access   Public
export const getAllPost = asyncHandler(async (req, res) => {
    const { category, title, page = 1, limit = 2 } = req.query;

    // const post = await Post.findById(id)
    //     .populate({
    //         path: 'comments',
    //         populate: {
    //             path: 'author',
    //             select: 'username',
    //         }
    //     })
    //     .populate({
    //         path: 'author',
    //         select: 'username profilePicture',
    //     });

    // Basic filter
    let filter = {};
    if (category) filter.category = category;
    if (title) filter.description = { $regex: title, $options: 'i' };  // case insensitive

    const posts = await Post.find(filter)
        .sort({ createdAt: -1 })  // newest first
        .skip((page - 1) * (limit))
        .limit(limit)
        .populate({
            path: 'category',
            select: 'categoryName',
        })
        .populate({
            path: 'author',
            select: 'username profilePicture',
        });

    const totalPosts = await Post.find({});

    res.json({
        status: "success",
        result: posts.length,
        currentPage: page,
        perPage: limit,
        totalPages: Math.ceil(totalPosts.length / limit),
        posts,
    });
});

//@desc     get a post
//@route    GET  /posts/:postId
//@access   Public
export const getPost = asyncHandler(async (req, res) => {
    const id = req.params.postId;

    const post = await Post.findById(id)
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username',
            }
        })
        .populate({
            path: 'author',
            select: 'username profilePicture',
        })
        .populate({
            path: 'category',
            select: 'categoryName',
        });

    if (!post) {
        throw new Error("Post not found");
    };

    // check for any login user
    const userId = req.user;

    if (userId) {
        // check if the user has already viewed the post
        if (!post.viewers.includes(userId)) {
            post.viewers.push(userId);
            post.viewsCount = post.viewers.length;
            await post.save();
        }
    }

    res.json({
        status: "success",
        message: "Post fetched successfully",
        post,
    });
});

//@desc     update post
//@route    PUT  /posts/:postId
//@access   Private
export const updatePost = asyncHandler(async (req, res) => {
    const id = req.params.postId;

    const post = await Post.findById(id);

    if (!post) { throw new Error("Post not found") };

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
            description: req.body.description,
            image: req.file,
            category: req.body.category,
        },
        { new: true }
    )
    res.status(201).json({
        status: "success",
        message: "Post updated successfully",
        updatedPost,
    });
});

//@desc     delete post
//@route    DELETE  /posts/:postId
//@access   Private
export const deletePost = asyncHandler(async (req, res) => {
    const id = req.params.postId;

    const post = await Post.findById(id);

    if (!post) { throw new Error("Post not found") };

    await Post.findByIdAndDelete(id);
    res.status(201).json({
        status: "success",
        message: "Post deleted successfully",
    });
});

//@desc     like a post
//@route    PUT  /posts/:postId
//@access   Private
export const likePost = asyncHandler(async (req, res) => {
    // find the user who wants to like
    const userId = req.user;

    // get the postId of the post to be liked
    const postId = req.params.postId;

    // find the post in db
    const post = await Post.findById(postId);

    // check if the user has already disliked the post
    if (post.dislikes.includes(userId)) {
        post.dislikes.pull(userId);
    }

    //Check if a user has already liked the post
    if (post?.likes.includes(userId)) {
        post?.likes?.pull(userId);
    } else {
        post?.likes?.push(userId);
    }

    // resave the post
    await post.save();

    res.status(200).json({ message: 'Post liked successfully' });
});

//@desc     dislike a post
//@route    POST  /posts/:postId
//@access   Private
export const dislikePost = asyncHandler(async (req, res) => {
    // find the user who wants to dislike
    const userId = req.user;

    // get the postId of the post to be disliked
    const postId = req.params.postId;

    // find the post in db
    const post = await Post.findById(postId);

    // check if the user has already liked the post
    if (post?.likes.includes(userId)) {
        post?.likes?.pull(userId);
    }
    //Check if a user has already disliked the post
    if (post?.dislikes.includes(userId)) {
        post?.dislikes?.pull(userId);
    } else {
        post?.dislikes?.push(userId);
    }

    // resave the post
    await post.save();

    // send response
    res.status(200).json({ message: 'Post disliked successfully' });
});