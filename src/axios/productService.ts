import { API_ROUTES } from "../routes/route";
import axiosClient from "./axiosClient";
import { Product, ProductFormData } from "./types";

const productService = {
  getAllProduct(name?: string, page: number = 1, offset: number = 10) {
    return axiosClient.get<Product[]>(API_ROUTES.PRODUCTS, {
      params: { productName: name, page, offset },
    });
  },
  getProductById(id: string) {
    return axiosClient.get<Product>(API_ROUTES.GET_PRODUCT_BY_ID(id));
  },
  getProductByURLName(urlName: string) {
    return axiosClient.get<Product>(
      API_ROUTES.GET_PRODUCT_BY_URL_NAME(urlName)
    );
  },
  addNewProduct(data: ProductFormData) {
    return axiosClient.post(API_ROUTES.ADD_NEW_PRODUCT, { ...data });
  },
  deleteProduct(id: string) {
    return axiosClient.delete(API_ROUTES.DELETE_PRODUCT(id));
  },
  updateProduct(productId: string, data: ProductFormData) {
    const { categories, ...rest } = data;
    return axiosClient.patch(API_ROUTES.UPDATE_PRODUCT(productId), {
      ...rest,
    });
  },
  updateProductImage(productId: string, file: any) {
    return axiosClient.patch(
      API_ROUTES.PRODUCT_PICTURE(productId),
      { file: file },
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },
};

export default productService;
