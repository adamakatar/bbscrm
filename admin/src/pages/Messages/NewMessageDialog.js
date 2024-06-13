import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Stack,
    TextField,
    MenuItem,
    IconButton,
    DialogActions,
    Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Close } from "@mui/icons-material";
import * as yup from 'yup';
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { rolesOptions } from "../../constant/commonData";
import { Get, Post } from "../../Axios/AxiosFunctions";
import { BaseURL, apiHeader } from "../../config/apiUrl";
import { MSG_REQUIRED_FIELD } from "../../utils/contants";
import Loader from "../../Component/Loader";

//  ---------------------------------------------------------------------------------------------

const initialValues = {
    message: ''
};

const validationSchema = yup.object().shape({
    message: yup.string().required(MSG_REQUIRED_FIELD),
});

//  ---------------------------------------------------------------------------------------------


export default function NewMessageDialog({ opened, setOpened }) {
    const { access_token: accessToken } = useSelector((state) => state?.authReducer || {});

    const [users, setUsers] = useState([]);
    const [userRole, setUserRole] = useState(rolesOptions[0].value);
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onClose = () => {
        setOpened(false);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const params = {
                message: values.message,
                userIds: [userId],
            };
            setIsLoading(true)
            Post(BaseURL('chats/start'), params, apiHeader(accessToken))
                .then((res) => {
                    setIsLoading(false);
                    if (res?.data?.data && typeof res?.data?.data === 'object') {
                        toast.success('You message has been sent successfully.');
                        return onClose();
                    }
                    return toast.error('Sending your message occurred an issue. Please try again.');
                })
                .catch((err) => {
                    setIsLoading(false);
                    return toast.error(err.toString());
                });
        },
    });

    useEffect(() => {
        Get(BaseURL(`users/get-all-users-for-room?role=${userRole}`), accessToken)
            .then((res) => {
                setUsers(res?.data?.data || []);
            })
            .catch((err) => { });
    }, [userRole]);

    return (
        <Dialog open={opened} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                <Typography component="h5" variant="h5">
                    New Message
                </Typography>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <Loader />
                ) : (
                    <Stack py={2} spacing={2}>
                        <TextField
                            label="User Type"
                            select
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                        >
                            {rolesOptions.map((o) => (
                                <MenuItem key={o.value} value={o.value}>
                                    {o.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="User"
                            select
                            onChange={(e) => setUserId(e.target.value)}
                            value={userId}
                        >
                            {users.map((u) => (
                                <MenuItem key={u?._id} value={u?._id}>{u.firstName} {u.lastName}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Message"
                            name="message"
                            multiline
                            rows={4}
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            error={formik.touched.message && Boolean(formik.errors.message)}
                            helperText={formik.touched.message && formik.errors.message}
                        />
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    disabled={!userRole || !userId}
                    onClick={formik.handleSubmit}
                >Send</Button>
            </DialogActions>
        </Dialog>
    )
}