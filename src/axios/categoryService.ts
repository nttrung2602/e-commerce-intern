import { API_ROUTES } from "../routes/route";
import axiosClient from "./axiosClient";
import { Category } from "./types";

const categoryService = {
  getAllCategory() {
    return axiosClient.get<Category[]>(API_ROUTES.CATEGORY);
  },
  addNewCategory(name: string) {
    return axiosClient.post(API_ROUTES.ADD_CATEGORY, { name: name });
  },
  updateCategory(data: Category) {
    return axiosClient.patch(API_ROUTES.UPDATE_CATEGORY_BY_ID(data.id!), {
      name: data.name,
    });
  },
  deleteCategory(id: string) {
    return axiosClient.delete(API_ROUTES.DELETE_CATEGORY_BY_ID(id));
  },
};

export default categoryService;
