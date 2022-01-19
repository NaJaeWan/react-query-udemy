import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { PostDetail } from './PostDetail';
import useInput from './useInput.jsx';
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}
export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  const { data, isError, error, isLoading, isFetching } = useQuery(
    ['posts', currentPage],
    () => fetchPosts(currentPage),
    {
      // staleTime: 5000,
      // cacheTime: 2000,
      keepPreviousData: true,
    }
  );

  // useEffect(() => {
  //   if (currentPage < maxPostPage) {
  //     const nextPage = currentPage + 1;
  //     queryClient.prefetchQuery(['posts', nextPage], () =>
  //       fetchPosts(nextPage)
  //     );
  //   }
  //   if (1 < currentPage) {
  //     const priviousPage = currentPage - 1;
  //     queryClient.prefetchQuery(['posts', priviousPage], () =>
  //       fetchPosts(priviousPage)
  //     );
  //   }
  // }, [currentPage, queryClient]);

  if (isFetching) {
    return <h3>loading...</h3>;
  }
  if (isError) {
    return (
      <>
        <h3>Ooops, something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={maxPostPage <= currentPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
