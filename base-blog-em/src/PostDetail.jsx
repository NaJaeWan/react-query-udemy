import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import useInput from './useInput';

async function fetchComments(postId) {
	const response = await axios.get(
		`http://localhost:3001/data?postId=${postId}`
	);
	console.log(response);
	return response.data;
}

async function deletePost(postId) {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/postId/${postId}`,
		{ method: 'DELETE' }
	);
	return response;
}


export function PostDetail({ post }) {

	const { data, isLoading, isError, error } = useQuery(
		['comment', post.id],
		() => fetchComments(post.id)
	);
	const userId = useInput();
	const userName = useInput();
	const userComment = useInput();

	const queryClient = useQueryClient();

	const deleteMutation = useMutation((postId) => deletePost(postId));
	const updateMutation = useMutation((userInfo) => {
		updatePost(userInfo);
	});


	async function updatePost(userInfo) {
		const { postId, userId, userName, userComment } = userInfo;
		await axios.post(
			`http://localhost:3001/data`,
			{
				"postId":postId,
				"id": Number(userId),
				"name": userName,
				"comment": userComment,
			}
		);
		queryClient.invalidateQueries('comment');
	}
	

	if (isLoading) {
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
						<input onChange={userId.onChange} type="number"></input>
					</li>
					<li>
						<label>name : </label>
						<input onChange={userName.onChange} type="text"></input>
					</li>
					<li>
						<label>price : </label>
						<input onChange={userComment.onChange} type="text"></input>
					</li>
				</ul>
				<button
					onClick={() => {
						console.log(userId.value, userName.value, userComment.value);
						updateMutation.mutate(
							{
								postId: post.id,
								userId: userId.value,
								userName: userName.value,
								userComment: userComment.value,
							}
						);
					}}
				>
					Update comment
				</button>
			</div>
			{/* <button onClick={() => deleteMutation.mutate(post.id)}>
				Delete
			</button>{' '} */}
			{deleteMutation.isError && (
				<p style={{ color: 'red' }}>Error deleting the comment</p>
			)}
			{deleteMutation.isLoading && (
				<p style={{ color: 'purple' }}>Deleting the comment</p>
			)}
			{deleteMutation.isSuccess && (
				<p style={{ color: 'green' }}>comment has been deleted</p>
			)}
			{updateMutation.isError && (
				<p style={{ color: 'red' }}>Error updating the comment</p>
			)}
			{updateMutation.isLoading && (
				<p style={{ color: 'purple' }}>updating the comment</p>
			)}
			{updateMutation.isSuccess && (
				<p style={{ color: 'green' }}>comment has been updated</p>
			)}
			{/* <p>{post.body}</p> */}
			<h4>Comments</h4>
			{data.map((userComment) => (
				<li key={userComment.id}>
					{userComment.name}: {userComment.comment}
				</li>
			))}
		</>
	);
}
