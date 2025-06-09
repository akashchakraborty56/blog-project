import type { Blog } from "../hooks/index.tsx";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog, name }: { blog: Blog; name: string }) => {
  // Format date nicely
//   const formattedDate = new Date(blog.createdAt || new Date()).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
    //   });
    const formattedDate =  new Date().toDateString();

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Appbar name={name || ""} />
      
      <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Blog Content */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900">
                {blog.title}
              </h1>
              <div className="flex items-center mt-4 space-x-2 text-sm text-gray-500">
                <span>{formattedDate|| new Date().toDateString()}</span>
                <span>•</span>
                <span>{Math.ceil(blog.content?.length / 1000)} min read</span>
              </div>
            </div>

            <article className="prose prose-lg max-w-none text-gray-700">
              <div className="border-t border-gray-200 pt-6">
                {blog.content}
              </div>
            </article>
          </div>

          {/* Author Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Author</h2>
              <div className="flex items-start space-x-4">
                <Avatar size="big" name={blog.author.name || "Anonymous"} />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {blog.author.name || "Anonymous"}
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {"Writer specializing in engaging content that captivates readers."}
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Follow
                    </button>
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-500">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Articles Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">More from this author</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                      <a href="#">Related article title {item}</a>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">2 days ago • 5 min read</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};