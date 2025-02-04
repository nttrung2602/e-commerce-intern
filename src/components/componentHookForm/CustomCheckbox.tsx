import React from "react";
import { Checkbox, CheckboxProps } from "antd";
import { Controller, useFormContext } from "react-hook-form";

type CustomCheckboxProps = {
  name: string; // Tên field
  label?: string; // Nhãn của checkbox
} & CheckboxProps;

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  label,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="relative">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox {...field} checked={field.value} {...props}>
            {label}
          </Checkbox>
        )}
      />
      {errors[name] && (
        <p className="absolute top-full left-0 text-sm text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default CustomCheckbox;
