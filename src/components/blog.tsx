"use client";
import React, { useEffect, useState } from "react";
import { Edit, MessageCircle, ThumbsUp } from "lucide-react";
import dataFromFile from "../data/posts.json";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import { useDebouncedCallback } from "use-debounce";
import { BASE_URL } from "@/utils/constants";

const LIMIT = 10;
// Todo Example of CSR

type BlogPost = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  userId: number;
  reactions?: {
    likes: number;
    dislikes: number;
  };
  views?: number;
};

const Blog = () => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [visibleComments, setVisibleComments] = useState<{
    [postId: number]: boolean;
  }>({});
  const [comments, setComments] = useState<{ [postId: number]: any[] }>({});
  const [commentLoading, setCommentLoading] = useState<{
    [postId: number]: boolean;
  }>({});

  const toggleComments = async (postId: number) => {
    const isVisible = visibleComments[postId]; // Get current state of comment
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !isVisible,
    })); // Toggle visibility

    if (!isVisible && !comments[postId]) {
      setCommentLoading((prev) => ({ ...prev, [postId]: true }));

      try {
        const res = await fetch(`${BASE_URL}/${postId}/comments`);
        const data = await res.json();

        setComments((prev) => ({
          ...prev,
          [postId]: data.comments || [],
        }));
      } catch (err) {
        console.error("Failed to load comments", err);
      } finally {
        setCommentLoading((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const sortBy = searchParams.get("sortBy") || "";
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
          // setPosts(data.posts);
          setFilteredPosts(data.posts);
          setTotal(data.total ?? 0);
        } else {
          // setPosts([]);
          setFilteredPosts([]);
          setTotal(0);
        }
      })
      .catch(() => {
        // setPosts(dataFromFile);
        setFilteredPosts(dataFromFile);
        setTotal(dataFromFile.length);
      })
      .finally(() => setLoading(false));
  }, [page, sortBy, order, query]);

  const debouncedSearch = useDebouncedCallback((q: string) => {
    router.push(`?page=1&q=${q}&sortBy=${sortBy}&order=${order}`);
  }, 300); // 300ms debounce delay

  const handleSearch = (q: string) => {
    debouncedSearch(q);
  };

  const totalPages = total ? Math.ceil(total / LIMIT) : 1;

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
          <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            </div>
          </div>
        )}
        {filteredPosts.length === 0 && !loading && (
          <p className="text-center text-xl text-gray-600">No posts found</p>
        )}

        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/blog/${post.id}`} className="block">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-300">
                {post.userId}
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-500 transition-colors duration-300">
                {post.title}
              </h3>
              <p className="pt-2 text-gray-700 text-base">{post.body}</p>
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

            <div className="flex gap-4 mt-4">
              <Link
                href={`/blog/edit/${post.id}`}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:cursor-pointer font-medium transition"
              >
                <Edit size={18} />
                Edit
              </Link>
              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:cursor-pointer font-medium transition"
              >
                <MessageCircle size={18} />
                {visibleComments[post.id] ? "Hide Comments" : "Show Comments"}
              </button>
            </div>

            {visibleComments[post.id] && (
              <div className="mt-4 border-t pt-3 space-y-3">
                {commentLoading[post.id] ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full"></div>
                    Loading comments...
                  </div>
                ) : comments[post.id]?.length ? (
                  comments[post.id].map((comment: any) => (
                    <div
                      key={comment.id}
                      className="text-sm text-gray-700 bg-gray-100 p-2 rounded"
                    >
                      <p className="font-semibold text-gray-900">
                        {comment.user?.fullName || "User"}
                      </p>
                      <p>{comment.body}</p>
                       <p className="flex items-center gap-1">
                        <ThumbsUp size={16} />
                        {comment.likes}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No comments found.</p>
                )}
              </div>
            )}
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
