import { useEffect, useState } from "react";
import { Autocomplete, Button, FormControlLabel, Grid, Stack, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from "formik";
import * as yup from 'yup';
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MSG_ERROR, MSG_REQUIRED_FIELD, ONE_MINUTE_IN_MS, TYPE_EVENT } from "../../../utils/contants";
import { Patch, Post } from "../../../Axios/AxiosFunctions";
import { BaseURL, apiHeader } from "../../../config/apiUrl";

//  -----------------------------------------------------------------------------------------

const initialValues = {
    name: '',
    color: '#000000',
    venue: '',
    agenda: '',
    description: '',
    date: '',
}

const validationSchema = yup.object().shape({
    name: yup.string().required(MSG_REQUIRED_FIELD),
    venue: yup.string().required(MSG_REQUIRED_FIELD),
    agenda: yup.string().required(MSG_REQUIRED_FIELD),
    description: yup.string().required(MSG_REQUIRED_FIELD),
});

//  -----------------------------------------------------------------------------------------

export default function OthersTab({ scheduler, setLoading }) {
    const { allBrokers } = useSelector((state) => state?.commonReducer);
    const { allOwners } = useSelector((state) => state?.commonReducer);
    const { user, access_token: accessToken } = useSelector((state) => state?.authReducer);

    const [attendees, setAttendees] = useState([]);
    const [customerAttendees, setCustomerAttendees] = useState([]);
    const [dateTime, setDateTime] = useState(null);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const reqData = {
                creator: user?._id,
                name: values.name || '',
                color: values.color || '',
                venue: values.venue || '',
                description: values.description || '',
                date: values.date || '',
                type: TYPE_EVENT,
                agenda: values.agenda || '',
                attendees: attendees?.map((item) => item?._id),
                customerAttendees: customerAttendees?.map((item) => item?._id),
            };

            customerAttendees.forEach(async e => {
                await Post(BaseURL("sendgrid/s-send-email"), {
                    from: user?.email || user?.imap?.user,
                    to: e?.email,
                    subject: 'Headsup',
                    emailContent: `
                        Hi ${e?.firstName} ${e?.lastName}.
                        An appointment is organized at ${values.date}.
                        Regards.
                    `,
                });    
            });
      
            setLoading(true)
            if (scheduler?.edited) {
                return Patch(BaseURL(`events/update/${scheduler.edited.event_id}`), reqData, apiHeader(accessToken))
                    .then((res) => {
                        setLoading(false);
                        if (typeof res?.data === 'object') {
                            return toast.success('Success! The event was saved.');
                        } else {
                            return toast.error(MSG_ERROR);
                        }
                    })
                    .catch((error) => {
                        setLoading(false);
                        return toast.error(MSG_ERROR);
                    });
            }
            return Post(BaseURL('events/create'), reqData, apiHeader(accessToken))
                .then((res) => {
                    setLoading(false);
                    if (typeof res?.data === 'object') {
                        return toast.success('Success! The event was saved.');
                    } else {
                        return toast.error(MSG_ERROR);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    return toast.error(MSG_ERROR);
                });
        }
    })

    useEffect(() => {
        if (dateTime) {
            const dtInStr = new Date(dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss:SSS'));
            const isoString = dtInStr.toISOString();
            const formattedString = isoString.substring(0, 19) + "Z";
            formik.setFieldValue('date', formattedString);
        }
    }, [dateTime]);

    useEffect(() => {
        if (scheduler) {
            formik.handleReset();
            if (scheduler.edited) {
                const dtInStr = new Date(scheduler.edited.start);
                const isoString = dtInStr.toISOString();
                const formattedString = isoString.substring(0, 19) + "Z";
                setDateTime(dayjs(formattedString));

                setAttendees(scheduler.edited.attendees);
                setCustomerAttendees(scheduler.edited.customerAttendees);

                formik.setValues({
                    ...initialValues,
                    name: scheduler.edited.title,
                    color: scheduler.edited.color,
                    venue: scheduler.edited.venue,
                    agenda: scheduler.edited.agenda,
                    description: scheduler.edited.description,
                    date: formattedString,
                })
            } else {
                const dtInStr = new Date(scheduler.state.start.value);
                const isoString = dtInStr.toISOString();
                const formattedString = isoString.substring(0, 19) + "Z";
                setDateTime(dayjs(formattedString));

                formik.setValues({
                    ...initialValues,
                    date: formattedString,
                });
            }
        } else {
            const startAtInDate = new Date(new Date().getTime() + 10 * ONE_MINUTE_IN_MS);
            const isoString = startAtInDate.toISOString();
            const formattedString = isoString.substring(0, 19) + "Z";
            setDateTime(dayjs(formattedString));

            formik.setValues({
                ...initialValues,
                date: formattedString,
            });
        }
    }, [scheduler])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack gap={2} py={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <TextField
                        label="Event Name *"
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        fullWidth
                    />

                    <FormControlLabel
                        label="Color"
                        labelPlacement="end"
                        sx={{ gap: 2 }}
                        control={
                            <input
                                type="color"
                                name="color"
                                onChange={formik.handleChange}
                                value={formik.values.color}
                            />
                        }
                    />
                </Stack>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Agenda *"
                            name="agenda"
                            onChange={formik.handleChange}
                            value={formik.values.agenda}
                            error={formik.touched.agenda && Boolean(formik.errors.agenda)}
                            helperText={formik.touched.agenda && formik.errors.agenda}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Where *"
                            name="venue"
                            onChange={formik.handleChange}
                            value={formik.values.venue}
                            error={formik.touched.venue && Boolean(formik.errors.venue)}
                            helperText={formik.touched.venue && formik.errors.venue}
                            fullWidth
                        />
                    </Grid>
                </Grid>

                <TextField
                    multiline
                    minRows={3}
                    label="Description *"
                    name="description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />
                <DateTimePicker
                    renderInput={(props) => <TextField
                        {...props}
                        fullWidth
                        error={formik.touched.date && Boolean(formik.errors.date)}
                        helperText={formik.touched.date && formik.errors.date}
                    />}
                    label="Date & Time *"
                    name="date"
                    value={dateTime}
                    onChange={(newValue) => setDateTime(newValue)}
                />
                <Autocomplete
                    multiple
                    limitTags={2}
                    options={allBrokers}
                    getOptionLabel={(i) => `${i.firstName} ${i.lastName}`}
                    filterSelectedOptions
                    renderInput={(params) => (<TextField {...params} label="Attendees" fullWidth />)}
                    onChange={(_, values) => setAttendees(values)}
                    value={attendees}
                />
                <Autocomplete
                    multiple
                    limitTags={2}
                    options={allOwners}
                    getOptionLabel={(i) => `${i.firstName} ${i.lastName}`}
                    filterSelectedOptions
                    renderInput={(params) => (<TextField {...params} label="Customers" fullWidth />)}
                    onChange={(_, values) => setCustomerAttendees(values)}
                    value={customerAttendees}
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