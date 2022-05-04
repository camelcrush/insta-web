import styled from "styled-components";
import Header from "./Header";

const Content = styled.main`
  margin: 0 auto;
`;

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Content>{children}</Content>
    </>
  );
};

export default Layout;
