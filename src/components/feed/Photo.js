import { gql, useMutation } from "@apollo/client";
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import styled from "styled-components";
import Avatar from "../Avatar";
import { FatText } from "../shared";

const PhotoContainer = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.boderColor};
  border-radius: 4px;
  margin-bottom: 60px;
  max-width: 615px;
`;

const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(239, 239, 239);
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  width: 100%;
`;

const PhotoData = styled.div`
  padding: 12px 15px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
`;

const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const Likes = styled(FatText)`
  margin-top: 15px;
  display: block;
`;

const Comments = styled.div`
  margin-top: 20px;
`;
const Comment = styled.div``;
const CommentCaption = styled.span`
  margin-left: 10px;
`;
const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-weight: 600;
  font-size: 10px;
`;

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

function Photo({
  id,
  user,
  file,
  isLiked,
  likes,
  caption,
  commentCount,
  comments,
}) {
  const updateToggleLike = (cache, result) => {
    // cache와 mutation을 통해 받은 data를 args로 제공.
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const fragmentId = `Photo:${id}`;
      const fragment = gql`
        fragment P on Photo {
          isLiked
          likes
        }
      `;
      // cache data 가져오기
      const readCache = cache.readFragment({
        id: fragmentId,
        fragment,
      });
      if ("isLiked" in readCache && "likes" in readCache) {
        // cache에 업데이트 하기
        cache.writeFragment({
          id: fragmentId,
          fragment,
          data: {
            isLiked: !isLiked,
            likes: isLiked ? likes - 1 : likes + 1,
          },
        });
      }
    }
  };
  const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: { id },
    // update: cache에 접근할 수 있는 option
    update: updateToggleLike,
  });
  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Avatar lg url={user.avatar} />
        <Username>{user.username}</Username>
      </PhotoHeader>
      <PhotoFile src={file} />
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={toggleLikeMutation}>
              <FontAwesomeIcon
                style={{ color: isLiked ? "tomato" : "inherit" }}
                icon={isLiked ? solidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        </PhotoActions>
        <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        <Comments>
          <Comment>
            <FatText>{user.username}</FatText>
            <CommentCaption>{caption}</CommentCaption>
          </Comment>
          <CommentCount>
            {commentCount === 1 ? `1 comment` : `${commentCount} comments`}
          </CommentCount>
          {comments?.map((comment) => (
            <Comment>
              <FatText>{comment.user.username}</FatText>
              <CommentCaption>{comment.payload}</CommentCaption>
            </Comment>
          ))}
        </Comments>
      </PhotoData>
    </PhotoContainer>
  );
}

Photo.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }),
  caption: PropTypes.string,
  file: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likes: PropTypes.number.isRequired,
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

export default Photo;
