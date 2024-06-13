import { useEffect, useState } from "react";
import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Grid, List, ListItemAvatar, ListItemButton, ListItemText, Stack, TextField } from "@mui/material";
import { Backspace, Phone, Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Device } from "twilio-client";
import { toast } from "react-toastify";
import { getFirstLetters, stringToColor } from "../../../../utils/functions";
import CallingDialog from "./CallingDialog";
import { Get, Post } from "../../../../Axios/AxiosFunctions";
import { BaseURL, apiHeader } from "../../../../config/apiUrl";
import { MSG_ERROR } from "../../../../utils/contants";
import { Search } from '@mui/icons-material';

//  --------------------------------------------------------------------------------

const REGEXP_FOR_DIAL = /^[\d*#+]+$/;

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'];

let s = false;

//  --------------------------------------------------------------------------------

export default function DialDialog({ open, setOpen, contacts, currentContact, setConversations, device, disableSideBar }) {
    const { user, access_token: accessToken } = useSelector((state) => state?.authReducer || {});

    const [selectedContact, setSelectedContact] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [calling, setCalling] = useState(false);
    // const [device, setDevice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = contacts.filter((c) => {
        const fullName = `${c?._doc?.firstName} ${c?._doc?.lastName}`;
        return (
            fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c?._doc?.contact.includes(searchTerm)
        );
    });

    const onClose = () => {
        setOpen(false);
        setPhoneNumber('');
        // setDevice(null);
    };

    const onChangePhoneNumber = (e) => {
        if (REGEXP_FOR_DIAL.test(e.target.value) || !e.target.value) {
            setPhoneNumber(e.target.value);
        }
    };

    const onClickDial = (value) => {
        setPhoneNumber((prev) => `${prev}${value}`);
    }

    const onBackSpace = () => {
        setPhoneNumber((prev) => prev.slice(0, -1));
    }

    const onSubmit = () => {
        if (device) {
            let errorCalled = false;

            setCalling(true);

            device.connect({
                number: phoneNumber,
            });

            device.on('error', () => {
                if (!errorCalled) {
                    Post(BaseURL('communication/s-make-call'), {
                        to: phoneNumber
                    }, apiHeader(accessToken)).then((res) => {
                        setCalling(false);
                        setConversations && setConversations((prev) => [
                            {
                                type: "call",
                                sentAt: res.data?.createdAt,
                                from: res.data?.from,
                                to: res.data?.to,
                                status: res.data?.direction,
                            },
                            ...prev,
                        ]);
                        onClose();
                    }).catch((err) => {
                        toast.err(err?.response?.data || err.toString() || MSG_ERROR);
                    });
                    errorCalled = !errorCalled;
                }
            });
        } else {
            toast.warn("The device wasn't initialized yet.");
        }
    }

    useEffect(() => {
        if (selectedContact) {
            setPhoneNumber(selectedContact._doc?.contact);
        }
    }, [selectedContact]);

    useEffect(() => {
        if (!s) {
            // Get(BaseURL(`communication/token?identity=${user?.email}`))
            //     .then((res) => {
            //         console.log('>>>>>> res.data => ', res.data);
            //         setDevice(new Device(res.data));
            //     })
            //     .catch((err) => {
            //         console.log('>>>>>>>>>> get token of twilio');
            //     });
            s = !s;
        }
    }, []);

    useEffect(() => {
        setPhoneNumber(currentContact?._doc?.contact);
    }, [currentContact]);

    const populateForm = () => 
        <Stack spacing={2}>
            <Box pt={2} px={2}>
                <TextField
                    size="lg"
                    fullWidth
                    variant="standard"
                    InputProps={{
                        sx: { fontSize: 36 }
                    }}
                    value={phoneNumber}
                    onChange={(e) => onChangePhoneNumber(e)}
                />
            </Box>
            <Box>
                <Grid container spacing={.5}>
                    {KEYS.map((k) => (
                        <Grid item md={4} key={k}>
                            <Button
                                variant="contained"
                                sx={{
                                    width: '100%',
                                    fontSize: 36,
                                    fontWeight: 700,
                                }}
                                onClick={() => onClickDial(k)}
                            >{k}</Button>
                        </Grid>
                    ))}
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="contained"
                            sx={{
                                width: '100%',
                                py: 2
                            }}
                            color="success"
                            onClick={onSubmit}
                        >
                            <Phone sx={{ fontSize: 36 }} />
                        </Button>
                    </Grid>

                    <Grid item md={4}>
                        <Button
                            variant="contained"
                            sx={{
                                width: '100%',
                                py: 2,
                            }}
                            color="secondary"
                            onClick={() => onBackSpace()}
                        >
                            <Backspace sx={{ fontSize: 36 }} />
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Stack>    

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
                        <Avatar
                            variant="outlined"
                            onClick={onClose}
                            sx={{ bgcolor: 'white', color: 'black'}}
                        >
                            <Close />
                        </Avatar>
                    </Box>                        
                </DialogTitle>
                <DialogContent sx={{ p: 1 }}>
                    <Grid container spacing={2}>
                    {
                        !disableSideBar && <Grid item md={4}>
                            <Box pt={2} px={2}>
                            <TextField
                                InputProps={{
                                    startAdornment: <Search />
                                }}
                                placeholder="Type here to search..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                            />
                            </Box>
                            <List sx={{ width: '100%', flexGrow: 1 }}>
                                {filteredContacts.map((c, idx) => (
                                    <ListItemButton
                                        key={idx}
                                        sx={{ alignItems: 'start', width: '100%' }}
                                        selected={c?._doc?._id === selectedContact?._doc?._id}
                                        onClick={() => setSelectedContact(c)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                variant="rounded"
                                                alt="Username"
                                                sx={{ bgcolor: stringToColor(`${c?._doc?.firstName} ${c?._doc?.lastName}`) }}
                                            >
                                                {getFirstLetters(`${c?._doc?.firstName} ${c?._doc?.lastName}`)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${c?._doc?.firstName} ${c?._doc?.lastName}`} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Grid>
                    }
                    {
                        disableSideBar ? 
                        <Grid item md={12}>
                          {populateForm()}
                        </Grid> :
                        <Grid item md={8}>
                          {populateForm()}
                        </Grid>
                    }
                  </Grid>
                </DialogContent>
            </Dialog>

            <CallingDialog
                open={calling}
                setOpen={setCalling}
                to={phoneNumber}
                contact={selectedContact || currentContact}
                device={device}
            />
        </>
    )
}