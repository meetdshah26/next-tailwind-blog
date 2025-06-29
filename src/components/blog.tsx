"use client";
import React, { useEffect, useState } from "react";
import dataFromFile from "../data/posts.json";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; // ✅
import SearchBar from "../components/SearchBar";
import { useDebouncedCallback } from "use-debounce";

let BASE_URL = "https://dummyjson.com/posts";
const LIMIT = 10;
// Todo Example of CSR

// after search pagination not working
//  in first page next come on the place of previous

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const sortBy = searchParams.get("sortBy") || "title";
  const order = searchParams.get("order") || "asc";
  const query = searchParams.get("q") || "";
  const skip = (page - 1) * LIMIT;

  useEffect(() => {
    setLoading(true);

    const fetchURL = query
      ? `${BASE_URL}/search?q=${query}&limit=${LIMIT}&skip=${skip}&sortBy=${sortBy}&order=${order}`
      : `${BASE_URL}?limit=${LIMIT}&skip=${skip}&sortBy=${sortBy}&order=${order}`;

    fetch(fetchURL)
      .then((response) => response.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts);
          setTotal(data.total);
          setFilteredPosts(data.posts);
        } else {
          setPosts(data);
          setFilteredPosts([]);
        }
      })
      .catch(() => {
        setPosts(dataFromFile);
      })
      .finally(() => setLoading(false));
  }, [page, sortBy, order, query]);

  const debouncedSearch = useDebouncedCallback((q: string) => {
    router.push(`?page=1&q=${q}&sortBy=${sortBy}&order=${order}`);
  }, 300); // 300ms debounce delay

  const handleSearch = (q: string) => {
    debouncedSearch(q);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <div className="p-6 bg-gray-100 rounded-lg shadow-lg space-y-6">
        <SearchBar
          onSearch={handleSearch}
          initialQuery={query}
          loading={loading}
        />

        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Blog Posts</h1>

          <select
            className="border px-4 py-2 rounded"
            value={`${sortBy}:${order}`}
            onChange={(e) => {
              const [sb, o] = e.target.value.split(":");
              router.push(`?page=1&q=${query}&sortBy=${sb}&order=${o}`);
            }}
          >
            <option value="title:asc">Title A‑Z</option>
            <option value="title:desc">Title Z‑A</option>
            <option value="reactions:asc">Fewest Reactions</option>
            <option value="reactions:desc">Most Reactions</option>
            <option value="userId:asc">User ID ↑</option>
            <option value="userId:desc">User ID ↓</option>
          </select>
        </div>

        {loading && (
          <p className="text-center text-xl text-gray-600">Loading...</p>
        )}
        {filteredPosts.length === 0 && !loading && (
          <p className="text-center text-xl text-gray-600">No posts found</p>
        )}

        {filteredPosts.map((post, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/blog/${post.id}`} className="block">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-300">
                {post.id}
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-500 transition-colors duration-300">
                {post.title}
              </h3>
              <p className="pt-2 text-gray-700 text-base">
                {post.body || post.content}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Tag:</strong>{" "}
                {post.tags ? post.tags.join(", ") : "No tags"}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Reactions:</strong>{" "}
                {post.reactions ? post.reactions.likes : 0} likes,{" "}
                {post.reactions ? post.reactions.dislikes : 0} dislikes
              </p>
              <p className="text-sm text-gray-500">
                <strong>Views:</strong> {post.views ? post.views : 0} views
              </p>
              <p className="text-sm text-gray-500">
                <strong>userId:</strong> {post.userId ? post.userId : 0}
              </p>
            </Link>
          </div>
        ))}

        <div className="mx-6 my-10 flex justify-between items-center">
          <button
            onClick={() =>
              router.push(
                `?page=${page - 1}&q=${query}&sortBy=${sortBy}&order=${order}`
              )
            }
            // in url need to add search before q
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${
              page <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page <= 1}
          >
            Previous
          </button>

          <p className="text-gray-600">
            Page {page} of {totalPages}
          </p>

          <button
            onClick={() =>
              router.push(
                `?page=${page + 1}&q=${query}&sortBy=${sortBy}&order=${order}`
              )
            }
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${
              page >= totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Blog;
