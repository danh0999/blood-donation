import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/components/MainLayout";
import RegisterForm from "../src/features/auth/pages/RegisterForm";
import LoginForm from "../src/features/auth/pages/LoginForm";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="login" element={<LoginForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
