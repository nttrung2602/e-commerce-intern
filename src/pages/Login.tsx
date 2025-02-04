import { Button, message } from "antd";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../components/componentHookForm/CustomInput";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
// import { Account } from "../utils/type";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/route";
import authService from "../axios/authService";
import userService from "../axios/userService";
import CustomCheckbox from "../components/componentHookForm/CustomCheckbox";
import { User } from "../axios/types";
import { RootState } from "../store/store";
import { setLoginStatus } from "../slices/auth/loginStatus";

type LoginFormInputs = {
  email: string;
  password: string;
  remember?: boolean | undefined;
};

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least 1 letter")
    .matches(/\d/, "Password must contain at least 1 number")
    .required("Password is required"),
  remember: yup.boolean(),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const prevPath = location.state?.from?.pathname;

  const methods = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: LoginFormInputs) => {
    try {
      const { remember, ...data } = values;
      const loginResponse = await authService.login(data);

      dispatch(setLoginStatus("loggedIn"));

      methods.reset(); // reset fields in form
      message.success("Logged in successfully!");

      // Lưu trữ token
      sessionStorage.setItem("access_token", loginResponse.data.accessToken);
      sessionStorage.setItem("refresh_token", loginResponse.data.refreshToken);

      const userResponse = await userService.userProfile();
      const { name, address, role, email } = userResponse.data;

      sessionStorage.setItem(
        "user",
        JSON.stringify({ name, address, role, email })
      );

      if (!prevPath) {
        if (userResponse.data.role === "ADMIN") {
          navigate(ROUTES.DASHBOARD);
        } else {
          navigate(ROUTES.HOME);
        }
      } else {
        navigate(prevPath);
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "An error occurred";

        message.error(errorMessage);
      } else {
        message.error(error.message);
      }
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto flex items-center h-[100vh] ">
      <div className="flex flex-col max-w-[400px] mx-auto gap-y-10 w-full shadow-none md:shadow-lg p-4">
        <h2 className="text-4xl font-semibold text-center">Sign in</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-7 ">
              <CustomInput
                name="email"
                placeholder="Email"
                prefix={<MailOutlined />}
              />

              <CustomInput
                name="password"
                placeholder="Password"
                prefix={<LockOutlined />}
                controllerType="password"
              />

              <div className="w-full flex flex-row justify-between">
                <CustomCheckbox name="remember" label="Remember me" />
                <Link to="" className="text-blue-500 text-sm">
                  Forgot password?
                </Link>
              </div>

              <div className="flex flex-col w-full gap-y-3 ">
                <Button
                  className="w-full"
                  block={true}
                  type="primary"
                  htmlType="submit"
                >
                  Log in
                </Button>
                <div className="flex justify-center gap-x-1 py-3    ">
                  <p className="text-sm">Don't have an account?</p>{" "}
                  <Link to={ROUTES.REGISTER} className="text-blue-500 text-sm">
                    Sign up now
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default Login;
