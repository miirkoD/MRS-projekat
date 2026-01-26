'use client';
import React, { useEffect, useRef, useState } from 'react';

interface Post {
  id: number;
  title: string;
}
const BASE_URL = 'https://jsonplaceholder.typicode.com';

const Page = () => {
  const [error, setError] = useState<unknown | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    const fetchPosts = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/posts?page=${page}`, {
          signal: abortControllerRef.current?.signal,
        });
        const posts = (await response.json()) as Post[];
        setPosts(posts);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name == 'AbortError') {
          console.log('Aborted');
          return;
        }
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  if (error) {
    return <div>errrrrrr...</div>;
  }
  return (
    <div>
      <h1 className="mb-4 text-2xl">data fetching</h1>
      <button onClick={() => setPage(page + 1)}>increase page ({page})</button>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <ul>
          {posts.map((post) => {
            return (
              <li className="text-white" key={post.id}>
                {post.title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Page;
