import { NavLink } from "react-router-dom";
import { FaBlog } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Footer() {

    const handleScroll = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const { userAuth } = useSelector(state => state.auth);

    return (
        <div className="px-32 bg-white text-gray-500 border-t">
            <div className="py-6 flex justify-center gap-8 flex-wrap">
                <NavLink to='/'
                    onClick={handleScroll}
                    className="hover:underline hover:text-orange-900">
                    Home
                </NavLink>

                <NavLink to='/posts'
                    onClick={handleScroll}
                    className="hover:underline hover:text-orange-900">
                    Latest Posts
                </NavLink>

                <NavLink to='/ranking'
                    onClick={handleScroll}
                    className="hover:underline hover:text-orange-900">
                    Ranking
                </NavLink>

                {!userAuth?.isAuthenticated && (
                    <>
                        <NavLink to='/pricing'
                            onClick={handleScroll}
                            className="hover:underline hover:text-orange-900">
                            Pricing
                        </NavLink>
                        <NavLink to='/register'
                            onClick={handleScroll}
                            className="hover:underline hover:text-orange-900">
                            Register
                        </NavLink>
                        <NavLink to='/login'
                            onClick={handleScroll}
                            className="hover:underline hover:text-orange-900">
                            Login
                        </NavLink>
                    </>
                )}
            </div>
            <div className="flex justify-center gap-8 pb-8 pt-4">
                <span><FaBlog className="h-8 w-auto text-orange-500" /></span>
                <span>Bondify &copy; 2024-25</span>
            </div>
        </div>
    )
}