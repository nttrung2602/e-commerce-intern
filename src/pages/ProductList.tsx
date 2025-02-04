import { useEffect, useState } from "react";
import { Table, Button, message, Modal, Upload, Input } from "antd";
import { useNavigate } from "react-router-dom";
import productService from "../axios/productService";
import { Product } from "../axios/types";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ImageUploadModal from "../components/modal/ImageUploadModal";
import CreateEditProductModal from "../components/modal/CreateEditProductModal";
import { useDebounce } from "../hooks/customHook";
import CustomInput from "../components/componentHookForm/CustomInput";

const ProductList = () => {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 1000);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploadModalVisible, setIsUploadModalVisible] =
    useState<boolean>(false);
  const [isCreateEditModalVisible, setIsCreateEditModalVisible] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedSearchText) {
      fetchProducts(debouncedSearchText, 1); // Reset page về 1 khi có search
    }
  }, [debouncedSearchText]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (
    name?: string,
    page?: number,
    offset?: number
  ) => {
    setLoading(true);
    try {
      // Fetch data from API (using axios)
      const response = await productService.getAllProduct(name, page, offset);
      setProducts(response.data); // Assuming items is the array of products
    } catch (error) {
      message.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot undo",
      onOk: async () => {
        try {
          await productService.deleteProduct(id);
          message.success("Category deleted");
          fetchProducts();
        } catch (error) {
          message.error("Failed to delete category");
        }
      },
      onCancel: () => {
        message.info("Delete action cancelled");
      },
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Picture",
      dataIndex: "picture",
      key: "picture",
      render: (text: string, record: Product) => (
        <div
          className="relative inline-block w-24 h-24 cursor-pointer"
          onMouseEnter={() =>
            !isUploadModalVisible && setSelectedProduct(record)
          } // Set the current product when hover
          onMouseLeave={() => !isUploadModalVisible && setSelectedProduct(null)}
        >
          {record.picture && (
            <img
              src={`http://${text}`}
              alt="product"
              className="w-full h-full object-contain rounded-lg"
            />
          )}

          {selectedProduct && selectedProduct.id === record.id && (
            <Button
              className="absolute bottom-2 left-2 z-10 bg-blue-500 text-white text-sm"
              onClick={() => {
                setIsUploadModalVisible(true);
                setSelectedProduct(record);
              }}
            >
              Change
            </Button>
          )}
        </div>
      ),
    },
    { title: "Base Price", dataIndex: "basePrice", key: "basePrice" },
    {
      title: "Discount (%)",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
    },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <div
          className=""
          onMouseEnter={() =>
            !isCreateEditModalVisible && setSelectedProduct(record)
          } // Set the current product when hover
          onMouseLeave={() =>
            !isCreateEditModalVisible && setSelectedProduct(null)
          }
        >
          <Button
            type="link"
            onClick={() => {
              setIsCreateEditModalVisible(true);
              setSelectedProduct(record);
            }}
          >
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
      <div className="flex flex-col gap-y-3 ">
        <div className="flex justify-between">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search for products"
            style={{ marginBottom: "20px", width: "300px" }}
            suffix={<SearchOutlined />} // Thêm icon tìm kiếm vào cuối input
          />
          <Button
            className="w-fit"
            type="primary"
            onClick={() => setIsCreateEditModalVisible(true)}
          >
            Create Product
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 4,
          }}
        />
      </div>

      <ImageUploadModal
        visible={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        selectedProductId={selectedProduct?.id!}
        onUploadSuccess={() => {
          fetchProducts(); // Reload product list

          setSelectedProduct(null);
        }}
      />

      <CreateEditProductModal
        visible={isCreateEditModalVisible}
        onClose={() => {
          setIsCreateEditModalVisible(false);
          setSelectedProduct(null);
        }}
        onSubmitSuccess={() => fetchProducts()}
        initialValues={selectedProduct || null}
      />
    </div>
  );
};

export default ProductList;
