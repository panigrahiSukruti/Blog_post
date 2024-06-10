const Post = require('../models/postModel');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/errorModel');

const createPost = async (req, res, next) => {
    const { title, category, description } = req.body;
  
    try {
      console.log("Request body:", req.body);
      console.log("Request file:", req.files);
  
      if (!title || !category || !description) {
        return next(
          new HttpError("Please enter all fields and upload a file", 422)
        );
      }
  
    //   const { thumbnail } = req.files;
    //   console.log("thumbnail: ", thumbnail);
  
    //   if (thumbnail.size > 2000000) {
    //     fs.unlink(thumbnail.path, (err) => {
    //       if (err) console.error("Failed to delete oversized file:", err);
    //     });
    //     return next(
    //       new HttpError("File size is too large. Should be less than 2MB", 422)
    //     );
    //   }
  
      const newPost = await Post.create({
        title,
        category,
        description,
        // thumbnail: newFilename,
        creator: req.user.id,
      });
  
      if (!newPost) {
        return next(new HttpError("Post creation failed", 422));
      }
  
      const currentUser = await User.findById(req.user.id);
      if (currentUser) {
        const userPostCount = currentUser.posts + 1;
        await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
      }
  
      res.status(201).json(newPost);
    } catch (err) {
      console.error("error", err);
      return next(
        new HttpError(
          err.message || "Something went wrong, could not create post",
          500
        )
      );
    }
  };

const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong, could not fetch posts", 500));
    }
};

const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post does not exist", 422));
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong, could not fetch post", 500));
    }
};

const getCatPosts = async (req, res, next) => {
    try {
        const category = req.params.category;
        const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
        res.status(200).json(catPosts);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong, could not fetch category posts", 500));
    }
};

const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong, could not fetch user posts", 500));
    }
};

const editPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, category, description, thumbnail } = req.body;

        if (!title || !category || !description || description.length < 12) {
            return next(new HttpError("Please enter all fields", 422));
        }

        let updatedPost;
        if (!thumbnail) {
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
        } else {
            const oldPost = await Post.findById(postId);
            if (!oldPost) {
                return next(new HttpError("Post does not exist", 422));
            }

            // Handle thumbnail update if needed

            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail }, { new: true });
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        next(new HttpError(err.message || "Something went wrong, could not update post", 500));
    }
};

const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const deletedPost = await Post.findById(postId);

        if (!deletedPost) {
            return next(new HttpError("Post does not exist", 422));
        }

        if (deletedPost.thumbnail) {
            fs.unlink(path.join(__dirname, `../uploads/${deletedPost.thumbnail}`), async (err) => {
                if (err) {
                    return next(new HttpError(err, 422));
                } else {
                    await Post.findByIdAndDelete(postId);

                    const currentUser = await User.findById(req.user.id);
                    if (currentUser) {
                        const userPostCount = currentUser.posts - 1;
                        await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
                    }

                    res.status(200).json({ message: "Post deleted" });
                }
            });
        } else {
            await Post.findByIdAndDelete(postId);

            const currentUser = await User.findById(req.user.id);
            if (currentUser) {
                const userPostCount = currentUser.posts - 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
            }

            res.status(200).json({ message: "Post deleted" });
        }
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong, could not delete post", 500));
    }
};

module.exports = { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost };
