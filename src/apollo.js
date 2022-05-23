import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import routes from "./routes";

const TOKEN = "TOKEN";
const DARK_MODE = "DARK_MODE";

// 페이지가 새로고침될 때마다 local storage에 token 유무 확인, 있으면 true 없으면 false
export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const logUserIn = (token) => {
  // local Storage에 token 저장 후, react variables에 저장.
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

export const logUserOut = (navigate) => {
  localStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  if (navigate) {
    navigate(routes.home, { state: null });
  }
  // or window.location.reload()
};

export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enabled");
  darkModeVar(true);
};

export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://insta-camelcrush.herokuapp.com/graphql"
      : "http://localhost:4000/graphql",
});

// request header에 token 추가하기
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: localStorage.getItem(TOKEN),
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    // Customizing cache IDs : id가 아닌 다른 field를 고유식별자로 설정할 수 있음.
    typePolicies: {
      User: {
        keyFields: (obj) => `User:${obj.username}`,
      },
    },
  }),
});
