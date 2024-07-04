import asyncHandler from 'express-async-handler';
import Category from '../models/category.js';


//@desc     Create a category
//@route    POST  /category/create
//@access   Public
export const createCategory = asyncHandler(async (req, res) => {
    const { categoryName, description } = req.body;

    const categoryFound = await Category.findOne({ categoryName, description });

    if (categoryFound) {
        throw new Error("Category already exists");
    }

    const categoryCreated = await Category.create({
        categoryName,
        description,
        author: req.user,
    });

    res.status(201).json({
        status: "success",
        message: "Category created successfully",
        categoryCreated,
    });
});

//@desc     get all categories
//@route    GET  /category
//@access   Public
export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    res.status(201).json({
        status: "success",
        message: "Category fetched successfully",
        categories,
    });
});

//@desc     get a category
//@route    GET  /category/:categoryId
//@access   Public
export const getCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;

    const categoryFound = await Category.findById(categoryId);
    if (!categoryFound) {
        throw new Error("Category  not found");
    }

    res.status(201).json({
        status: "success",
        message: "Category fetched successfully",
        categoryFound,
    });
});

//@desc     update category
//@route    PUT  /category/:categoryId
//@access   Public
export const updateCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;

    const categoryFound = await Category.findById(categoryId);
    if (!categoryFound) {
        throw new Error("Category  not found");
    }

    const categoryUpdated = await Category.findByIdAndUpdate(
        categoryId,
        {
            categoryName: req.body.categoryName,
            description: req.body.description,
        },
        {
            new: true,
        }
    );

    res.status(201).json({
        status: "Category updated successfully",
        categoryUpdated,
    });
});

//@desc     delete category
//@route    DELETE  /category/:categoryId
//@access   Public
export const deleteCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;

    await Category.findByIdAndDelete(categoryId);

    res.status(201).json({
        status: "success",
        message: "Category deleted successfully",
    });
});
