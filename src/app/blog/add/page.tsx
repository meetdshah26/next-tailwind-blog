"use client";
import React, { useState, useRef, FormEvent } from "react";
import { BASE_URL } from "@/utils/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BlogSchemaType, blogSchema } from "@/utils/blogSchema";

type BlogResponseType = {
  id?: string;
  title: string;
  userId: string;
  body: string;
  tags: string;
};

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [receivedData, setReceivedData] = useState<BlogResponseType | null>(
    null
  );
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BlogSchemaType, string>>
  >({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData) as Record<string, string>;

    const parsed = blogSchema.safeParse(rawData);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof BlogSchemaType, string>> = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof BlogSchemaType;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const data = await response.json();

      if (response.ok) {
        setReceivedData(data);
        toast.success("Blog added successfully!");

        if (formRef.current) formRef.current.reset(); // Clear form fields using the form reference

        setTimeout(() => {
          setReceivedData(null);
        }, 7000);
      } else {
        toast.error("Error adding blog. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
            Add Blog
          </h2>
          <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700"
              >
                User ID
              </label>
              <input
                type="text"
                name="userId"
                id="userId"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.userId && (
                <p className="text-sm text-red-600 mt-1">{errors.userId}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700"
              >
                Body
              </label>
              <input
                type="text"
                name="body"
                id="body"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.body && (
                <p className="text-sm text-red-600 mt-1">{errors.body}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                Tags
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.tags && (
                <p className="text-sm text-red-600 mt-1">{errors.tags}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>

          {receivedData && (
            <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium text-blue-700">
                Received Data:
              </h3>
              <pre className="text-sm text-gray-800 mt-2">
                {JSON.stringify(receivedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={4000} />
      </div>
    </>
  );
}
