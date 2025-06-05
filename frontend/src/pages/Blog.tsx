import { useState, useEffect } from 'react';
import axios from 'axios';

interface Blog {
  id: string;
  title: string;
  content: string;
}

function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8787/api/v1/blog', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8787/api/v1/blog', newBlog, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewBlog({ title: '', content: '' });
      fetchBlogs();
    } catch (error) {
      console.error('Failed to create blog:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New Blog</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Content</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Create Blog
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
            <p className="text-gray-600">{blog.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;