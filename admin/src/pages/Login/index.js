import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import ForgotPasswordModal from "../../modals/ForgotPasswordModal";
import { saveLoginUserData } from "../../store/auth/authSlice";
import classes from "./Login.module.css";

const Login = () => {
  const { fcmToken } = useSelector((state) => state?.authReducer);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const headers = apiHeader();

  const handleLogin = async () => {
    const params = {
      email,
      password,
    };
    if (params["password"]?.length < 8) {
      return toast.error("Password must contain min 8 characters");
    }
    for (let key in params) {
      if (params[key] == "") {
        return toast.error("Please fill all the required fields!");
      }
    }
    const url = BaseURL("auth/admin/login");
    setLoading(true);
    const response = await Post(url, params, headers);
    if (response !== undefined) {
      await dispatch(saveLoginUserData(response?.data));
    }
    setLoading(false);
  };
  return (
    <div className={[classes.mainContainer]}>
      <div className={[classes.innerContainer]}>
        <Row>
          <Col md={12}>
            <div className={classes.loginText}>
              <h3>LOGIN</h3>
            </div>
          </Col>
          <Col md={12}>
            <div className={[classes.inputCol]}>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                setter={setEmail}
                label={"Email"}
              />
            </div>
            <div className={[classes.inputCol]}>
              <Input
                placeholder="Password"
                value={password}
                setter={setPassword}
                type="password"
                label={"Password"}
              />
            </div>
            <div className={[classes.inputCol]}>
              <p className={classes.link} onClick={() => setIsModalOpen(true)}>
                Forgot Password?
              </p>
            </div>

            <Button
              className={classes.loginBtn}
              label={loading ? "SUBMITTING..." : "LOGIN"}
              onClick={handleLogin}
              disabled={loading}
            />
          </Col>
        </Row>
      </div>
      {isModalOpen && (
        <ForgotPasswordModal show={isModalOpen} setShow={setIsModalOpen} />
      )}
    </div>
  );
};

export default Login;
