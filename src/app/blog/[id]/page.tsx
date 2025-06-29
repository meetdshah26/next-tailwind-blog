import React from "react";
let url = "https://dummyjson.com/posts";
import { notFound } from "next/navigation";
import BackButton from "../../../components/BackButton";

const BlogDetailPage = async ({ params }: { params: { id: string } }) => {
  try {
    const { id } = await params;
    const res = await fetch(`${url}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch data");

    const post = await res.json();

    return (
      <div className="bg-green-200 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Blog Details for Post ID: <span className="text-blue-600">{id}</span>
        </h1>
        <h3 className="text-2xl font-bold text-white bg-blue-500 inline-block px-4 py-2 rounded-lg">
          {post.title}
        </h3>
        <p className="pt-4 text-gray-700">{post.body}</p>
        <div className="space-y-2 mt-4 text-sm text-gray-800">
          <p>
            <strong>Tags:</strong>{" "}
            {post.tags ? post.tags.join(", ") : "No tags available"}
          </p>
          <p>
            <strong>Reactions:</strong>{" "}
            {post.reactions ? post.reactions.likes : "0"} likes
          </p>
          <p>
            <strong>Views:</strong> {post.views || 0} views
          </p>
        </div>
        <BackButton />
      </div>
    );
  } catch (error) {
    console.error("Error fetching post:", error);
    notFound();
  }
};

export default BlogDetailPage;

// type Post = {
//   title: string;
//   content: string;
// };

// const BlogDetailPage = ({ post }: { post: Post }) => {
//   const { id } = useParams();

//   return (
//     <div>
//       <h1>Blog Details for Post ID: {id}</h1>
//       <h1>{post.title}</h1>
//       <p>{post.content}</p>
//     </div>
//   );
// };

// export async function getServerSideProps(context: { params: { id: any } }) {
//   const { id } = context.params;

//   const res = await fetch(`${url}/${id}`);
//   const post = await res.json();

//   return {
//     props: {
//       post,
//     },
//   };
// }
