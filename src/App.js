import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFount from "./screens/NotFound";

function App() {
  const isLoggedIn = true;
  return (
    <div>
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
    </div>
  );
}

export default App;
