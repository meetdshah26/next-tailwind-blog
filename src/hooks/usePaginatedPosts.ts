// hooks/usePaginatedPosts.ts
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface Post {
  id: number;
  title: string;
  body: string;
  tags?: string[];
  reactions?: { likes: number; dislikes: number };
  views?: number;
  userId?: number;
}

interface UsePaginatedPostsOptions {
  baseUrl: string;
  queryPath?: string;
  tag?: string;
  limit?: number;
  filterKey?: keyof Post;
  isSearchLocal?: boolean;
  isSortLocal?: boolean;
}

export const usePaginatedPosts = ({
  baseUrl,
  queryPath = "",
  tag,
  limit = 10,
  filterKey = "title",
  isSearchLocal = true,
  isSortLocal = true,
}: UsePaginatedPostsOptions) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";
  const query = searchParams.get("q") || "";
  const skip = (page - 1) * limit;

  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let url = `${baseUrl}${queryPath}?limit=${limit}&skip=${skip}`;
        const res = await fetch(url);
        const data = await res.json();
        let fetchedPosts = data.posts || [];

        // Optional client-side filtering
        if (isSearchLocal && query) {
          fetchedPosts = fetchedPosts.filter((post: Post) =>
            (post[filterKey] as string)
              ?.toLowerCase()
              .includes(query.toLowerCase())
          );
        }

        // Optional client-side sorting
        // if (isSortLocal && sortBy) {
        //   fetchedPosts.sort((a, b) => {
        //     const valA = a[sortBy as keyof Post];
        //     const valB = b[sortBy as keyof Post];

        //     if (typeof valA === "string" && typeof valB === "string") {
        //       return order === "asc"
        //         ? valA.localeCompare(valB)
        //         : valB.localeCompare(valA);
        //     } else if (typeof valA === "number" && typeof valB === "number") {
        //       return order === "asc" ? valA - valB : valB - valA;
        //     } else {
        //       return 0;
        //     }
        //   });
        // }

        setPosts(fetchedPosts);
        setTotal(data.total || fetchedPosts.length);
      } catch (err) {
        console.error("Error loading posts", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, sortBy, order, query, tag]);

  const updateParams = (params: Partial<Record<string, string>>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) =>
      value ? newParams.set(key, value) : newParams.delete(key)
    );
    router.push(`?${newParams.toString()}`);
  };

  return {
    posts,
    loading,
    total,
    page,
    sortBy,
    order,
    query,
    totalPages: Math.ceil(total / limit),
    updateParams,
  };
};
