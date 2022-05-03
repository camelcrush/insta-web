import { gql, useMutation } from "@apollo/client";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { logUserIn } from "../apollo";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import Seperator from "../components/auth/Seperator";
import PageTitle from "../components/PageTitle";
import routes from "../routes";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;
// Mutation 정의
const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setError,
    clearErrors,
  } = useForm({ mode: "onChange" });

  // mutation이 완료되면 실행되는 fn
  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok) {
      // useForm의 setError를 통해 error 이름과 message를 생성할 수 있음.
      return setError("result", {
        message: error,
      });
    }
    if (token) {
      logUserIn(token);
    }
  };
  // useMutation hook
  const [login, { loading }] = useMutation(LOGIN_MUTATION, { onCompleted });
  const onSubmitValid = (data) => {
    // Valid일 때
    if (loading) {
      // 이중클릭 방지를 위해
      return;
    }
    // useForm으로부터 data 가져오기
    const { username, password } = getValues(); // or data
    // 가져온 Data login mutation 실행
    login({
      variables: { username, password },
    });
  };
  const onSubmitInValid = (data) => {
    // InValid일 때
    // console.log(data, "Invalid");
  };
  return (
    <AuthLayout>
      <PageTitle title="Log in" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <form onSubmit={handleSubmit(onSubmitValid, onSubmitInValid)}>
          <Input
            {...register("username", {
              required: "Username is required.", // required: true || errorMessage 가능
              minLength: {
                value: 5,
                message: "Username should be longer than 5 chars.",
              },
            })}
            // error 발생 후 button이 disabled되는데 onFocus(), clearErrors()를 통해 에러를 지우고 버튼 활성화시킴.
            onFocus={() => clearErrors()}
            name="username"
            type="text"
            placeholder="Username"
            // hasError prop
            hasError={Boolean(errors?.username?.message)}
          />
          <FormError message={errors?.username?.message} />
          <Input
            {...register("password", {
              required: "Password is required.",
            })}
            // error 발생 후 button이 disabled되는데 onFocus(), clearErrors()를 통해 에러를 지우고 버튼 활성화시킴.
            onFocus={() => clearErrors()}
            name="password"
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
          />
          <FormError message={errors?.password?.message} />

          <Button
            type="submit"
            value={loading ? "loading..." : "Log in"}
            disabled={!isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
        <Seperator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with FaceBook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        linkText="Sign up"
        link={routes.signUp}
      />
    </AuthLayout>
  );
};

export default Login;
