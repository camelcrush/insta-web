import { useParams } from "react-router";

const Profile = () => {
  const { username } = useParams();
  console.log(username);
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
};

export default Profile;
