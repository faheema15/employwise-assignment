import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import UsersList from "../pages/UsersList";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/userlist" element={<UsersList />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
