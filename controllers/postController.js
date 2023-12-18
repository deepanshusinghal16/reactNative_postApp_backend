const postModel = require("../models/postModel");

const createPostController = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(500).json({
                success: false,
                message: "Please provide all fields",
            })
        }

        const post = await postModel({ title, description, postedBy: req.auth._id }).save()
        // console.log(req);

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        })
    }
    catch (error) {
        // console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error creating post",
            error,
        })
    }
}

const getAllPostsController = async (req, res) => {
    try {
        const post = await postModel.find().populate('postedBy', "_id name").sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            post,
        })
    }
    catch (error) {
        // console.log("Error getting all posts");
        return res.status(500).json({
            success: false,
            message: "Error getting all post",
            error,
        })
    }
}

const getUserPostsController = async (req, res) => {
    try {
        const userPost = await postModel.find({ postedBy: req.auth._id }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "PUser Posts fetched successfully",
            userPost,
        })
    }
    catch (error) {
        // console.log("Error getting all posts");
        return res.status(500).json({
            success: false,
            message: "Error getting user post",
            error,
        })
    }
}

const deletePostController = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);
        await postModel.findByIdAndDelete({ _id: id })
        // console.log(id);
        return res.status(200).json({
            success: true,
            message: "Posts deleted successfully",
        })
    }
    catch (error) {
        // console.log("Error getting all posts");
        return res.status(500).json({
            success: false,
            message: "Error deleting the post",
            error,
        })
    }
}

const updatePostController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const post = await postModel.findById({ _id: id });
        if (!title || !description) {
            return res.status(500).json({
                success: false,
                message: "Enter all the req details",
            })
        }

        const updatedPost = await postModel.findByIdAndUpdate({ _id: id }, {
            title: title || post?.title,
            description: description || post?.description
        }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Posts updated successfully",
            updatedPost,
        })
    }
    catch (error) {
        // console.log("Error getting all posts");
        return res.status(500).json({
            success: false,
            message: "Error updating the post",
            error,
        })
    }
}

module.exports = { createPostController, getAllPostsController, getUserPostsController, deletePostController, updatePostController }
