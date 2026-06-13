'use client';

import { useEffect, useState } from 'react';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
   
  }, []);

    const updateBlogStatus = async (
        id: string,
        status: 'Published' | 'Rejected'
        ) => {
        try {
            const res = await fetch(
            `/api/admin/blogs/${id}`,
            {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                status
                })
            }
            );

            const data = await res.json();

            if (data.success) {
            fetchBlogs();
            }

        } catch (error) {
            console.error(error);
        }
        };

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-white mb-2">
        Blog Management
      </h1>

      <p className="text-gray-400 mb-8">
        Approve or reject submitted blogs.
      </p>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>

            <tr className="border-b border-white/10">
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Author</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
            </tr>
            
          </thead>

          <tbody>
            {blogs.map((blog: any) => (
              <tr
                key={blog._id}
                className="border-b border-white/5"
              >
                <td className="p-4 text-white">
                  {blog.title}
                </td>

                <td className="p-4 text-gray-300">
                    {blog.author?.name}
                </td>

                <td className="p-4">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold
                        ${
                            blog.status === 'Published'
                            ? 'bg-green-500/20 text-green-400'
                            : blog.status === 'Rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-orange-500/20 text-orange-400'
                        }
                        `}
                    >
                        {blog.status}
                    </span>
                    </td>

                <td className="p-4 flex gap-2">
                    <button
                        onClick={() =>
                        updateBlogStatus(
                            blog._id,
                            'Published'
                        )
                        }
                        className="px-3 py-1 bg-green-600 rounded text-white"
                    >
                        Approve
                    </button>

                    <button
                        onClick={() =>
                        updateBlogStatus(
                            blog._id,
                            'Rejected'
                        )
                        }
                        className="px-3 py-1 bg-red-600 rounded text-white"
                    >
                        Reject
                    </button>

                    <button
                        onClick={() => setSelectedBlog(blog)}
                        className="px-3 py-1
                        bg-blue-600 rounded text-white"
                    >
                        View
                    </button>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && blogs.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No Blogs Found
          </div>
        )}
      </div>

        {selectedBlog && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="w-full max-w-3xl bg-[#111827] rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                    Blog Preview
                    </h2>

                    <button
                    onClick={() => setSelectedBlog(null)}
                    className="text-white text-xl"
                    >
                    ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                    <p className="text-gray-400 text-sm">Title</p>
                    <h3 className="text-white text-xl font-bold">
                        {selectedBlog.title}
                    </h3>
                    </div>

                    <div>
                    <p className="text-gray-400 text-sm">Author</p>
                    <p className="text-white">
                        {selectedBlog.author?.name}
                    </p>
                    </div>

                    <div>
                    <p className="text-gray-400 text-sm">Category</p>
                    <p className="text-white">
                        {selectedBlog.category}
                    </p>
                    </div>

                    <div>
                    <p className="text-gray-400 text-sm">Content</p>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-gray-300 whitespace-pre-wrap">
                        {selectedBlog.content}
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => {
                            updateBlogStatus(
                                selectedBlog._id,
                                'Published'
                            );
                            setSelectedBlog(null);
                            }}
                            className="px-4 py-2 bg-green-600 rounded-lg text-white"
                        >
                            Approve
                        </button>

                        <button
                            onClick={() => {
                            updateBlogStatus(
                                selectedBlog._id,
                                'Rejected'
                            );
                            setSelectedBlog(null);
                            }}
                            className="px-4 py-2 bg-red-600 rounded-lg text-white"
                        >
                            Reject
                        </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            )}



    </div>
  );
}