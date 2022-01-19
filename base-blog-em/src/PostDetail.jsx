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

export function PostDetail({ post }) {
  const { data, isLoading, isError, error } = useQuery(
    ['comment', post.id],
    () => fetchComments(post.id)
  );
  const userId = useInput();
  const userName = useInput();
  const userComment = useInput();

  const queryClient = useQueryClient();

  const deleteMutation = useMutation((commentId) => deletePost(commentId));
  const updateMutation = useMutation((userInfo) => {
    updatePost(userInfo);
  });

  async function updatePost(userInfo) {
    const { postId, userName, userComment } = userInfo;
    await axios.post(`http://localhost:3001/data`, {
      postId: postId,
      name: userName,
      comment: userComment,
    });
    queryClient.invalidateQueries('comment');
  }

  async function deletePost(commentId) {
    await axios.delete(`http://localhost:3001/data/${commentId}`);
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
        <ul style={{ listStyle: 'none', padding: '0px' }}>
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
            updateMutation.mutate({
              postId: post.id,
              userName: userName.value,
              userComment: userComment.value,
            });
          }}
        >
          Update comment
        </button>
      </div>

      {/* {deleteMutation.isError && (
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
			)} */}

      <h4>Comments</h4>
      {data.map((userComment, index) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '300px',
          }}
        >
          <li style={{ listStyle: 'none' }} key={userComment.id}>
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
