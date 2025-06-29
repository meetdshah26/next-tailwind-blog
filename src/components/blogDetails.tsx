'use client';
//  Example of a blog detail page using client-side rendering 

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://api.example.com/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError('Failed to load the post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div> {/* Add a spinner */}
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
    </div>
  );
};

export default BlogDetailPage;
