import { useEffect, useMemo, useState } from "react";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as yup from 'yup';
import { useFormik } from "formik";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MSG_REQUIRED_FIELD } from "../../utils/contants";
import { Post } from "../../Axios/AxiosFunctions";
import { BaseURL, apiHeader } from "../../config/apiUrl";

//  ------------------------------------------------------------------------------------------

const validationSchema = yup.object().shape({
  zoomEmail: yup.string().email().required(MSG_REQUIRED_FIELD),
  title: yup.string().required(MSG_REQUIRED_FIELD),
  startAt: yup.string().required(MSG_REQUIRED_FIELD),
  duration: yup.number().required(MSG_REQUIRED_FIELD),
  meetingType: yup.number().required(MSG_REQUIRED_FIELD)
});

const initialValues = {
  zoomEmail: '',
  title: '',
  description: '',
  startAt: '',
  duration: 10,
  meetingType: 0
};

//  ------------------------------------------------------------------------------------------

export default function BookMeetingDialog({ open, setOpen }) {
  const accessToken = useSelector((state) => state.authReducer?.access_token);
  const { user } = useSelector((state) => state?.authReducer);
  const { allBrokers } = useSelector(
    (state) => state?.commonReducer
  );
  const [startAt, setStartAt] = useState(null);
  const [meetingInvitees, setMeetingInvitees] = useState([]);
  const [attendees, setAttendees] = useState([]);

  const teammates = useMemo(() => {
    const isAdmin = !user?.role?.includes("broker");
    if (isAdmin) {
      return allBrokers;
    } else {
      return allBrokers?.filter((item) => item?._id !== user?._id);
    }
  }, [allBrokers, user]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log('>>>>>>>>>> startAt => ', startAt);
      console.log('>>>>>>>>>> values => ', values);
      const meetingDetails = {
        topic: values.title,
        type: values.meetingType,
        startAt: values.startAt,
        duration: values.duration,
        zoomEmail: values.zoomEmail,
        meetingInvitees
      };
      const eventData = {
        payload: {
          creator: user._id,
          attendees,
          type: 'event',
          name: values.title,
          agenda: values.title,
          description: values.description,
          date: values.startAt,
          color: '#fc9c02'
        },
        user
      };

      console.log('>>>>>>>> meetingDetails => ', meetingDetails);

      try {
        const response = await Post(BaseURL('book-meeting'), { meetingDetails, eventData }, apiHeader(accessToken));
        console.log('>>>>>>>>>> response => ', response);
        if (response) {
          return toast.success("Success. You've booked a meeting.");
        } else {
          return toast.error("Failed. Your booking has been failed.");
        }
      } catch (error) {
        console.log('>>>>>>>> error => ', error);
        toast.error("Failed. Your booking has been failed.");
      }
    }
  });

  const handleClose = () => {
    formik.handleReset();
    setOpen(false);
  };

  const handleTeammates = (e, values) => {
    const invitees = values.map(value => ({ email: value.email }));
    console.log('>>>>>>>>>> invitees => ', invitees);
    setMeetingInvitees(invitees);
    setAttendees(values);
  };

  useEffect(() => {
    if (startAt) {
      const startAtInDate = new Date(dayjs(startAt).format('YYYY-MM-DD HH:mm:ss:SSS'));
      const isoString = startAtInDate.toISOString();
      const formattedString = isoString.substring(0, 19) + "Z";
      formik.setFieldValue('startAt', formattedString);
    }
  }, [startAt]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogTitle>Book a Meeting</DialogTitle>
        <DialogContent>
          <Stack sx={{ gap: 2 }} py={2}>
            <TextField
              label="Zoom Email *"
              name="zoomEmail"
              onChange={formik.handleChange}
              value={formik.values.zoomEmail}
              error={formik.touched.zoomEmail && Boolean(formik.errors.zoomEmail)}
              helperText={formik.touched.zoomEmail && formik.errors.zoomEmail}
            />
            <TextField
              label="Title *"
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              label="Description"
              name="description"
              multiline
              minRows={4}
              onChange={formik.handleChange}
              value={formik.values.description}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <DateTimePicker
                  renderInput={(props) => <TextField
                    {...props}
                    fullWidth
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />}
                  label="Start at *"
                  name="startAt"
                  value={startAt}
                  onChange={(newValue) => setStartAt(newValue)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  label="Duration"
                  name="duration"
                  onChange={formik.handleChange}
                  value={formik.values.duration}
                  error={formik.touched.duration && Boolean(formik.errors.duration)}
                  helperText={formik.touched.duration && formik.errors.duration}
                  InputProps={{
                    endAdornment: <Typography>min</Typography>
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              select
              label="Meeting Type"
              name="meetingType"
              onChange={formik.handleChange}
              value={formik.values.meetingType}
              error={formik.touched.meetingType && Boolean(formik.errors.meetingType)}
              helperText={formik.touched.meetingType && formik.errors.meetingType}
            >
              <MenuItem value={1}>Daily</MenuItem>
              <MenuItem value={2}>Weekly</MenuItem>
              <MenuItem value={3}>Monthly</MenuItem>
            </TextField>
            <Autocomplete
              multiple
              limitTags={2}
              options={teammates}
              getOptionLabel={(teammate) => teammate.email}
              filterSelectedOptions
              renderInput={params => (
                <TextField {...params} label="Teammates" fullWidth />
              )}
              onChange={handleTeammates}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => handleClose()}>Cancel</Button>
          <Button variant="contained" onClick={() => formik.handleSubmit()}>Book</Button>
        </DialogActions>
      </LocalizationProvider>
    </Dialog>
  );
}