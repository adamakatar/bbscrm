import { useState } from "react";
import { Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import * as yup from 'yup';
import { useFormik } from "formik";
import { MSG_REQUIRED_FIELD } from "../../../utils/contants";
import { REGEXP_FOR_NUMBERS } from "../../../utils/regExpes";
import { Post } from "../../../Axios/AxiosFunctions";
import { BaseURL } from "../../../config/apiUrl";
import Loader from "../../../Component/Loader";

//  -------------------------------------------------------------------------------

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
};

const validationSchema = yup.object().shape({
    firstName: yup.string().required(MSG_REQUIRED_FIELD),
    lastName: yup.string().required(MSG_REQUIRED_FIELD),
    phone: yup.string().required(MSG_REQUIRED_FIELD),
    email: yup.string().email().required(MSG_REQUIRED_FIELD),
    role: yup.string().required(MSG_REQUIRED_FIELD),
});

const ROLES = [
    'broker',
    'seller',
    'buyer',
    'admin',
    'landlord',
    'lawyer',
    'accountant',
    'job applicant',
    'title company',
    '3rd party contact',
    'service provider'
];

//  -------------------------------------------------------------------------------

export default function AddContactDialog({ open, setOpen }) {
    const [loading, setLoading] = useState(false);

    const onClose = () => {
        setOpen(false);

        formik.setFormikState({
            values: initialValues,
            touched: false,
        });
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const { firstName, lastName, phone, email, role } = values;

            if (phone.length != 10) {
                return toast.error('Please input valid phone number.');
            }
            
            Post(BaseURL('communication/contact-regist'), {
                firstName, lastName, contact: `+1${phone}`, email, role: role.replaceAll(" ", '-'),
            })
            .then((res) => {
                setLoading(false);

                onClose();
                if(typeof res?.data != 'undefined')
                    toast.success('Added successfully.');
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err.toString());
            })
        }
    });

    const onChangePhone = (e) => {
        if ((REGEXP_FOR_NUMBERS.test(e.target.value) || !e.target.value) && e.target.value.length <= 10) {
            formik.setFieldValue('phone', e.target.value);
        }
    }

    const onPastePhone = (e) => {
        let phoneNumber = e?.clipboardData?.getData('text/plain');
        phoneNumber = phoneNumber.replace("+1", "");
        formik.setFieldValue('phone', phoneNumber);
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                <Typography component="h5" variant="h5">
                    Add New Contact
                </Typography>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            {loading ? (
                <Loader />
            ) : (
                <>
                    <DialogContent>
                        <Box py={2}>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    <TextField
                                        name="firstName"
                                        label="First Name"
                                        onChange={formik.handleChange}
                                        value={formik.values.firstName}
                                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                        helperText={formik.touched.firstName && formik.errors.firstName}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <TextField
                                        name="lastName"
                                        label="Last Name"
                                        onChange={formik.handleChange}
                                        value={formik.values.lastName}
                                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                        helperText={formik.touched.lastName && formik.errors.lastName}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <TextField
                                        type="email"
                                        name="email"
                                        label="Email"
                                        onChange={formik.handleChange}
                                        value={formik.values.email}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <TextField
                                        name="phone"
                                        label="Phone"
                                        onPasteCapture={onPastePhone}
                                        onChange={onChangePhone}
                                        value={formik.values.phone}
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        helperText={formik.touched.phone && formik.errors.phone}
                                        InputProps={{
                                            startAdornment: '+1',
                                        }}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item md={12}>
                                    <TextField
                                        name="role"
                                        label="Contact Type"
                                        fullWidth
                                        select
                                        value={formik.values.role}
                                        onChange={formik.handleChange}
                                        error={formik.touched.role && Boolean(formik.errors.role)}
                                        helperText={formik.touched.role && formik.errors.role}
                                    >
                                        {ROLES.map((r) => (
                                            <MenuItem key={r} value={r} sx={{ textTransform: 'capitalize' }}>{r}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="contained" onClick={formik.handleSubmit}>Submit</Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
}
