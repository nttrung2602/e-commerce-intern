import { Input } from "antd";
import { TextAreaProps } from "antd/es/input";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string; // field name
} & TextAreaProps;

const CustomTextAreaInput: React.FC<Props> = ({ name, ...props }) => {
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
          return <Input.TextArea {...field} {...props} rows={4} />;
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

export default CustomTextAreaInput;
