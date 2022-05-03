import { useNavigate } from "react-router";
import { logUserOut } from "../apollo";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => logUserOut(navigate)}>Logout</button>
    </div>
  );
};

export default Home;
