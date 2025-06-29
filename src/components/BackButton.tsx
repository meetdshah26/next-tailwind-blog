"use client";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="bg-gray-500 text-white px-4 py-2 mt-6 rounded-lg hover:bg-gray-700 transition duration-300 mb-4"
    >
      Back
    </button>
  );
};

export default BackButton;
