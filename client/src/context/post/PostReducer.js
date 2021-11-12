const PostReducer = (state, action) => {
  switch (action.type) {
    case "GET_POSTS_LIST":
      return {
        posts: null,
        isFetching: true,
        error: false,
      }
    case "GET_POSTS_LIST_SUCCESS":
      return {
        posts: action.payload,
        isFetching: true,
        error: false,
      }
    case "GET_POSTS_LIST_FAILED":
      return {
        posts: null,
        isFetching: false,
        error: action.payload,
      }

    case "CREATE_POST":
      return {
        posts: [action.payload, ...state.posts],
        isFetching: false,
        error: false,
      }

    default:
      return state;
  }
};

export default PostReducer;