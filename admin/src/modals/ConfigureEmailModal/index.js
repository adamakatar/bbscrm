import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Stack, TextField } from "@mui/material";
import * as yup from 'yup';
import { useFormik } from "formik";
import { Patch } from "../../Axios/AxiosFunctions";
import { apiHeader, BaseURL } from "../../config/apiUrl";
import { updateUser } from "../../store/auth/authSlice";
import { MSG_ERROR, MSG_REQUIRED_FIELD } from '../../utils/contants';
import Loader from '../../Component/Loader';

//  ------------------------------------------------------------------------------------------

const initialValues = {
  nickname: '',
  email: '',
  password: '',
};

const validationSchema = yup.object().shape({
  nickname: yup.string().required(MSG_REQUIRED_FIELD),
  email: yup.string().email().required(MSG_REQUIRED_FIELD),
  password: yup.string().required(MSG_REQUIRED_FIELD),
});

//  ------------------------------------------------------------------------------------------

const ConfigureEmailModal = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const { access_token: token, user } = useSelector(
    (state) => state?.authReducer
  );
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { nickname, email, password } = values;
      const url = BaseURL(`users/update-imap`);
      const params = {
        nickname,
        user: email,
        password,
      };
      setLoading(true);
      Patch(url, params, apiHeader(token))
        .then((response) => {
          setLoading(false);
          setShow(false);
          if (typeof response?.data === 'object') {
            console.log('>>>>>>>> response.data => ', response.data);
            dispatch(updateUser(response?.data));
            return toast.success("Successfully configured. Please check the inbox of the configured email and verify clicking the link from sendgrid.");
          }
          return toast.error(response?.data || MSG_ERROR);
        })
        .catch(() => {
          toast.error(MSG_ERROR)
        })
    }
  });

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    if (user?.imap) {
      formik.setFieldValue('email', user.imap.user || '');
      formik.setFieldValue('password', user.imap.password || '');
    }
  }, [user]);

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Configure Your Email</DialogTitle>
      <DialogContent>
        {loading ? (
          <Loader />
        ) : (
          <Stack spacing={2} py={2}>
            <TextField
              name="nickname"
              label="Nickname"
              onChange={formik.handleChange}
              value={formik.values.nickname}
              error={formik.touched.nickname && Boolean(formik.errors.nickname)}
              helperText={formik.touched.nickname && formik.errors.nickname}
              fullWidth
            />
            <TextField
              name="email"
              type="email"
              label="Email"
              onChange={formik.handleChange}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
            />
            <TextField
              name="password"
              type="password"
              label="Password"
              onChange={formik.handleChange}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              fullWidth
            />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={loading}
        >{loading ? 'Loading...' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  )
};

export default ConfigureEmailModal;
