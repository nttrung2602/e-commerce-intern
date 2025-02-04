export const ROUTES = {
  DEFAULT: "*",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  USERS: "/dashboard/users",
  ORDERS: "/dasboard/orders",
  CATEGORIES: "/dashboard/categories",
  PRODUCTS_DASHBOARD: "/dashboard/products",
  CREATE_PRODUCT: "/product/create",
  EDIT_PRODUCT: "/product/edit/:id",
  PRODUCT: "/product",
  PRODUCT_DETAIL: `/product/detail/:urlname`,

  ABOUT_US: "/about",
  NEWS: "/news",
  HOME: "/",
  PROFILE: "/profile",
};

export const API_ROUTES = {
  // User routes
  ADD_USER: "/user",
  CHECK_ROLE: "/user",
  USER_PROFILE: "/user",

  // Product routes
  PRODUCTS: "/product",
  ADD_NEW_PRODUCT: "/product",
  DELETE_PRODUCT: (id: string) => `/product/${id}`,
  UPDATE_PRODUCT: (id: string) => `/product/${id}`,
  GET_PRODUCT_BY_ID: (id: string) => `/product/id/${id}`,
  GET_PRODUCT_BY_URL_NAME: (urlName: string) => `/product/${urlName}`,

  PRODUCT_PICTURE: (id: string) => `/product/picture/${id}`,

  // Authentication routes
  LOGIN: "/login",
  REFRESH_TOKEN: "/refresh",

  // Category routes
  CATEGORY: "/category",
  ADD_CATEGORY: "/category",
  UPDATE_CATEGORY_BY_ID: (id: string) => `/category/${id}`,
  DELETE_CATEGORY_BY_ID: (id: string) => `/category/${id}`,

  // payment, purchase route
  CHECK_MY_BANK_HISTORY: "https://oauth.casso.vn/v2/transactions",
  CREATE_NEW_PURCHASE: "/purchase",
};
