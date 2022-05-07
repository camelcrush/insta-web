import PropTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";

const CommentsContainer = styled.div``;
const CommentCaption = styled.span`
  margin-left: 10px;
`;

const Comment = ({ author, payload }) => {
  return (
    <CommentsContainer>
      <FatText>{author}</FatText>
      <CommentCaption>{payload}</CommentCaption>
    </CommentsContainer>
  );
};

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
};

export default Comment;
