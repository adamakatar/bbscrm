import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Patch } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { Input } from "../../Component/Input/Input";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import classes from "./UpdatePassword.module.css";
import { saveLoginUserData } from "../../store/auth/authSlice";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const { access_token: token } = useSelector((state) => state?.authReducer);

  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const updatePassword = async () => {
    let body = {
      passwordCurrent,
      password,
      passwordConfirm,
    };
    if (password?.length < 8) {
      return toast.error("Passwords must contain min 8 characters");
    }
    if (
      password !== passwordConfirm ||
      password == "" ||
      passwordConfirm == ""
    ) {
      return toast.error("Please type the passwords correctly");
    }
    setIsUpdating(true);
    const url = BaseURL(`auth/updateMyPassword`);
    const response = await Patch(url, body, apiHeader(token));
    if (response !== undefined) {
      toast.success("Password updated Successfully");
      dispatch(saveLoginUserData(response));
      setPasswordCurrent("");
      setPassword("");
      setPasswordConfirm("");
    }
    setIsUpdating(false);
  };

  return (
    <SideBarSkeleton>
      <div className={classes.mainComtainer}>
        <div className={classes.header_main}>
          <h4>Update Password</h4>
        </div>
        <div className={classes.inputDiv}>
          <Input
            type={"password"}
            placeholder={"Current Password"}
            value={passwordCurrent}
            setter={setPasswordCurrent}
          />
        </div>
        <div className={classes.inputDiv}>
          <Input
            type={"password"}
            placeholder={"New Password"}
            value={password}
            setter={setPassword}
          />
        </div>
        <div className={classes.inputDiv}>
          <Input
            type={"password"}
            placeholder={"Confirm Password"}
            value={passwordConfirm}
            setter={setPasswordConfirm}
          />
        </div>
        <div className={classes.btnDiv}>
          <Button
            onClick={updatePassword}
            disabled={isUpdating}
            label={isUpdating ? "Updating..." : "Update"}
          />
        </div>
      </div>
    </SideBarSkeleton>
  );
};

export default UpdatePassword;
