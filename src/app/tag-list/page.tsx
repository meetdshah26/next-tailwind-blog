"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tag = {
  slug: string;
  name: string;
  url: string;
};
export default function TagListPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("https://dummyjson.com/posts/tags");
        if (!res.ok) throw new Error("Failed to fetch tags");

        const tags: Tag[] = await res.json();
        setTags(tags || []);
        // console.log("tags", tags);
      } catch (err) {
        console.error(err);
        setError("Could not load tags. Please try again later.");
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
        <div className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
            <p className="text-gray-600">Loading tags...</p>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : Array.isArray(tags) && tags.length === 0 ? (
        <p className="text-gray-800 text-center">No tags found.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, i) => (
            <Link
              key={i}
              href={`/tag/${encodeURIComponent(tag.slug)}`}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm transition"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
