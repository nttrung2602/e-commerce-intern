import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message } from "antd";
import categoryService from "../axios/categoryService";
import { Category } from "../axios/types";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "../components/componentHookForm/CustomInput";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .min(3, "Must be at least 3 characters"),
});

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "" },
  });

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategory();
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };

  // Add or Update category
  const handleSubmit = async (values: { name: string }) => {
    setLoading(true);

    try {
      if (editingCategory) {
        // Update category
        await categoryService.updateCategory({
          id: editingCategory.id,
          name: values.name,
        });

        message.success("Category updated");
      } else {
        // Add new category
        await categoryService.addNewCategory(values.name);
        message.success("Category added");
      }
      fetchCategories();
      setVisible(false);
      setEditingCategory(null);
    } catch (error) {
      message.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  // Open modal adding/editing category
  const openModal = (category: Category | null = null) => {
    setEditingCategory(category);
    methods.reset(); // Reset khi thêm mới

    if (category) {

      methods.reset({ name: category.name });
    } else {

      methods.reset({ name: "" }); // Reset khi thêm mới
    }

    setVisible(true);
  };

  // Delete category
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot undo",
      onOk: async () => {
        try {
          await categoryService.deleteCategory(id);

          message.success("Category deleted");
          
          fetchCategories();
        } catch (error) {
          message.error("Failed to delete category");
        }
      },
      onCancel: () => {
        message.info("Delete action cancelled");
      },
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    { title: "Category Name", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      key: "actions",
      render: (_text: any, record: Category) => (
        <div>
          <Button onClick={() => openModal(record)} type="link">
            <EditOutlined className="text-blue-500 text-lg" />
          </Button>
          <Button onClick={() => handleDelete(record.id!)} type="link" danger>
            <DeleteOutlined className="text-red-500 text-lg" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-y-3">
        <Button className="w-fit ml-3 md:ml-0" type="primary" onClick={() => openModal()}>
          Add Category
        </Button>
        <Table
          loading={loading}
          dataSource={categories}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="id"
        />
      </div>

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-y-2">
              <CustomInput name="name" placeholder="Category Name" />
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="mt-4"
              >
                {editingCategory ? "Update" : "Add"} Category
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </div>
  );
};

export default CategoryPage;
