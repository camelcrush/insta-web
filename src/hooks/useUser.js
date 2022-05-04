import { useEffect } from "react";
import { useNavigate } from "react-router";

const { useQuery, gql, useReactiveVar } = require("@apollo/client");
const { isLoggedInVar, logUserOut } = require("../apollo");

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      avatar
    }
  }
`;

const useUser = () => {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { data } = useQuery(ME_QUERY, { skip: !hasToken });
  // token이 조작되거나 유효하지 않으면, 백엔드에서 유저를 찾지 못하고 protectedResovler로 인해 null값을 반환하게 되는데
  // 이 때 유효하지 않은 토큰을 없애기 위해 logout시킴.
  console.log(data);
  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);
  return { data };
};

export default useUser;
