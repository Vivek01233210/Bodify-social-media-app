import Features from "./Features";
import CallToAction from "./CallToAction";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {

  const { userAuth } = useSelector(state => state.auth);

  return (
    <section className="overflow-hidden mt-16">
      <div className="hidden navbar-menu fixed top-0 left-0 bottom-0 w-4/6 sm:max-w-xs z-30">
        <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-80" />
      </div>
      <div className="container px-4 mx-auto relative">
        <div className="relative z-20">
          <h1 className="text-center text-5xl lg:text-7xl font-bold font-heading mb-6 mt-14 max-w-2xl mx-auto">
            <span>Build Bonds Through </span>
            <span className="block text-orange-600 text-4xl lg:text-6xl">&ldquo;Code and Community&rdquo;</span>
          </h1>
          <p className="text-center text-lg mb-10 max-w-lg mx-auto">
            Bondify is a social media platform for coding enthusiasts to share and discover posts about programming. Connect with like-minded developers, showcase projects.
          </p>
          {!userAuth &&
            <div className="flex justify-center lg:pb-56">
              <Link
                to="/register"
                className="w-full sm:w-auto h-16 inline-flex items-center justify-center text-center py-4 px-6 rounded-full bg-orange-600 border border-orange-700 shadow font-bold font-heading text-white hover:bg-orange-800 focus:ring focus:ring-blue-200 transition duration-200"
              >
                Get Started
              </Link>
            </div>
          }
        </div>
      </div>

      {/* Features */}
      <Features />
      {/* Call to action */}
      <CallToAction />
    </section>
  )
}

export default HomePage