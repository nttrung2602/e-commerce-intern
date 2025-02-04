import { useEffect } from "react";
import "./App.css";
import AppRouter from "./routes/RoutesConfig";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "./slices/auth/loginStatus";

function App() {
  console.log("Helloooooooooooooooooooo");
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("access_token");
  useEffect(() => {
    const checkLoginStatus = async () => {
      if (token) dispatch(setLoginStatus("loggedIn")); // Cập nhật Redux state
    };
    checkLoginStatus();
  }, []);

  return <AppRouter />;
}

export default App;
