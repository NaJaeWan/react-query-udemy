import axios from 'axios';

export async function fetchComments(postId) {
	const response = await axios.get(
		`http://localhost:3001/data?postId=${postId}`
	);
	return response.data;
}
export function updatePost(userInfo) {
	const { postId, userName, userComment } = userInfo;
	axios.post(`http://localhost:3001/data`, {
		postId: postId,
		name: userName,
		comment: userComment,
	});
}

export function deletePost(commentId) {
	axios.delete(`http://localhost:3001/data/${commentId}`);
}
