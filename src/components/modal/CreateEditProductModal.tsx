import React, { useCallback, useEffect, useState } from "react";
import { Modal, Button, Select, notification } from "antd";
import { useForm, Controller, FormProvider } from "react-hook-form";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "../componentHookForm/CustomInput";
import { Category, Product, ProductFormData } from "../../axios/types";
import categoryService from "../../axios/categoryService";
import productService from "../../axios/productService";
import CustomTextAreaInput from "../componentHookForm/CustomTextAreaInput";

// Schema Yup cho form validation
const schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  basePrice: yup.number().required("Base price is required"),
  discountPercentage: yup
    .number()
    .min(0, "Discount must be at least 0")
    .max(100, "Discount can't exceed 100")
    .required("Discount percentage is required"),
  stock: yup.number().required("Stock is required"),
  description: yup.string().required("Description is required"),
  categories: yup
    .array()
    .min(1, "Please select at least one category")
    .required("Category is required"),
});

// Chuyển các thuộc tính trong Product thành string literal types
type ProductKeys = keyof ProductFormData;

type CreateEditProductModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  initialValues: Product | null;
};

const CreateEditProductModal: React.FC<CreateEditProductModalProps> =
  React.memo(({ visible, onClose, onSubmitSuccess, initialValues }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const methods = useForm<ProductFormData>({
      resolver: yupResolver(schema),
      mode: "onChange",
      defaultValues: {
        name: "",
        basePrice: 0,
        discountPercentage: 0,
        stock: 0,
        description: "",
        categories: [], // Bắt đầu với mảng rỗng
      },
    });

    // Fetch categories for dropdown
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await categoryService.getAllCategory();
          setCategories(response.data);
        } catch (err) {
          console.error("Failed to fetch categories:", err);
        }
      };

      fetchCategories();
    }, []);

    // Set form values if initialValues exist
    useEffect(() => {
      if (initialValues) {
        methods.reset({
          name: initialValues.name,
          basePrice: initialValues.basePrice,
          discountPercentage: initialValues.discountPercentage,
          stock: initialValues.stock,
          description: initialValues.description,
          categories: initialValues.categories,
        });
      } else {
        methods.reset({
          name: "",
          basePrice: 0,
          discountPercentage: 0,
          stock: 0,
          description: "",
          categories: [],
        });
      }
    }, [initialValues]);

    // Submit the form
    const handleFormSubmit = async (data: ProductFormData) => {
      setLoading(true);
      try {
        if (initialValues) {
          // Update existing product
          await productService.updateProduct(initialValues.id, data);
          notification.success({ message: "Product updated successfully" });
        } else {
          // Create new product
          await productService.addNewProduct(data);
          notification.success({ message: "Product created successfully" });
          methods.reset();
        }

        onSubmitSuccess();
        onClose();
      } catch (err) {
        console.error("Error during product submission:", err);
        notification.error({
          message: "Error occurred while saving the product",
        });
      } finally {
        setLoading(false);
      }
    };

    const handleNumberInputChange = useCallback(
      (name: ProductKeys, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let validValue = value === "" || value === "-" ? "0" : value;

        // Kiểm tra và thay thế giá trị 0 nếu TH: 01 -> 1, 02->2
        if (value.length > 1) {
          validValue = value.startsWith("0") ? value.slice(1) : value;
        }

        // Cập nhật giá trị vào form
        methods.setValue(name, validValue, { shouldValidate: true });
      },
      []
    );

    return (
      <Modal
        title={initialValues ? "Edit Product" : "Create Product"}
        open={visible}
        onCancel={onClose}
        footer={null}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Product Name
              </label>
              <CustomInput name="name" placeholder="Enter product name" />
            </div>

            <div className="space-y-2">
              <label htmlFor="basePrice" className="block text-sm font-medium">
                Base Price
              </label>
              <CustomInput
                onWheel={(e) => e.currentTarget.blur()}
                name="basePrice"
                type="number"
                placeholder="Enter base price"
                onChange={(e) => handleNumberInputChange("basePrice", e)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="discountPercentage"
                className="block text-sm font-medium"
              >
                Discount Percentage {"(%)"}
              </label>
              <CustomInput
                onWheel={(e) => e.currentTarget.blur()}
                name="discountPercentage"
                type="number"
                min={0}
                placeholder="Enter discount percentage"
                onChange={(e) =>
                  handleNumberInputChange("discountPercentage", e)
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="block text-sm font-medium">
                Stock
              </label>
              <CustomInput
                onWheel={(e) => e.currentTarget.blur()}
                min={0}
                name="stock"
                type="number"
                placeholder="Enter stock quantity"
                onChange={(e) => handleNumberInputChange("stock", e)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <CustomTextAreaInput
                name="description"
                placeholder="Enter product description"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="categories" className="block text-sm font-medium">
                Categories
              </label>
              <Controller
                name="categories"
                control={methods.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="w-full"
                    mode="multiple"
                    placeholder="Select categories"
                    options={categories.map((cat) => ({
                      label: cat.name,
                      value: cat.id,
                    }))}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
              />
              {methods.formState.errors.categories && (
                <p className="text-sm text-red-500">
                  {methods.formState.errors.categories.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={onClose} style={{ marginRight: "8px" }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {initialValues ? "Update" : "Create"} Product
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    );
  });

export default CreateEditProductModal;
