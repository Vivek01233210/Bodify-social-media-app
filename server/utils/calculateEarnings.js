import Earning from "../models/earning.js";
import Post from "../models/post.js";

export const calculateEarnings = async () => {
    // get the current date
    const currentDate = new Date();

    // get all the posts
    const posts = await Post.find();

    for (const post of posts) {
        // create new unique viewers since the last calculation
        const newViewsCount = post.viewers.length - post.lastCalculatedViewsCount;

        // calculate earnings based on the number of new views
        const earningsAmount = newViewsCount * process.env.RATE_PER_VIEW;

        // update this month earnings and total earnings
        post.thisMonthEarnings = earningsAmount;
        post.totalEarnings += earningsAmount;

        // create the earning doc
        await Earning.create({
            user: post.author,
            post: post._id,
            amount: earningsAmount,
            calculatedOn: currentDate
        });

        // update the lastCalculatedViewsCount and the nextEarningDate
        post.lastCalculatedViewsCount = post.viewers.length;
        post.nextEarningDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);

        // save the post
        await post.save();
    }
}