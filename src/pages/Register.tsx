import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, message } from "antd";
import {
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import CustomInput from "../components/componentHookForm/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/route";
import userService from "../axios/userService";

type RegisterFormInputs = {
  email: string;
  name: string;
  address: string;
  password: string;
  confirmPassword: string;
};

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  name: yup.string().default("").required("Name is required"),
  address: yup.string().default(""),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least 1 letter")
    .matches(/\d/, "Password must contain at least 1 number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .min(6, "Confirm password must be at least 8 characters")
    .oneOf([yup.ref("password")], "Password are not matching!")
    .required("Confirm password is required"),
});

const Register = () => {
  const navigate = useNavigate();

  const methods = useForm<RegisterFormInputs>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormInputs) => {
    try {
      const { confirmPassword, ...data } = values;

      await userService.addUser(data);

      methods.reset();
      message.success("Account created successfully!"); // Thông báo nếu thêm tài khoản thành công

      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "An error occurred";
        message.error(errorMessage);
      } else {
        message.error(error.message || "Failed to create account!"); // Thông báo nếu email đã tồn tại
      }
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto flex items-center h-[100vh] ">
      <div className="flex flex-col max-w-[400px] mx-auto gap-y-10 w-full shadow-none md:shadow-lg p-4">
        <h2 className="text-4xl font-semibold text-center">Sign up</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-8  ">
              <div className="flex flex-col gap-y-6 ">
                <CustomInput
                  name="email"
                  placeholder="Email"
                  prefix={<MailOutlined />}
                />
                <CustomInput
                  name="name"
                  placeholder="Full name"
                  prefix={<UserOutlined />}
                />
                <CustomInput
                  name="address"
                  placeholder="Address"
                  prefix={<HomeOutlined />}
                />
                <CustomInput
                  controllerType="password"
                  name="password"
                  placeholder="Password"
                  prefix={<LockOutlined />}
                />
                <CustomInput
                  controllerType="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  prefix={<LockOutlined />}
                />
              </div>

              <div className="flex flex-col w-full gap-y-3 ">
                <Button
                  className="w-full"
                  block={true}
                  type="primary"
                  htmlType="submit"
                >
                  Create Account
                </Button>
                <div className="flex justify-center gap-x-1 py-3    ">
                  <p className="text-sm">Do you already have an account?</p>{" "}
                  <Link to={ROUTES.LOGIN} className="text-blue-500 text-sm">
                    Log in now
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

export default Register;
