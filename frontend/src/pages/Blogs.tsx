import { Appbar } from "../components/Appbar.tsx";
import { BlogCard } from "../components/BlogCard.tsx";
import { BlogSkeleton } from "../components/BlogSkeleton.tsx";
import { useBlogs } from "../hooks/index.tsx";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export const Blogs = () => {
    const { loading, blogs } = useBlogs();
    const [name, setName] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                if (decodedToken?.name) {
                    setName(decodedToken.name);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Appbar name={name || ""} />
                <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar name={name} />
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {blogs && blogs.length > 0 ? (
                    <div className="space-y-6">
                        {blogs.map((blog: any) => (
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                authorName={blog.author.name || "Anonymous"}
                                title={blog.title}
                                content={blog.content}
                                publishedDate={new Date(blog.createdAt || new Date()).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg font-medium">
                            No blogs available yet
                        </div>
                        <p className="mt-2 text-gray-400">
                            Be the first to create one!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};