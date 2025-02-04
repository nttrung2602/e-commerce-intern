import React, { useState } from "react";
import { Table, Button, Modal, message } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import CustomInput from "../components/componentHookForm/CustomInput";

const productSchema = yup.object({
  name: yup.string().required("Product name is required"),
  basePrice: yup
    .number()
    .positive("Price must be positive")
    .required("Base price is required"),
  discountPercentage: yup
    .number()
    .min(0, "Discount must be at least 0%")
    .max(100, "Discount cannot exceed 100%")
    .required("Discount is required"),
  stock: yup
    .number()
    .integer("Stock must be an integer")
    .required("Stock is required"),
  description: yup.string().optional(),
  categories: yup
    .array()
    .of(yup.string().required())
    .required("At least one category is required"),
});

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]); // State for product list
  const [visible, setVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const methods = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      basePrice: 0,
      discountPercentage: 0,
      stock: 0,
      description: "",
      categories: [],
    },
  });

  const openModal = (product: any | null = null) => {
    setEditingProduct(product);
    if (product) {
      methods.reset(product); // Reset form to edit mode
    } else {
      methods.reset(); // Clear form for create mode
    }
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    // Call delete API
    message.success("Product deleted successfully");
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingProduct) {
        // Update product
        await axios.put(`/api/products/${editingProduct.id}`, data);
        message.success("Product updated successfully");
      } else {
        // Create new product
        await axios.post(`/api/products`, data);
        message.success("Product created successfully");
      }
      setVisible(false);
      setEditingProduct(null);
    } catch (error) {
      message.error("Error occurred while saving the product");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      key: "basePrice",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text: any, record: any) => (
        <>
          <Button onClick={() => openModal(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => openModal()}>
        Create Product
      </Button>
      <Table columns={columns} dataSource={products} rowKey="id" />

      <Modal
        visible={visible}
        title={editingProduct ? "Edit Product" : "Create Product"}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <CustomInput name="name" placeholder="Product Name" />
            <CustomInput
              name="basePrice"
              placeholder="Base Price"
              type="text"
            />
            <CustomInput
              name="discountPercentage"
              placeholder="Discount Percentage"
              type="text"
            />
            <CustomInput name="stock" placeholder="Stock" type="text" />
            <CustomInput
              name="description"
              placeholder="Description"
              type="text"
            />
            <CustomInput
              name="categories"
              placeholder="Categories (comma separated)"
            />
            <Button type="primary" htmlType="submit" block>
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </form>
        </FormProvider>
      </Modal>
    </div>
  );
};

export default Products;
