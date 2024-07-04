import { useFormik } from "formik";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPostAPI } from "../../APIServices/postsAPI";
import { useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import AlertMessage from "../Alert/AlertMessage";
import Select from 'react-select';
import { getCategoriesAPI } from "../../APIServices/categoryAPI";
import { useSelector } from "react-redux";
// import { Redirect } from "react-router-dom";

const CreatePost = () => {
    const [description, setDescription] = useState("");

    // get auth status
    const {userAuth} = useSelector(state => state.auth);

    //File upload state
    const [imageError, setImageErr] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    // post mutation
    const postMutation = useMutation({
        mutationKey: ["create-post"],  // unique, used by react query for caching
        mutationFn: createPostAPI,
    });

    // get category query
    const { data: categoryList } = useQuery({
        queryKey: ["category-lists"],
        queryFn: getCategoriesAPI,
    });

    const formik = useFormik({
        // initial data
        initialValues: {
            description: "",
            image: "",
            category: ""
        },
        // validation
        validationSchema: Yup.object({
            description: Yup.string().required("Description is required"),
            image: Yup.string().required("Image is required"),
            category: Yup.string().required("Category is required"),
        }),
        // submit
        onSubmit: (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("description", description);
            formData.append("image", values.image);
            formData.append("category", values.category);
            postMutation.mutate(formData);
            resetForm();
            setImagePreview(null);
        },
    });

    // File Upload logic
    const handleFileChange = (event) => {
        //get the file selected
        const file = event.currentTarget.files[0];
        //Limit file size
        if (file.size > 1048576 * 2) {
            setImageErr("File size can't exceed 2MB");
            return;
        }
        // limit the file types
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
            setImageErr("Invalid file type");
        }
        //set the image preview
        formik.setFieldValue("image", file);
        setImagePreview(URL.createObjectURL(file));
    }
    const removeImage = () => {
        formik.setFieldValue("image", null);
        setImagePreview(null);
    }

    const { isPending: isLoading, isError, isSuccess, error } = postMutation;

    if(!userAuth?.isAuthenticated) {
        return <h1>Login to Continue</h1>
    }

    return (
        <div className="flex items-center justify-center mt-16">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 m-4">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Add New Post
                </h2>
                {/* show alert */}

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Description Input - Using ReactQuill for rich text editing */}
                    <div className="mb-14">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <ReactQuill
                            value={formik.values.description}
                            className="h-32"
                            onChange={(value) => {
                                setDescription(value);
                                formik.setFieldValue("description", value);
                            }}
                        />
                        {/* display err msg */}
                        {formik.touched.description && formik.errors.description && (
                            <span style={{ color: "red" }}>{formik.errors.description}</span>
                        )}
                    </div>

                    {/* Category Input - Dropdown for selecting post category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Category
                        </label>
                        <Select
                            name="category"
                            options={categoryList?.categories?.map((category) => {
                                return {
                                    value: category._id,
                                    label: category.categoryName,
                                };
                            })}
                            onChange={(option) => {
                                return formik.setFieldValue("category", option.value);
                            }}
                            value={categoryList?.categories?.find(
                                (option) => option.value === formik.values.category
                            )}
                            className="mt-1 block w-full"
                        />
                        {formik.touched.category && formik.errors.category && (
                            <p className="text-sm text-red-600">{formik.errors.category}</p>
                        )}
                    </div>

                    {/* Image Upload Input - File input for uploading images */}
                    <div className="flex flex-col items-center justify-center bg-gray-50 p-4 shadow rounded-lg">
                        <label
                            htmlFor="images"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Upload Image
                        </label>
                        <div className="flex justify-center items-center w-full">
                            <input
                                id="images"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="images"
                                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                            >
                                Choose a file
                            </label>
                        </div>
                        {/* Display error message */}
                        {formik.touched.image && formik.errors.image && (
                            <p className="text-sm text-red-600">{formik.errors.image}</p>
                        )}

                        {/* error message */}
                        {imageError && <p className="text-sm text-red-600">{imageError}</p>}

                        {/* Preview image */}

                        {imagePreview && (
                            <div className="mt-2 relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2 h-24 w-24 object-cover rounded-xl"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
                                >
                                    <FaTimesCircle className="text-red-500" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit Button - Button to submit the form */}
                    {!isLoading ? (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Add Post
                        </button>
                    ) : (
                        <AlertMessage type='loading' message='Loading...' />
                    )}
                    {isSuccess && !isError && <AlertMessage type='success' message='Posted' />}
                    {isError && <AlertMessage type='error' message={error?.response?.data?.message || "Some error occured!"} />}
                </form>
            </div>
        </div>
    );
};

export default CreatePost;