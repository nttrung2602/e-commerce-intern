import React from "react";
import { Modal, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import productService from "../../axios/productService";

interface ImageUploadModalProps {
  visible: boolean;
  onCancel: () => void;
  onUploadSuccess: () => void;
  selectedProductId: string | null;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = React.memo(
  ({ visible, selectedProductId, onCancel, onUploadSuccess }) => {
    const handlePictureChange = async (file: any) => {
      try {
        await productService.updateProductImage(selectedProductId!, file);
        message.success("Product picture updated successfully!");

        onUploadSuccess();
        onCancel();
      } catch (error) {
        message.error("Failed to update product picture");
      }
    };

    return (
      <Modal
        title="Change Product Picture"
        open={visible}
        onCancel={() => {
          onCancel();
        }}
        footer={null}
      >
        <Upload
          customRequest={({ file, onSuccess, onError }) => {
            handlePictureChange(file);
          }}
          accept="image/*"
        >
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            icon={<UploadOutlined />}
          >
            Upload Image
          </Button>
        </Upload>
      </Modal>
    );
  }
);

export default ImageUploadModal;
