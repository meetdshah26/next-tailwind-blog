// app/blog/[id]/page.tsx
import { notFound } from "next/navigation";
import { BASE_URL } from "@/utils/constants";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;

    const res = await fetch(`${BASE_URL}/${id}`, {
      cache: "no-store", // to fetch fresh data
    });

    if (!res.ok) throw new Error("Failed to fetch data");

    // const post: BlogPost = await res.json();
    const post = await res.json();

    return (
      <div className="min-h-screen bg-green-50 py-10 px-6 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Blog Details for Post ID:{" "}
            <span className="text-blue-600">{post.id}</span>
          </h1>

          <h2 className="text-3xl font-bold text-blue-700 mb-4">
            {post.title}
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">{post.body}</p>

          <div className="space-y-2 text-sm text-gray-800 border-t pt-4">
            <p>
              <strong>Tags:</strong>{" "}
              {post.tags?.length ? post.tags.join(", ") : "No tags available"}
            </p>
            <p>
              <strong>Reactions:</strong> {post.reactions?.likes ?? 0} likes
            </p>
            <p>
              <strong>Views:</strong> {post.views ?? 0} views
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
}
