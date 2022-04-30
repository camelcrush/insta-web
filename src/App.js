import { useReactiveVar } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { darkModeVar, isLoggedInVar } from "./apollo";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFount from "./screens/NotFound";

const lightTheme = {
  fontColor: "#2c2c2c",
  bgColor: "lightgray",
};

const darkTheme = {
  fontColor: "lightgray",
  bgColor: "#2c2c2c",
};

function App() {
  // reactive variables hook
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <Switch>
          <Route path="/" exact>
            {isLoggedIn ? <Home /> : <Login />}
          </Route>
          <Route>
            <NotFount />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
