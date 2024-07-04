import { useParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPostAPI, updatePostAPI } from "../../APIServices/posts/postsAPI";
import { useFormik } from "formik";
import * as Yup from "yup";


const UpdatePost = () => {
    const { postId } = useParams();

    const { data } = useQuery({
        queryKey: ["post-details"],
        queryFn: () => getPostAPI(postId),
    });

    const postMutation = useMutation({
        mutationKey: ["update-post"],
        mutationFn: updatePostAPI,
    });

    const formik = useFormik({
        // initial data
        initialValues: {
            title: data?.post?.title || "",
            description: data?.post?.description || "",
        },
        enableReinitialize: true,
        // validation
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            description: Yup.string().required("Description is required"),
        }),
        // submit
        onSubmit: (values) => {
            const postData = {
                title: values.title,
                description: values.description,
                postId,
            };
            postMutation.mutate(postData);
        },
    });

    const { isPending: isLoading, isError, isSuccess, error } = postMutation;

    return (
        <div>
            <h1> You are editing -{data?.post.title}</h1>
            <div>
                {isLoading && <p>Loading...</p>}
                {isSuccess && !isError && <p>Post updated successfully</p>}
                {isError && <p>{error.message}</p>}
                <form onSubmit={formik.handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter Title"
                        {...formik.getFieldProps("title")}
                    />
                    {/* display err msg */}
                    {formik.touched.title && formik.errors.title && (
                        <span style={{ color: "red" }}>{formik.errors.title}</span>
                    )}
                    <input
                        type="text"
                        name="description"
                        placeholder="Enter description"
                        {...formik.getFieldProps("description")}
                    />
                    {/* display err msg */}
                    {formik.touched.description && formik.errors.description && (
                        <span style={{ color: "red" }}>{formik.errors.description}</span>
                    )}
                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    )
}

export default UpdatePost;