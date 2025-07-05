"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function TagDetailPage() {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`https://dummyjson.com/posts/tag/${tag}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch posts for tag "${tag}"`);
        }

        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (tag) {
      fetchPosts();
    }
  }, [tag]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 text-center font-semibold">
        Error: {error}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="p-8 text-gray-600 text-center">
        No posts found for tag "
        <span className="font-medium text-black">{tag}</span>".
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Tags */}
        <Link
          href="/tag-list"
          className="inline-block mb-6 text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          ← Back to Tags
        </Link>

        {/* Page Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 border-b pb-2">
          Posts tagged with <span className="text-indigo-600">{tag}</span>
        </h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{post.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
