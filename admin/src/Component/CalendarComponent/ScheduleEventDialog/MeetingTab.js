import { useEffect, useState } from "react";
import { Autocomplete, Button, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as yup from 'yup';
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { MSG_REQUIRED_FIELD, ONE_MINUTE_IN_MS } from "../../../utils/contants";
import { Put, Post } from "../../../Axios/AxiosFunctions";
import { BaseURL, apiHeader } from "../../../config/apiUrl";

//  ------------------------------------------------------------------------------------------

const initialValues = {
    zoomEmail: '',
    topic: '',
    startAt: '',
    duration: 10,
    meetingType: 0,
};
const validationSchema = yup.object().shape({
    zoomEmail: yup.string().email().required(MSG_REQUIRED_FIELD),
    topic: yup.string().max(200, '200 characters are available maximum.').required(MSG_REQUIRED_FIELD),
    startAt: yup.string().required(MSG_REQUIRED_FIELD),
    duration: yup.number().required(MSG_REQUIRED_FIELD),
    meetingType: yup.number().required(MSG_REQUIRED_FIELD),
});

//  ------------------------------------------------------------------------------------------

export default function MeetingTab({ scheduler, setLoading, availableInvitees }) {
    const { access_token: accessToken, user } = useSelector((state) => state.authReducer);

    const [startAt, setStartAt] = useState(null);
    const [invitees, setInvitees] = useState([]);

    useEffect(() => {
        if (scheduler) {
            formik.handleReset();
            if (scheduler.edited) {
                const startAtInDate = new Date(scheduler.edited.start);
                const isoString = startAtInDate.toISOString();
                const formattedString = isoString.substring(0, 19) + "Z";
                setStartAt(dayjs(formattedString));

                const endAtInDate = new Date(scheduler.edited.end);

                setInvitees([...scheduler.edited.attendees, ...scheduler.edited.customerAttendees]);
                formik.setValues({
                    ...initialValues,
                    zoomEmail: scheduler.edited.zoomEmail || '',
                    topic: scheduler.edited.agenda || '',
                    startAt: formattedString,
                    duration: (endAtInDate.getTime() - startAtInDate.getTime()) / ONE_MINUTE_IN_MS,
                    meetingType: scheduler.edited.meetingType || 0,
                });
            } else {
                const startAtInDate = new Date(scheduler.state.start.value);
                const isoString = startAtInDate.toISOString();
                const formattedString = isoString.substring(0, 19) + "Z";
                setStartAt(dayjs(formattedString));

                const endAtInDate = new Date(scheduler.state.end.value);
                const duration = (endAtInDate.getTime() - startAtInDate.getTime()) / ONE_MINUTE_IN_MS;

                formik.setValues({
                    ...initialValues,
                    startAt: formattedString,
                    duration,
                });
            }
        } else {
            const startAtInDate = new Date(new Date().getTime() + 10 * ONE_MINUTE_IN_MS);
            const isoString = startAtInDate.toISOString();
            const formattedString = isoString.substring(0, 19) + "Z";
            setStartAt(dayjs(formattedString));

            formik.setValues({
                ...initialValues,
                startAt: formattedString,
                duration: 30,
            });
        }
    }, [scheduler]);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const startAtInDate = new Date(values.startAt);
            const endAtInMs = startAtInDate.getTime() + Number(values.duration) * ONE_MINUTE_IN_MS;
            const endAt = new Date(endAtInMs).toISOString().substring(0, 19) + "Z";

            const reqData = {
                creatorZoomEmail: values.zoomEmail,
                topic: values.topic,
                startAt: values.startAt,
                endAt,
                meetingType: values.meetingType,
                invitees
            };

            try {
                setLoading(true);
                let response = null;

                if (scheduler?.edited) {
                    reqData.calendar = scheduler.edited.event_id || '';
                    response = await Put(BaseURL(`meeting-2/update/${scheduler.edited.meetingId}`), reqData, apiHeader(accessToken));
                    if (response) {
                        if (response.data && typeof response.data !== 'string') {
                            setLoading(false);
                            return toast.success("Success. You've booked a meeting.");
                        } else {
                            setLoading(false);
                            return toast.error(response.data);
                        }
                    }
                } else {
                    reqData.user = user;
                    response = await Post(BaseURL('meeting-2/create'), reqData, apiHeader(accessToken));

                    if (response) {
                        if (response.data && typeof response.data !== 'string') {
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
        }
    });

    const handleInvitees = (e, values) => {
        setInvitees(values);
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack sx={{ gap: 2 }} py={2}>
                <TextField
                    label="Email *"
                    name="zoomEmail"
                    onChange={formik.handleChange}
                    value={formik.values.zoomEmail}
                    error={formik.touched.zoomEmail && Boolean(formik.errors.zoomEmail)}
                    helperText={formik.touched.zoomEmail && formik.errors.zoomEmail}
                />
                <TextField
                    label="Subject *"
                    name="topic"
                    onChange={formik.handleChange}
                    value={formik.values.topic}
                    error={formik.touched.topic && Boolean(formik.errors.topic)}
                    helperText={formik.touched.topic && formik.errors.topic}
                />
                <Grid container spacing={2}>
                    <Grid item sm={6} xs={12}>
                        <DateTimePicker
                            renderInput={(props) => <TextField
                                {...props}
                                fullWidth
                                error={formik.touched.startAt && Boolean(formik.errors.startAt)}
                                helperText={formik.touched.startAt && formik.errors.startAt}
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
                    <MenuItem value={0}>One Time</MenuItem>
                    <MenuItem value={1}>Daily</MenuItem>
                    <MenuItem value={2}>Weekly</MenuItem>
                    <MenuItem value={3}>Monthly</MenuItem>
                </TextField>
                <Autocomplete
                    multiple
                    limitTags={2}
                    options={availableInvitees}
                    getOptionLabel={(i) => `${i.firstName} ${i.lastName}`}
                    filterSelectedOptions
                    renderInput={(params) => (<TextField {...params} label="Invitees" fullWidth />)}
                    onChange={handleInvitees}
                    value={invitees}
                />
                <Stack direction="row" justifyContent="end">
                    <Button onClick={() => formik.handleSubmit()} variant="contained">
                        Book
                    </Button>
                </Stack>
            </Stack>
        </LocalizationProvider>
    )
}