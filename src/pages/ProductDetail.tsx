import { PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, InputNumber, message, Modal, Rate, Typography } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Product from "./Product";
import { useEffect, useState } from "react";
import productService from "../axios/productService";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cart/cartSlice";
import PaymentModal from "../components/modal/PaymentModal";
import { RootState } from "../store/store";
import { ROUTES } from "../routes/route";
import { requireLoginModal } from "../utils/extensions";
import { Image } from "antd";
const ProductDetail = () => {
  const { urlname } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const [isPaymentVisibleModal, setIsPaymentVisibleModal] = useState(false);
  const loginStatus = useSelector(
    (state: RootState) => state.login.loginStatus
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const producDetail = async () => {
      try {
        const response = await productService.getProductByURLName(urlname!);

        setProduct(response.data);
      } catch (error: any) {
        message.error(error.message);
      }
    };
    producDetail();
  }, [urlname]);

  if (!product) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 max-w-[1400px] mx-auto">
      {/* left side */}
      <div className="md:w-1/2  ">
        <div className="relative bg-gray-200/20 h-full">
          <Image
            width={"100%"}
            src={`http://${product.picture}`}
            alt="image"
            className="w-full object-contain rounded-lg min-h-[500px]"
          />
          {product.discountPercentage > 0 && (
            <span className="absolute top-4 right-4 bg-gray-800 text-white px-2 py-1 rounded text-sm">
              -{product.discountPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* right side */}
      <div className="md:w-1/2">
        <div className="space-y-5">
          <h1 className="text-xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-2">
            <Rate disabled defaultValue={4.3} />
            <span className="text-gray-500">(40 đánh giá / 67 lượt mua)</span>
          </div>

          <div className="flex gap-4">
            <span className="underline self-end">Giá bán:</span>
            {product.discountPercentage > 0 ? (
              <>
                <span className="text-2xl  text-red-600">
                  {Number(
                    product.basePrice -
                      product.basePrice * (product.discountPercentage / 100)
                  )
                    .toLocaleString()
                    .replace(/\./g, ",")}{" "}
                  ₫
                </span>
                <span className="text-xl  text-gray-500 line-through">
                  {Number(product.basePrice).toLocaleString().replace(".", ",")}{" "}
                  ₫
                </span>
              </>
            ) : (
              <span className="text-2xl  text-red-600">
                {Number(product.basePrice).toLocaleString()} ₫
              </span>
            )}
          </div>

          <div className="flex gap-4">
            <span className="self-end">SL còn lại:</span>
            <span className="  ">{product.stock}</span>
          </div>

          <div className="flex gap-4">
            <span className="shrink-0">Mô tả sản phẩm:</span>
            <span className="  ">{product.description}</span>
          </div>

          <div>
            <Typography.Text className="block mb-2">SỐ LƯỢNG*</Typography.Text>
            <InputNumber
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(value) => setQuantity(value!)}
              className="w-32"
            />
          </div>

          {product.stock > 0 ? (
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  if (loginStatus === "notLoggedIn") {
                    requireLoginModal("Thanh toán", navigate, location);
                  } else {
                    setIsPaymentVisibleModal(true);
                  }
                }}
                type="primary"
                size="large"
                className=" flex-1 bg-red-600 hover:bg-red-700"
              >
                <ShoppingCartOutlined className="w-4 h-4 mr-2" />
                Thanh toán
              </Button>
              <Button
                size="large"
                className="flex-1"
                onClick={() => {
                  if (loginStatus === "notLoggedIn") {
                    requireLoginModal("Thêm vào giỏ hàng", navigate, location);
                  } else {
                    dispatch(addToCart());
                  }
                }}
              >
                <PlusOutlined className="w-4 h-4 mr-2" />
                Thêm vào giỏ hàng
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-red-500 text-2xl text-center">Tạm hết hàng</p>
            </div>
          )}
        </div>
      </div>

      {isPaymentVisibleModal && (
        <PaymentModal
          isOpen={isPaymentVisibleModal}
          onCancel={() => {
            setIsPaymentVisibleModal(false);
          }}
          paymentInfo={{
            id: product.id,
            quantity: quantity,
            price: product.basePrice,
          }}
        />
      )}
    </div>
  );
};

export default ProductDetail;
