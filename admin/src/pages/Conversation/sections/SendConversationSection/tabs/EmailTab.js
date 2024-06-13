import { useState, useEffect } from "react";
import { Stack, Box, Grid, TextField, Button, Typography, Autocomplete, Chip } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MSG_REQUIRED_FIELD } from "../../../../../utils/contants";
import { Post } from "../../../../../Axios/AxiosFunctions";
import { BaseURL } from "../../../../../config/apiUrl";
import Loader from "../../../../../Component/Loader";

//  -------------------------------------------------------------------------------

const initialValues = {
  subject: "",
  content: "",
};

const validationSchema = yup.object().shape({
  subject: yup.string().required(MSG_REQUIRED_FIELD),
  content: yup.string().required(MSG_REQUIRED_FIELD),
});

//  -------------------------------------------------------------------------------

export default function EmailTab({ contacts, currentContact, setConversations, forwardMsg, scrollRef }) {
  const { user, access_token } = useSelector(
    (state) => state?.authReducer || {}
  );

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState([]);
  const [modeCC, setModeCC] = useState(false);

  useEffect(() => {
    if(!currentContact)
      setValue([]);
    else
      setValue([currentContact]);
  }, [currentContact]);

  useEffect(() => {
    if(Object.values(forwardMsg).length > 0) {
      scrollRef?.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
  
      formik.setFieldValue("content", forwardMsg?.text || "");  
      formik.setFieldValue("subject", forwardMsg?.subject || "");
    }
  }, [forwardMsg]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      debugger
      const { subject, content } = values;
      setLoading(true);

      value.map(async idx => {
        await Post(BaseURL("sendgrid/s-send-email"), {
          from: user?.email || user?.imap?.user,
          to: idx?._doc?.email,
          subject,
          emailContent: content,
        })
          .then((res) => {
            setLoading(false);
            if (typeof res.data === "string") {
              return toast.error(res.data);
            }
  
            const { sentAt, from, to, subject, text, _id } = res.data || {};
            const email = {
              type: "email",
              sentAt,
              from,
              to,
              subject,
              text,
              id: _id,
            };
            setConversations((prev) => [...prev, email]);
            onClear();
            return toast.success("Success!");
          })
          .catch((err) => {
            setLoading(false);
            return toast.error(err?.response?.data || err.toString());
          });
      });
    },
  });

  const onClear = () => {
    formik.setFormikState({
      values: initialValues,
      touched: false,
    });
  };

  const handleSelectChange = (event, va) => {
    setValue(typeof va === 'string' ? va.split(',') : va);
  };

  const handleCC = () => {
    setModeCC(true);
  };

  const handleBCC = () => {
    setModeCC(false);
  };

  return (
    <Stack spacing={2}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <TextField
                  label="From Name"
                  name="fullname"
                  variant="outlined"
                  fullWidth
                  value={`${user?.firstName} ${user?.lastName}`}
                  readonly
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  label="From Email"
                  type="email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  value={user?.email || ""}
                  readonly
               />                
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" flexDirection="row" sx={{ gap: '5px'}}>
            <Autocomplete
                multiple
                limitTags={2}
                id="multiple-email"
                options={contacts}
                value={value}
                onChange={handleSelectChange}
                defaultChecked={[contacts[0]]}
                getOptionLabel={(option) => option?._doc?.email || ''}
                renderInput={(params) => (
                  <TextField {...params} label="To Email" placeholder=""/>
                )}
                sx={{ width: '100%'}}
            />

          </Box>

          <TextField
            label="Subject"
            name="subject"
            onChange={formik.handleChange}
            value={formik.values.subject}
            error={formik.touched.subject && !!formik.errors.subject}
            helperText={formik.touched.subject && formik.errors.subject}
            fullWidth
            variant="outlined"
          />

          <Stack spacing={1}>
            <CKEditor
              name="content"
              editor={ClassicEditor}
              data={formik.values.content}
              onChange={(_, editor) => {
                const data = editor.getData();
                formik.setFieldValue("content", data);
              }}
            />
            {formik.touched.content && !!formik.errors.content ? (
              <Typography color="error" fontSize={12}>
                {formik.touched.content && formik.errors.content}
              </Typography>
            ) : (
              <></>
            )}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            spacing={1}
          >
            <Button
              variant="outlined"
              onClick={onClear}
              disabled={!currentContact || !value}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={ e => { 
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              Send
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}
