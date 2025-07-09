"use client";

import { usePaginatedPosts } from "../../../hooks/usePaginatedPosts";
import SearchBar from "../../../components/SearchBar";
import { useDebouncedCallback } from "use-debounce";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TagDetailPage() {
  const params = useParams();
  const tag = params?.tag as string;

  const {
    posts,
    page,
    query,
    sortBy,
    order,
    totalPages,
    loading,
    updateParams,
  } = usePaginatedPosts({
    baseUrl: `https://dummyjson.com/posts/tag/${tag}`,
    limit: 10,
    isSearchLocal: true,
    isSortLocal: true,
  });

  const handleSearch = useDebouncedCallback((q: string) => {
    updateParams({ page: "1", q });
  }, 300);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Posts tagged with <span className="text-indigo-500">{tag}</span>
      </h1>

      <SearchBar
        onSearch={handleSearch}
        initialQuery={query}
        loading={loading}
      />

      {/* Sort Dropdown */}
      <div className="flex justify-end mb-4">
        <label htmlFor="sort" className="sr-only">Sort posts</label>
        <select
          className="border px-4 py-2 rounded"
          value={`${sortBy}:${order}`}
          onChange={(e) => {
            const [sb, o] = e.target.value.split(":");
            updateParams({ page: "1", sortBy: sb, order: o });
          }}
        >
          <option value="title:asc">Title A-Z</option>
          <option value="title:desc">Title Z-A</option>
          <option value="userId:asc">User ID ↑</option>
          <option value="userId:desc">User ID ↓</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="block bg-white p-4 mb-4 rounded shadow hover:bg-gray-100 transition">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.body}</p>
          </Link>
        ))
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => updateParams({ page: String(page - 1) })}
          disabled={page <= 1}
          className={`px-4 py-2 rounded bg-indigo-500 text-white ${
            page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => updateParams({ page: String(page + 1) })}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded bg-indigo-500 text-white ${
            page >= totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
