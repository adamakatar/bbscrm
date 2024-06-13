import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    TextField,
    Stack,
    MenuItem,
    Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from 'yup';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MSG_ERROR, MSG_REQUIRED_FIELD } from "../../utils/contants";
import { Patch } from "../../Axios/AxiosFunctions";
import { BaseURL, apiHeader } from "../../config/apiUrl";
import Loader from '../../Component/Loader';

//  ------------------------------------------------------------------------------------------

const ROLES = [
    {
        label: 'Admin',
        value: 'admin',
    },
    {
        label: 'Financial analyst',
        value: 'financial-analyst',
    },
    {
        label: 'Buyer concierge',
        value: 'buyer-concierge',
    },
    {
        label: 'Seller concierge',
        value: 'seller-concierge',
    },
    {
        label: 'Executive',
        value: 'executive',
    },
    {
        label: 'Broker',
        value: 'broker',
    },
    {
        label: 'Buyer',
        value: 'buyer',
    },
    {
        label: 'Seller',
        value: 'seller',
    },
];

const initialValues = {
    roles: [],
    cell: '',
}

const validationSchema = yup.object().shape({
    roles: yup.array().min(1, 'You must select 1 or more than '),
    cell: yup.string().required(MSG_REQUIRED_FIELD),
})

//  ------------------------------------------------------------------------------------------

export default function EditDialog({ open, setOpen, twilioPhones = [], selectedUser, setSelectedUser, users, setUsers }) {
    const { access_token: accessToken } = useSelector(
        (state) => state?.authReducer
    );
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { roles, cell } = values;
            setLoading(true);
            Patch(BaseURL(`users/assign-roles/${selectedUser?._id}`), {
                role: roles.map(r => r.value),
                cell
            }, apiHeader(accessToken))
                .then((res) => {
                    setLoading(false);
                    const _users = [...users];
                    const index = _users.findIndex((u) => u._id === selectedUser?._id);
                    _users.splice(index, 1, res.data);
                    setUsers(_users);
                    toast.success('Assigned successfully.');
                    onClose();
                })
                .catch((error) => {
                    setLoading(false);
                    toast.error(error?.response?.data?.message || MSG_ERROR);
                })
        }
    })

    const onClose = () => {
        setSelectedUser(null);
        setOpen(false);
    }

    const onChangeRoles = (_, values) => {
        formik.setFieldValue('roles', values)
    }

    useEffect(() => {
        if (selectedUser) {
            if (selectedUser.role?.length > 0) {
                const roles = selectedUser.role.map((r) =>
                    ROLES.find((_r) => _r.value === r)
                    || { label: 'Unknown role', value: 'unknown role' }
                );
                formik.setFieldValue('roles', roles);
            }

            formik.setFieldValue('cell', selectedUser.cell || '');
        }
        formik.setTouched({ roles: false, cell: false });
    }, [selectedUser])

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            {loading ? (
                <DialogContent>
                    <Loader />
                </DialogContent>
            ) : (
                <>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }} component={Box}>
                        <Typography component="h6" variant="h6" fontWeight={700}>Assign Role</Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent>
                        <Stack spacing={2} py={2}>
                            <Autocomplete
                                multiple
                                options={ROLES}
                                getOptionLabel={(r) => r.label}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        name="roles"
                                        {...params}
                                        label="Roles"
                                        fullWidth
                                        error={formik.touched.roles && Boolean(formik.errors.roles)}
                                        helperText={formik.touched.roles && formik.errors.roles}
                                    />
                                )}
                                onChange={onChangeRoles}
                                value={formik.values.roles}
                            />
                            <TextField
                                label="Cell"
                                name="cell"
                                select
                                fullWidth
                                onChange={formik.handleChange}
                                value={formik.values.cell || selectedUser?.cell}
                                error={formik.touched.cell && Boolean(formik.errors.cell)}
                                helperText={formik.touched.cell && formik.errors.cell}
                            >
                                <MenuItem
                                    key={selectedUser?.cell}
                                    value={selectedUser?.cell}
                                >{selectedUser?.cell}</MenuItem>
                                {twilioPhones.map((p) => (
                                    <MenuItem
                                        key={p?.phoneNumber}
                                        value={p?.phoneNumber}
                                    >{p?.phoneNumber}</MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="contained" onClick={() => formik.handleSubmit()}>Save</Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    )
}