import { Input, InputProps } from "antd";
import Search from "antd/es/input/Search";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string; // field name
  controllerType?: "password" | "default" | "search" | "textArea";
} & InputProps;

const CustomInput: React.FC<Props> = ({
  name,
  controllerType = "default",
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // Lấy control từ context

  return (
    <div className="relative">
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          switch (controllerType) {
            case "search":
              return <Search {...field} {...props} />;
            case "password":
              return <Input.Password {...field} {...props} />;
            default:
              return <Input {...field} {...props} />;
          }
        }}
      />
      {errors[name] && (
        <p className="absolute top-full left-0 text-sm text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default CustomInput;
