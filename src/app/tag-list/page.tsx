"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TagListPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("https://dummyjson.com/posts/tag-list");
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data = await res.json();
        // console.log("data: ", data);

        setTags(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-950">Tags</h1>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading tags...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm transition"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
