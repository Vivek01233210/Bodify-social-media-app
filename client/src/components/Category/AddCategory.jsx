import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import AlertMessage from "../Alert/AlertMessage";
import { addCategoryAPI } from "../../APIServices/categoryAPI";

const AddCategory = () => {
    const categoryMutation = useMutation({
        mutationKey: ["create-category"],
        mutationFn: addCategoryAPI,
    });

    const formik = useFormik({
        initialValues: {
            categoryName: "",
        },
        validationSchema: Yup.object({
            categoryName: Yup.string().required("*Field is required"),
        }),
        onSubmit: (values) => {
            categoryMutation.mutate(values);
        },
    });

    const { isPending, isError, isSuccess } = categoryMutation;

    return (
        <div className="flex flex-wrap mt-16">
            <div className="w-full  p-4">
                <div className="flex flex-col justify-center max-w-md mx-auto h-full py-12">
                    <form onSubmit={(e)=>e.preventDefault()}>
                    {/* <form onSubmit={formik.handleSubmit}> */}
                        <h1 className="text-3xl font-bold font-heading mb-4">
                            Add Category
                        </h1>

                        {isPending && (
                            <AlertMessage type="loading" message="Loading please wait" />
                        )}
                        {isSuccess && (
                            <AlertMessage type="success" message="Category created successfully" />
                        )}
                        {isError && (
                            <AlertMessage type="error" message={categoryMutation?.error?.response?.data?.message} />
                        )}

                        <input
                            type="text"
                            {...formik.getFieldProps("categoryName")}
                            className="w-full rounded-full p-4 outline-none border border-gray-100  shadow placeholder-gray-500 focus:ring focus:ring-orange-200 transition duration-200 mb-4"
                            placeholder="Category Name"
                        />
                        {formik.touched.categoryName && formik.errors.categoryName && (
                            <div className="text-red-500 mb-4 mt-1">
                                {formik.errors.categoryName}
                            </div>
                        )}

                        <h2 className="text-xs mb-1 text-center text-red-500">Add Category button has temporarily been disabled for safety reasons!</h2>
                        <button
                            className="h-14 inline-flex items-center justify-center py-4 px-6 text-white font-bold font-heading rounded-full bg-orange-500 w-full text-center border border-orange-600 shadow hover:bg-orange-600 focus:ring focus:ring-orange-200 transition duration-200 mb-8"
                            type="submit"
                        >
                            Add Category
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;