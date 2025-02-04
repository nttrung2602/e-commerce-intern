import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import Register from "../pages/Register";
import { ROUTES } from "./route";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Product from "../pages/Product";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute";
import ProductList from "../pages/ProductList";
import CategoryPage from "../pages/CategoryPage";
import HomeLayout from "../components/HomeLayout";
import News from "../pages/News";
import AboutUs from "../pages/AboutUs";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Route cho Login */}
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Route cho Register */}
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route element={<HomeLayout />}>
          <Route path={ROUTES.PRODUCT} element={<Product />} />
          <Route path={ROUTES.NEWS} element={<News />} />
          <Route path={ROUTES.ABOUT_US} element={<AboutUs />} />
          <Route path={ROUTES.HOME} element={<Product />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          {/* Other child routes here*/}
          <Route element={<AdminProtectedRoute />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />}>
              <Route
                path={ROUTES.PRODUCTS_DASHBOARD}
                element={<ProductList />}
              />
              <Route path={ROUTES.CATEGORIES} element={<CategoryPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
