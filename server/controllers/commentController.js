import asyncHandler from 'express-async-handler';
import Comment from '../models/comment.js'
import Post from '../models/post.js'


//@desc    Create new comment
//@route   POST /comments
//@access  Private
export const createComment = asyncHandler(async (req, res) => {
    const { content, postId } = req.body

    const post = await Post.findById(postId);
    if(!post) {
        res.status(404)
        throw new Error('Post not found')
    }

    const newComment = await Comment.create({
        content,
        author: req.user,
        post: postId
    });

    // push comment id in the post doc
    post.comments.push(newComment._id);
    // save the post 
    await post.save();

    
    res.status(201).json({
        success: "success",
        newComment
    })
});


//@desc delete comment
//@route DELETE /comments/:id
//@access Private
const deleteComment = asyncHandler(async (req, res) => {
});