import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaTimesCircle } from "react-icons/fa";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getPostAPI,
    updatePostAPI,
} from "../../APIServices/postsAPI";
import AlertMessage from "../Alert/AlertMessage";
import { getCategoriesAPI } from "../../APIServices/categoryAPI";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {

    const { postId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: postDetails } = useQuery({
        queryKey: ["post-details"],
        queryFn: () => getPostAPI(postId),
    });
    // console.log(postDetails);

    const [imageError, setImageErr] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        if (postDetails && postDetails.post && postDetails.post.category) {
            setSelectedCategory(postDetails.post.category._id); // Assuming category has an _id field
        }
    }, [postDetails]); // Dependency array, useEffect will run when postDetails changes

    useEffect(() => {
        if (postDetails && postDetails.post && postDetails.post.image && postDetails.post.image.path) {
            const imageUrl = postDetails.post.image.path;
            setImagePreview(imageUrl);
            fetch(imageUrl)
                .then(response => response.blob()) // Convert the response to a blob
                .then(blob => {
                    // Create a file from the blob
                    const imageFile = new File([blob], "downloadedImage", { type: "image/jpeg" }); // Adjust the type accordingly
                    setImageFile(imageFile); // Assuming setImageFile is your state setter for storing the file
                })
                .catch(error => console.error('Error fetching image:', error));
        }
    }, [postDetails]);

    const postMutation = useMutation({
        mutationKey: ["update-post"],
        mutationFn: updatePostAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(['profile', 'post-details']);
        },
    });

    const formik = useFormik({
        initialValues: {
            description: postDetails?.post?.description,
            image: imageFile || null,
            category: selectedCategory,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            description: Yup.string().required("Description is required"),
            image: Yup.string().required("image is required"),
            category: Yup.string().required("Category is required"),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("description", values.description);
            formData.append("image", values.image);
            formData.append("category", values.category);
            postMutation.mutateAsync({ formData, postId })
                .then(() => navigate("/dashboard/my-posts")
                )
        },
    });

    const { data } = useQuery({
        queryKey: ["category-lists"],
        queryFn: getCategoriesAPI,
    });
    // console.log(data)

    //!===== File upload logics====
    //! Handle fileChange
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
        // console.log(file)
        formik.setFieldValue("image", file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        formik.setFieldValue("image", null);
        setImagePreview(null);
    };

    const { isPending: isLoading, isError, isSuccess } = postMutation;
    const errorMsg = postMutation?.error?.response?.data?.message;

    return (
        <div className="flex items-center justify-center mt-16">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 m-4">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Update Post
                </h2>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Description Input - Using ReactQuill for rich text editing */}
                    <div className="mb-10">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <ReactQuill
                            value={formik.values.description}
                            onChange={(value) => {
                                // setDescription(value);
                                formik.setFieldValue("description", value);
                            }}
                            className="h-40"
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
                            className="mt-2 block text-sm font-medium text-gray-700"
                        >
                            Category
                        </label>
                        <Select
                            name="category"
                            options={data?.categories?.map((category) => {
                                return {
                                    value: category._id,
                                    label: category.categoryName,
                                };
                            })}
                            onChange={(option) => {
                                return formik.setFieldValue("category", option.value);
                            }}
                            value={data?.categories?.find(
                                category => category._id === formik.values.category
                            ) ? {
                                value: formik.values.category,
                                label: data?.categories?.find(category => category._id === formik.values.category)?.categoryName
                            } : null}
                            className="mt-1 block w-full"
                        />
                        {/* display error */}
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
                                    className="mt-2 h-24 w-24 object-cover rounded-full"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1"
                                >
                                    <FaTimesCircle className="text-red-500" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submit Button - Button to submit the form */}
                    {!isLoading && <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update Post
                    </button>}
                    {isLoading && (
                        <AlertMessage type="loading" message="Updating please wait" />
                    )}
                    {isSuccess && (
                        <AlertMessage type="success" message="Post updated successfully" />
                    )}
                    {isError && <AlertMessage type="error" message={errorMsg} />}
                </form>
            </div>
        </div>
    );
};

export default UpdatePost;