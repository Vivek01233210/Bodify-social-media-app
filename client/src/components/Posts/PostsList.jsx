import { useQuery } from "@tanstack/react-query";
import { getAllPostAPI } from "../../APIServices/postsAPI";
import './postCss.css';
import { Link } from "react-router-dom";
import NoDataFound from "../Alert/NoDataFound";
import AlertMessage from "../Alert/AlertMessage";
import PostCategory from "../Category/PostCategory";
import { getCategoriesAPI } from "../../APIServices/categoryAPI";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import { truncateString } from "../../utils/truncateString";
import { timeAgo } from "../../utils/dateFormatter.js";
import { LuDot } from "react-icons/lu";

const PostsList = () => {
  //filtering state
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // GET post
  const { isError, isLoading, data, refetch } = useQuery({
    queryKey: ["lists-posts", { ...filters, page }],
    queryFn: () =>
      getAllPostAPI({ ...filters, title: searchTerm, page, limit: 6 }),
  });

  // Category filter handler
  const handleCategoryFilter = (categoryId) => {
    setFilters(prevState => ({ ...prevState, category: categoryId }));
    setPage(1);
    refetch();
  }

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setPage(1);
    refetch();
  }

  // GET categories
  const { data: categories } = useQuery({
    queryKey: ["category-lists"],
    queryFn: getCategoriesAPI,
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prevState => ({ ...prevState, title: searchTerm }));
    setPage(1);
    refetch();
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  }

  return (
    <section className="overflow-hidden mt-16">
      <div className="container px-4 mx-auto">

        <h2 className="text-4xl font-bold font-heading my-5">
          Latest articles
        </h2>
        {/* Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-center gap-2 mb-4"
        >
          <div className="flex-grow flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-grow p-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 text-white bg-orange-500 hover:bg-blue-600 rounded-r-lg"
            >
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={clearFilters}
            className="p-2 text-sm text-orange-500 border border-blue-500 rounded-lg hover:bg-blue-100 flex items-center gap-1"
          >
            <MdClear className="h-4 w-4" />
            Clear Filters
          </button>
        </form>

        {/* Post category */}
        <PostCategory
          categories={categories}
          onCategorySelect={handleCategoryFilter}
          onClearFilters={clearFilters}
        />

        {data?.posts?.length <= 0 && <NoDataFound text='No Post yet!' />}

        {isLoading && <AlertMessage type='loading' message='Loading...' />}

        {isError && <AlertMessage type='error' message='Some error occurred!' />}

        {/* Posts Items */}
        <div className="flex flex-wrap mb-32 -mx-4">
          {data?.posts?.map((post) => (
            <div key={post._id} className="w-full md:w-1/2 lg:w-1/3 p-4">
              <Link
                to={`/posts/${post._id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="bg-white border border-gray-100 hover:border-orange-500 transition duration-200 rounded-2xl h-full p-3">
                  <div style={{ height: 240 }}>
                    <img
                      className="w-full h-full object-cover rounded-2xl"
                      src={post?.image?.path}
                      alt={post?.image?.description || "post  image"}
                    />
                  </div>
                  <div className="pb-3 px-2">
                    <div
                      className="rendered-html-content mb-2"
                      dangerouslySetInnerHTML={{
                        __html: truncateString(post?.description, 200),
                      }}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <img src={post?.author?.profilePicture?.path} alt="user-pic" className="w-8 h-8 rounded-full" />
                      <div className="-ml-2">
                        <p className="text-sm">{post?.author?.username}</p>
                        <p className="text-gray-500 text-xs flex items-center -mt-1">
                          <span> {timeAgo(post.createdAt)}</span>
                          <LuDot className="text-gray-500 mt-1/3" />
                        </p>
                      </div>
                      <div className="py-1 px-2 rounded-md border border-gray-100 text-xs font-medium text-gray-700 inline-block">
                        {post?.category?.categoryName}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center my-8 space-x-4">
        {data?.totalPages > 1 && (
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              handlePageChange(page - 1)
            }}
            disabled={page <= 1}
            className={`px-4 py-2 text-sm font-medium text-white rounded ${page <= 1 ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"}`}
          >
            Previous
          </button>
        )}
        <span className="text-sm font-semibold">
          Page {page} of {data?.totalPages}
        </span>
        {data?.totalPages > 1 && (
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              handlePageChange(page + 1)
            }}
            disabled={page >= data?.totalPages}
            className={`px-4 py-2 text-sm font-medium text-white rounded ${page >= data?.totalPages ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"}`}
          >
            Next
          </button>
        )}
      </div>
    </section>
  )
}

export default PostsList;