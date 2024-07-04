// not found page
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen mt-16">
            <h1 className="text-9xl font-bold text-gray-800">404</h1>
            <h2 className="text-2xl font-semibold text-gray-600 mb-6">Page Not Found</h2>
            <Link to="/" className="text-orange-600 hover:underline">
                Go back to Home
            </Link>
        </div>
    )
}

export default NotFound;