import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import axios from 'axios';

import { PostDetail } from './PostDetail';
const maxPostPage = 10;

async function fetchPosts(pageNum) {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
	);
	return response.json();
}
async function updateItem(itemId, name, price) {
	const response = await axios.post(`http://localhost:3001/data/${itemId}`, {
		id: itemId,
		name: name,
		price: price,
	});
	return response.data;
}
export function Posts() {
	const [currentPage, setCurrentPage] = useState(0);
	const [selectedPost, setSelectedPost] = useState(null);

	const [itemId, setItemId] = useState(0);
	const [name, setName] = useState('');
	const [price, setPrice] = useState(0);

	const idRef = useRef();
	const nameRef = useRef();
	const priceRef = useRef();

	const queryClient = useQueryClient();
	const updateItemMutation = useMutation((itemId) =>
		updateItem(itemId, name, price)
	);

	// replace with useQuery
	const { data, isError, error, isLoading, isFetching } = useQuery(
		['posts', currentPage],
		() => fetchPosts(currentPage),
		{
			// staleTime: 2000,
			keepPreviousData: true, // 이전 데이터를 유지하게 된다.
		}
	);

	const onChange = (e) => {
		console.log(e);
		setItemId(e.target.value);
	};

	useEffect(() => {
		if (currentPage < maxPostPage) {
			const nextPage = currentPage + 1;
			queryClient.prefetchQuery(['posts', nextPage], () =>
				fetchPosts(nextPage)
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
			<div>
				<ul style={{ listStyle: 'none' }}>
					<li>
						<label>id : </label>
						<input onChange={onChange} ref={idRef} type="number"></input>
					</li>
					<li>
						<label>name : </label>
						<input ref={nameRef} type="text"></input>
					</li>
					<li>
						<label>price : </label>
						<input ref={priceRef} type="number"></input>
					</li>
				</ul>
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
