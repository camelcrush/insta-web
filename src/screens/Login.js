import { isLoggedInVar } from "../apollo";

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => isLoggedInVar(true)}>Login</button>
    </div>
  );
};

export default Login;
