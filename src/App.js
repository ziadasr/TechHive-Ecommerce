import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Details from "./components/Details";
import Cart from "./components/Cart";
import Default from "./components/Default";
import Modal from "./components/Modal";
import AddItem from "./components/admins/additems/additems";
import { ThemeConsumer } from "./components/context/ThemeContexts";
import Login from "./components/admins/admin login/log-in";
import AdminDashboard from "./components/admins/dashboard/AdminDashboard";
import UserLogin from "./components/useracc/userlogin";
import Registration from "./components/useracc/registeration";
import Verify from "./components/useracc/verify";
import ForgetPassword from "./components/useracc/forgetpassword";
import NewPassword from "./components/useracc/newpassword";
import LoginRequiredModal from "./components/Cart/loginrequiredmodal";
import { ProductConsumer } from "./context";
import SubmitOrder from "./components/orders/submit-order";
import { useNavigate } from "react-router-dom";
import SubmittedOrder from "./components/orders/submittedorder";
import MessageModal from "./components/Cart/MessageModal";
import UserProfile from "./components/useracc/userprofile";
import OrdersTable from "./components/admins/dashboard/orderstable";
function App() {
  const navigate = useNavigate();
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <React.Fragment>
          <div className={theme ? "h-fit bg-slate-900" : "h-fit"}>
            <Navbar />
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/details" element={<Details />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin/add-items" element={<AddItem />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
              <Route path="/newpassword" element={<NewPassword />} />
              <Route path="/submit-order" element={<SubmitOrder />} />
              <Route path="/order-submitted" element={<SubmittedOrder />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/admin/orders" element={<OrdersTable />} />
              <Route path="*" element={<Default />} />
            </Routes>
            <ProductConsumer>
              {(value) => (
                <>
                  <LoginRequiredModal
                    show={value.showLoginModal}
                    onClose={value.closeLoginModal}
                    onLogin={() => {
                      value.closeLoginModal();
                      navigate("/login");
                    }}
                  />
                  <MessageModal
                    open={value.messageModalOpen}
                    message={value.messageModalText}
                    onClose={value.closeMessageModal}
                  />
                </>
              )}
            </ProductConsumer>
            <Modal />
          </div>
        </React.Fragment>
      )}
    </ThemeConsumer>
  );
}

export default App;
