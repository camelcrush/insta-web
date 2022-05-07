import { gql, useMutation } from "@apollo/client";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import Comment from "./Comment";

const CommentsContainer = styled.div`
  margin-top: 7px;
`;

const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-weight: 600;
  font-size: 10px;
`;

const PostCommentContainer = styled.div`
  margin-top: 10px;
  padding: 15px 0px 10px 0px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      id
      error
    }
  }
`;

const Comments = ({ photoId, author, caption, commentCount, comments }) => {
  const { data: userData } = useUser();
  const createCommentUpdate = (cache, result) => {
    // comment가 성공적으로 만들어지면 실행되는 update fn, cache와 mutation response를 받아올 수 있음.
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;
    // fake Comment 만들기.
    if (ok && userData?.me) {
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        payload,
        isMine: true,
        user: {
          ...userData?.me,
        },
      };
      // fake Comment를 가지고 Comment Cachef를 새로 만들기.
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment BSNAME on COMMENT {
            id
            createdAt
            payload
            isMine
            user {
              username
              avatar
            }
          }
        `,
      });
      // 만들어진 Cache를 가지고 Photo cache 수정하기.
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment];
          },
          commentCount(prev) {
            return prev + 1;
          },
        },
      });
    }
  };
  const [createCommentMutation, { loading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      update: createCommentUpdate,
    }
  );
  const { register, handleSubmit, setValue, getValues } = useForm();
  const onValid = (data) => {
    // form data가 유효하면 실행되는 fn, 여기서 mutation을 실행
    const { payload } = data;
    if (loading) {
      return;
    }
    createCommentMutation({ variables: { photoId, payload } });
  };
  return (
    <CommentsContainer>
      <Comment author={author} payload={caption} />
      <CommentCount>
        {commentCount === 1 ? `1 comment` : `${commentCount} comments`}
      </CommentCount>
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          author={comment.user.username}
          payload={comment.payload}
        />
      ))}
      <PostCommentContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <PostCommentInput
            {...register("payload", { required: true })}
            name="payload"
            type="text"
            placeholder="Write a comment..."
          />
        </form>
      </PostCommentContainer>
    </CommentsContainer>
  );
};

Comments.propTypes = {
  photoId: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  caption: PropTypes.string,
  commentCount: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }),
      payload: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
};

export default Comments;
