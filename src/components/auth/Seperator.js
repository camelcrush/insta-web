import styled from "styled-components";

const SSeperator = styled.div`
  margin: 20px 0px 30px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  div {
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.theme.borderColor};
  }
  span {
    margin: 0px 10px;
    font-weight: 600;
    color: #8e8e8e;
    font-size: 12px;
  }
`;

const Seperator = () => {
  return (
    <SSeperator>
      <div></div>
      <span>OR</span>
      <div></div>
    </SSeperator>
  );
};

export default Seperator;
