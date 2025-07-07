"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "@/utils/constants";

type BlogPost = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
};

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Save time loading
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`${BASE_URL}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");

        const data = await res.json();
        setPost(data);
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPost();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;
    setSaving(true);

    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      
      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to update post.");
      } else {
        toast.success("Post updated successfully!");
        router.push(`/blog/${id}`); // redirect to detail page
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {loading ? (
         <div className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-8 text-red-600 text-center font-semibold">
          Error: {error}
        </div>
      ) : !post ? null : (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Body
              </label>
              <textarea
                value={post.body}
                onChange={(e) => setPost({ ...post, body: e.target.value })}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={post.tags.join(", ")}
                onChange={(e) =>
                  setPost({
                    ...post,
                    tags: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Likes
                </label>
                <input
                  type="number"
                  value={post.reactions?.likes ?? 0}
                  onChange={(e) =>
                    setPost({
                      ...post,
                      reactions: {
                        ...post.reactions,
                        likes: parseInt(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Dislikes
                </label>
                <input
                  type="number"
                  value={post.reactions?.dislikes ?? 0}
                  onChange={(e) =>
                    setPost({
                      ...post,
                      reactions: {
                        ...post.reactions,
                        dislikes: parseInt(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed hover:cursor-pointer transition duration-200"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      )}
    </>
  );
}
