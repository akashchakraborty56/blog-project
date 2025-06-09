import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";


export interface Blog {
    "content": string;
    "title": string;
    "id": number
    "author": {
        "name": string
    }
}

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization:`Bearer ${token}`
            }
        })
            .then(response => {
                setBlog(response.data.blog);
                setLoading(false);
            })
    }, [id])

    return {
        loading,
        blog
    }

}
export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

   useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        setLoading(false);
        return;
    }

    axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        console.log("Raw API response:", response.data);
        // Defensive fix
        const blogsData = response.data.blogs;
        if (Array.isArray(blogsData)) {
            setBlogs(blogsData);
        } else {
            console.error("Expected an array but got:",  blogsData);
            setBlogs([]); // fallback to empty array
        }
        setLoading(false);
    })
    .catch(err => {
        console.error("API error:", err);
        setBlogs([]); // fallback on error
        setLoading(false);
    });
}, []);

    return {
        loading,
        blogs
    }
}