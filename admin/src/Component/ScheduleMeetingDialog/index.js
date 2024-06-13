import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Post, Put } from "../../Axios/AxiosFunctions";
import { BaseURL, apiHeader } from "../../config/apiUrl";
import { MSG_REQUIRED_FIELD } from "../../utils/contants";

//  ------------------------------------------------------------------------------------------

const initialValues = {
  zoomEmail: "",
  topic: "",
  startAt: "",
  duration: 10,
  meetingType: 0,
};
const validationSchema = yup.object().shape({
  zoomEmail: yup.string().email().required(MSG_REQUIRED_FIELD),
  topic: yup
    .string()
    .max(200, "200 characters are available maximum.")
    .required(MSG_REQUIRED_FIELD),
  startAt: yup.string().required(MSG_REQUIRED_FIELD),
  duration: yup.number().required(MSG_REQUIRED_FIELD),
  meetingType: yup.number().required(MSG_REQUIRED_FIELD),
});

//  ------------------------------------------------------------------------------------------

export default function ScheduleMeetingDialog({
  scheduler,
  users,
  setLoading,
  meetings,
  setMeetings,
}) {
  const { user } = useSelector((state) => state.authReducer);
  const accessToken = useSelector((state) => state.authReducer?.access_token);

  const [startAt, setStartAt] = useState(null);
  const [invitees, setInvitees] = useState([]);
  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    if (scheduler) {
      if (scheduler.edited) {
        const startAtInDate = new Date(scheduler.edited.start);
        const isoString = startAtInDate.toISOString();
        const formattedString = isoString.substring(0, 19) + "Z";
        setStartAt(dayjs(formattedString));

        const endAtInDate = new Date(scheduler.edited.end);

        const _meeting = meetings.find(
          (m) => m._id === scheduler.edited.event_id
        );

        setMeeting(_meeting);
        setInvitees(_meeting.invitees);

        formik.setValues({
          ...initialValues,
          zoomEmail: _meeting.creatorZoomEmail,
          topic: _meeting.topic,
          startAt: formattedString,
          duration: (endAtInDate.getTime() - startAtInDate.getTime()) / 60000,
          meetingType: _meeting.meetingType,
        });
      } else {
        const startAtInDate = new Date(scheduler.state.start.value);
        const isoString = startAtInDate.toISOString();
        const formattedString = isoString.substring(0, 19) + "Z";
        setStartAt(dayjs(formattedString));

        const endAtInDate = new Date(scheduler.state.end.value);
        const duration =
          (endAtInDate.getTime() - startAtInDate.getTime()) / 60000;

        formik.setValues({
          ...initialValues,
          startAt: formattedString,
          duration,
        });
      }
    }
  }, [scheduler]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const startAtInDate = new Date(values.startAt);
      const endAtInMs =
        startAtInDate.getTime() + Number(values.duration) * 60000;
      const endAt = new Date(endAtInMs).toISOString().substring(0, 19) + "Z";

      const reqData = {
        creatorZoomEmail: values.zoomEmail,
        topic: values.topic,
        startAt: values.startAt,
        endAt,
        meetingType: values.meetingType,
        invitees,
      };

      try {
        setLoading(true);
        let response = null;

        if (scheduler.edited) {
          reqData.calendar = meeting.calendar;
          response = await Put(
            BaseURL(`meeting-2/update/${scheduler.edited.event_id}`),
            reqData,
            apiHeader(accessToken)
          );
          if (response) {
            if (response.data && typeof response.data !== "string") {
              const _meetings = [...meetings];
              const indexOfMeeting = _meetings.findIndex(
                (m) => m._id === scheduler.edited.event_id
              );

              if (indexOfMeeting >= 0) {
                _meetings.splice(indexOfMeeting, 1, response.data);
                setMeetings(_meetings);
              }
              setLoading(false);
              return toast.success("Success. You've booked a meeting.");
            } else {
              setLoading(false);
              return toast.error(response.data);
            }
          }
        } else {
          reqData.user = user;
          response = await Post(
            BaseURL("meeting-2/create"),
            reqData,
            apiHeader(accessToken)
          );

          if (response) {
            if (response.data && typeof response.data !== "string") {
              setMeetings([...meetings, response.data]);
              setLoading(false);
              return toast.success("Success. You've booked a meeting.");
            } else {
              setLoading(false);
              return toast.error(response.data);
            }
          }
        }
        setLoading(false);
        return toast.error("Failed. Your booking has been failed.");
      } catch (error) {
        setLoading(false);
        return toast.error("Failed. Your booking has been failed.");
      }
    },
  });

  const handleClose = () => {
    formik.handleReset();
    scheduler.close();
  };

  const handleInvitees = (e, values) => {
    setInvitees(values);
  };

  useEffect(() => {
    if (startAt) {
      const startAtInDate = new Date(
        dayjs(startAt).format("YYYY-MM-DD HH:mm:ss:SSS")
      );
      const isoString = startAtInDate.toISOString();
      const formattedString = isoString.substring(0, 19) + "Z";
      formik.setFieldValue("startAt", formattedString);
    }
  }, [startAt]);

  return (
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
            label="Topic *"
            name="topic"
            onChange={formik.handleChange}
            value={formik.values.topic}
            error={formik.touched.topic && Boolean(formik.errors.topic)}
            helperText={formik.touched.topic && formik.errors.topic}
          />
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    {...props}
                    fullWidth
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                )}
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
                error={
                  formik.touched.duration && Boolean(formik.errors.duration)
                }
                helperText={formik.touched.duration && formik.errors.duration}
                InputProps={{
                  endAdornment: <Typography>min</Typography>,
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
            error={
              formik.touched.meetingType && Boolean(formik.errors.meetingType)
            }
            helperText={formik.touched.meetingType && formik.errors.meetingType}
          >
            <MenuItem value={1}>Daily</MenuItem>
            <MenuItem value={2}>Weekly</MenuItem>
            <MenuItem value={3}>Monthly</MenuItem>
          </TextField>
          <Autocomplete
            multiple
            limitTags={2}
            options={users}
            getOptionLabel={(i) => i.email}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="Invitees" fullWidth />
            )}
            onChange={handleInvitees}
            value={invitees}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => formik.handleSubmit()}>
          Book
        </Button>
      </DialogActions>
    </LocalizationProvider>
  );
}
