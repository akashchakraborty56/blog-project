import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
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

    const handlePublish = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        if (!description.trim()) {
            setError("Content is required");
            return;
        }

        setIsPublishing(true);
        setError("");
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                title: title,
                content: description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate(`/blog/${response.data.blog.id}`);
        } catch (err) {
            setError("Failed to publish post. Please try again.");
            console.error("Publishing error:", err);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar name={name || ""} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Create a new post</h1>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Your post title"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <TextEditor 
                            onChange={(e) => setDescription(e.target.value)} 
                            value={description}
                        />
                    </div>

                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isPublishing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isPublishing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publishing...
                            </>
                        ) : 'Publish Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

function TextEditor({ onChange, value }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, value: string }) {
    return (
        <div className="mt-1">
            <div className="w-full">
                <textarea
                    id="content"
                    value={value}
                    onChange={onChange}
                    rows={12}
                    className="block w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your post content here..."
                />
            </div>
            <p className="mt-1 text-sm text-gray-500">
                Markdown is supported
            </p>
        </div>
    );
}