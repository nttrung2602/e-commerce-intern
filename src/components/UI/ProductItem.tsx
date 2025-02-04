import React from "react";
import { Product } from "../../axios/types";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/route";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../slices/cart/cartSlice";
import { requireLoginModal } from "../../utils/extensions";
import { RootState } from "../../store/store";

interface Props {
  product: Product;
}
const ProductItem = ({ product }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const loginStatus = useSelector(
    (state: RootState) => state.login.loginStatus
  );

  return (
    <div
      onClick={() => {
        navigate(
          `${ROUTES.PRODUCT_DETAIL.replace(":urlname", product.urlName!)}`
        );
      }}
      className="relative flex flex-col gap-y-3 items-center justify-center cursor-pointer w-full h-full lg:w-[300px] lg:h-[400px] group "
    >
      {product.discountPercentage > 0 && (
        <div className="absolute top-2 left-2 bg-black text-white text-sm px-2 py-1 rounded">
          -{product.discountPercentage}%
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation(); // Ngăn click lan ra sản phẩm
          if (loginStatus === "notLoggedIn") {
            requireLoginModal("Thêm vào giỏ hàng", navigate, location);
          } else {
            dispatch(addToCart());
            message.success("Đã thêm vào giỏ", 1);
          }
        }}
        className="absolute top-2 right-2 bg-blue-500 text-white text-sm px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition duration-300"
      >
        <ShoppingCartOutlined />
      </button>

      <div className="bg-gray-200/20 w-full flex justify-center">
        <img
          className="h-[350px] object-contain"
          src={
            product.picture
              ? `http://${product.picture}`
              : "/src/assets/shirt.png"
          }
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-[14px]">{product.name}</p>

        <div className="flex gap-x-2 ">
          {!(product.stock > 0) ? (
            <p className="text-red-500 font-semibold ">Tạm hết hàng</p>
          ) : product.discountPercentage > 0 ? (
            <>
              <p className="text-red-500 font-semibold ">
                {Math.trunc(
                  Number(
                    product.basePrice -
                      product.basePrice * (product.discountPercentage / 100)
                  )
                )
                  .toLocaleString()
                  .replace(".", ",")}{" "}
                <span className="underline">đ</span>
              </p>
              <p className="text-gray-500 text-xs line-through self-center ">
                {Number(product.basePrice).toLocaleString().replace(".", ",")}{" "}
                <span className="underline">đ</span>
              </p>
            </>
          ) : (
            <p className="text-red-500 font-semibold  ">
              {Number(product.basePrice).toLocaleString().replace(".", ",")}{" "}
              <span className="underline">đ</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
