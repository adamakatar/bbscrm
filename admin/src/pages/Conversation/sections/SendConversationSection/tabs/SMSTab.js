import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MSG_REQUIRED_FIELD } from "../../../../../utils/contants";
import { Post } from "../../../../../Axios/AxiosFunctions";
import { BaseURL, apiHeader } from "../../../../../config/apiUrl";
import Loader from "../../../../../Component/Loader";

//  -------------------------------------------------------------------------------

const initialValues = {
  content: "",
};

const validationSchema = yup.object().shape({
  content: yup.string().required(MSG_REQUIRED_FIELD),
});

//  -------------------------------------------------------------------------------

export default function SMSTab({ currentContact, setConversations }) {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer || {}
  );

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      const { content } = values;
      let to = "";

      if (typeof currentContact?._doc?.contact === "string") {
        const { contact: phoneNumber } = currentContact._doc;
        to = phoneNumber[0] === "+" ? phoneNumber : `+1${phoneNumber}`;
      }

      Post(
        BaseURL("communication/s-send-sms"),
        { body: content, to },
        apiHeader(accessToken)
      )
        .then((res) => {
          setLoading(false);
          if (typeof res.data === "string") {
            return toast.error(res.data);
          }

          setConversations((prev) => [
            {
              type: "sms",
              sentAt: res?.data?.dateCreated,
              from: res?.data?.from,
              to: res?.data?.to,
              status: res?.data?.status,
              direction: res?.data?.direction,
              body: res?.data?.body,
            },
            ...prev,
          ]);
          onClear();
          return toast.success("Submitted.");
        })
        .catch((err) => {
          setLoading(false);
          return toast.error(err?.response?.data || err.toString());
        });
    },
  });

  const onClear = () => {
    formik.setFormikState({
      values: initialValues,
      touched: false,
    });
  };

  return (
    <Stack spacing={2}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TextField
            name="content"
            placeholder="Input your content to send SMS"
            multiline
            minRows={3}
            onChange={formik.handleChange}
            value={formik.values.content}
            error={formik.touched.content && !!formik.errors.content}
            helperText={formik.touched.content && formik.errors.content}
          />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            spacing={1}
          >
            <Button
              variant="outlined"
              onClick={onClear}
              disabled={!currentContact}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={formik.handleSubmit}
              disabled={!currentContact}
            >
              Send
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}
