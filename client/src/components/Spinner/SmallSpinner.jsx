
// classes = "w-3 h-3 border-4 border-gray-500"
export default function SmallSpinner({ classes }) {
    return (
        <div
            className={`${classes} inline-block animate-spin rounded-full border-solid border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]`}
            role="status">
            <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span
            >
        </div>
    )
}