import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useQuery, useQueryClient } from 'react-query';
=======
import { useQuery, useQueryClient, useMutation } from 'react-query';
import axios from 'axios';
>>>>>>> main

import { PostDetail } from './PostDetail';
import useInput from './useInput.jsx';
const maxPostPage = 10;

async function fetchPosts(pageNum) {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
	);
	return response.json();
}
<<<<<<< HEAD

=======
async function updateItem(itemId, itemName, itemPrice) {
	const response = await axios.post('http://localhost:3001/data', {
		id: itemId,
		name: itemName,
		price: itemPrice,
	});
	return response.data;
}
>>>>>>> main
export function Posts() {
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedPost, setSelectedPost] = useState(null);

<<<<<<< HEAD
	const queryClient = useQueryClient();
=======
	const itemId = useInput();
	const itemName = useInput();
	const itemPrice = useInput();

	const queryClient = useQueryClient();
	const updateItemMutation = useMutation(() =>
		updateItem(itemId.value, itemName.value, itemPrice.value)
	);
>>>>>>> main

	const { data, isError, error, isLoading, isFetching } = useQuery(
		['posts', currentPage],
		() => fetchPosts(currentPage),
		{
			staleTime: 10000,
			// cacheTime: 2000,
			keepPreviousData: true,
		}
	);

	useEffect(() => {
		if (currentPage < maxPostPage) {
			const nextPage = currentPage + 1;
			queryClient.prefetchQuery(['posts', nextPage], () =>
				fetchPosts(nextPage)
			);
		}
		if (1 < currentPage) {
			const priviousPage = currentPage - 1;
			queryClient.prefetchQuery(['posts', priviousPage], () =>
				fetchPosts(priviousPage)
			);
		}
	}, [currentPage, queryClient]);

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
<<<<<<< HEAD
=======
			<div>
				<ul style={{ listStyle: 'none' }}>
					<li>
						<label>id : </label>
						<input onChange={itemId.onChange} type="number"></input>
						<p>{itemId.value}</p>
					</li>
					<li>
						<label>name : </label>
						<input onChange={itemName.onChange} type="text"></input>
						<p> {itemName.value}</p>
					</li>
					<li>
						<label>price : </label>
						<input onChange={itemPrice.onChange} type="number"></input>
						<p></p>
						{itemPrice.value}
					</li>
				</ul>
				<button
					onClick={() =>
						updateItemMutation.mutate(
							itemId.value,
							itemName.value,
							itemPrice.value
						)
					}
				>
					전송
				</button>
			</div>
			{updateItemMutation.isError && (
				<p style={{ color: 'red' }}>Error updating the post</p>
			)}
			{updateItemMutation.isLoading && (
				<p style={{ color: 'purple' }}>updating the post</p>
			)}
			{updateItemMutation.isSuccess && (
				<p style={{ color: 'green' }}>Post has been updated</p>
			)}

>>>>>>> main
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
