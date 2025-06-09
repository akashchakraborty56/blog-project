import { Appbar } from "../components/Appbar";
import { FullBlog } from "../components/FullBlog.tsx";
import { Spinner } from "../components/Spinner.tsx";
import { useBlog } from "../hooks/index.tsx";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export const Blog = () => {
    const { id } = useParams();
    const { loading, blog } = useBlog({
        id: id || ""
    });

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

    if (loading || !blog) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Appbar name={name || ""} />
                <div className="h-[calc(100vh-64px)] flex flex-col justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <Spinner size="lg" />
                        <p className="text-gray-600 font-medium">Loading blog post...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <FullBlog blog={blog} name={name} />
        </div>
    );
};