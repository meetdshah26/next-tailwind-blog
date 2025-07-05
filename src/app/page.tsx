import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold underline mb-6">Welcome!</h1>

      <Link
        href="/tag-list"
        className="text-blue-500 hover:underline font-medium mr-4"
      >
        <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition">
          Go to Tag List
        </button>
      </Link>

      <Link href="/blog">
        <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition">
          Go to Blog List
        </button>
      </Link>
    </div>
  );
}
