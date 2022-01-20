import axios from 'axios';

export async function fetchComments(postId) {
  const response = await axios.get(
    `http://localhost:3001/data?postId=${postId}`
  );
  return response.data;
}
export async function updatePost(userInfo) {
  const { postId, userName, userComment } = userInfo;
  await axios.post(`http://localhost:3001/data`, {
    postId: postId,
    name: userName,
    comment: userComment,
  });
  userInfo.refetch();
}

export async function deletePost(commentInfo) {
  await axios.delete(`http://localhost:3001/data/${commentInfo.commentId}`);
  commentInfo.refetch();
}
