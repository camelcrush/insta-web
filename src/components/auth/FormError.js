import styled from "styled-components";

const SFormError = styled.span`
  color: tomato;
  font-weight: 600;
  font-size: 12px;
  margin: 5px 0px 10px 0px;
`;

const FormError = ({ message }) => {
  // message가 없거나 빈 스트링이면 null값
  return message === "" || !message ? null : <SFormError>{message}</SFormError>;
};

export default FormError;
