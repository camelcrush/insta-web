import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

const TOKEN = "token";

// 페이지가 새로고침될 때마다 local storage에 token 유무 확인, 있으면 true 없으면 false
export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const logUserIn = (token) => {
  // local Storage에 token 저장 후, react variables에 저장.
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

export const logUserOut = () => {
  localStorage.removeItem(TOKEN);
  isLoggedInVar(false);
};

export const darkModeVar = makeVar(false);
export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});
