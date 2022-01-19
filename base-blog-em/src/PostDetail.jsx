import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useInput from './useInput';
import { fetchComments, updatePost, deletePost } from './api.jsx';

export function PostDetail({ post }) {
	const { data, isLoading, isError, error } = useQuery(
		['comment', post.id],
		() => fetchComments(post.id)
	);
	const userName = useInput();
	const userComment = useInput();

	const queryClient = useQueryClient();

	const deleteMutation = useMutation((commentId) => deletePost(commentId));
	const updateMutation = useMutation((userInfo) => {
		updatePost(userInfo);
	});

	useEffect(() => {
		if (updateMutation.isSuccess || deleteMutation.isSuccess) {
			queryClient.invalidateQueries('comment');
		}
	}, [updateMutation.isSuccess, deleteMutation.isSuccess]);

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
				<ul style={{ listStyle: 'none', padding: '0px' }}>
					<li>
						<label>name : </label>
						<input
							onChange={userName.onChange}
							type="text"
							value={userName.value}
						></input>
					</li>
					<li>
						<label>comment : </label>
						<input
							onChange={userComment.onChange}
							type="text"
							value={userComment.value}
						></input>
					</li>
				</ul>
				<button
					onClick={() => {
						updateMutation.mutate({
							postId: post.id,
							userName: userName.value,
							userComment: userComment.value,
						});
						userName.clear();
						userComment.clear();
					}}
				>
					Update comment
				</button>
			</div>

			<h4>Comments</h4>
			{data.map((userComment, index) => (
				<div
					key={userComment.id}
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '300px',
					}}
				>
					<li style={{ listStyle: 'none' }}>
						{index + 1} {userComment.name}: {userComment.comment}
					</li>
					<button onClick={() => deleteMutation.mutate(userComment.id)}>
						삭제
					</button>
				</div>
			))}
		</>
	);
}
