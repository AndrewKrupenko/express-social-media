export const GetPostsList = () => ({
  type: "GET_POSTS_LIST",
});

export const GetPostsListSuccess = posts => ({
  type: "GET_POSTS_LIST_SUCCESS",
  payload: posts,
});

export const GetPostsListFailed = error => ({
  type: "GET_POSTS_LIST_FAILED",
  payload: error,
});

export const CreatePost = post => ({
  type: "CREATE_POST",
  payload: post,
});
