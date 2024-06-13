import { useEffect, useState } from "react";
import {
    Avatar,
    Container,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    Stack,
    IconButton,
    Card,
    TableContainer
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { BaseURL, imageUrl } from "../../config/apiUrl";
import { Get } from "../../Axios/AxiosFunctions";
import { MSG_ERROR } from "../../utils/contants";
import EditDialog from "./EditDialog";
import classes from './ManageAdmins.module.css';
import Loader from '../../Component/Loader';

export default function ManageAdmins() {
    const [users, setUsers] = useState([]);
    const [editOpened, setEditOpened] = useState(false);
    const [twilioPhones, setTwilioPhones] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const openEditDialog = (u) => {
        setSelectedUser(u)
        setEditOpened(true);
    }

    useEffect(() => {
        setLoading(true);
        Get(BaseURL('users/get-members'))
            .then((res) => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error?.response?.data || MSG_ERROR);
            })
        Get(BaseURL('users/get-twillio-numbers'))
            .then((res) => {
                if (typeof res?.data === 'string') {
                    toast.error(res.data)
                } else {
                    setTwilioPhones(res?.data || []);
                }
            })
            .catch((error) => {
                toast.error(error?.response?.data || MSG_ERROR);
            })
    }, []);

    return (
        <SideBarSkeleton>
            <Container maxWidth="7xl" className={classes.content}>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <Typography component="h2" variant="h4" fontWeight={700} sx={{ color: '#02528a' }}>
                            Manage Administrators
                        </Typography>

                        <TableContainer component={Card}>
                            <Table sx={{ mt: 5 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th" sx={{ fontWeight: 700 }}>No</TableCell>
                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Image</TableCell>
                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Name</TableCell>
                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Email</TableCell>
                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Role</TableCell>
                                        <TableCell component="th" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {users.map((u, i) => (
                                        <TableRow key={u?._id}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                <Avatar
                                                    alt={`${u?.firstName} ${u?.lastName}`}
                                                    src={imageUrl(u?.photo)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {u?.firstName} {u?.lastName}
                                            </TableCell>
                                            <TableCell>
                                                {u?.email}
                                            </TableCell>
                                            <TableCell>
                                                {u?.role?.includes('admin') ? 'Admin' : ''}
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center">
                                                    <IconButton onClick={() => openEditDialog(u)}>
                                                        <Edit />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Container>
            <EditDialog
                open={editOpened}
                setOpen={setEditOpened}
                twilioPhones={twilioPhones}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                users={users}
                setUsers={setUsers}
            />
        </SideBarSkeleton>
    )
}