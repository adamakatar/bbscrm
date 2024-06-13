import { PhoneMissed, VolumeOff, Dialpad, VolumeUp, Add, Pause, MoreHoriz, Videocam, Mic, PhoneForwarded, MicOff, SwapHoriz, RadioButtonChecked } from "@mui/icons-material";
import { Avatar, Dialog, DialogContent, DialogTitle, Fab, Stack, Box, Grid, TextField, Typography} from "@mui/material";
import { toast } from 'react-toastify';
import { grey } from "@mui/material/colors";
import { useState, useEffect } from "react";
import { BaseURL } from "../../../../config/apiUrl";
import { Get, Post } from "../../../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { getFirstLetters, stringToColor } from "../../../../utils/functions";
import DialpadDialog from "./Dialpad";
import ForwardDialog from "./ForwardDialog";

export default function CallingDialog({ open, setOpen, contact, device, to }) {
    const { user, access_token: accessToken } = useSelector(
        (state) => state?.authReducer || {}
      );    
    const [muted, setMuted] = useState(false);
    const [active, setActive] = useState(false);
    const [showForward, setShowForward] = useState(false);
    const firstLetter = `${contact?._doc?.firstName || ''}` + `${contact?._doc?.lastName || ''}`;
    const [showDialpad, setShowDialpad] = useState(false);
    const [number, setNumber] = useState([contact?._doc?.contact]);
    const [participant, setParticipant] = useState([]);
    const [showForwardDlg, setShowForwardDlg] = useState(false);
    const [param, setParam] = useState({});
    const [HA, setHA] = useState(true);
    const [record, setRecord] = useState(false);

    const downloadLink = () => {
        {
            toast.success("Call successfully recorded");

            let downloadLink;

            Post(BaseURL('communication/call/record/link'), { to: number[number.length - 1]}, accessToken)
            .then(res => downloadLink = res.data);

            let downloadElement = document.createElement("a");
            downloadElement.setAttribute("download", "record.mp3");
            downloadElement.href = downloadLink;
            document.body.appendChild(downloadElement);
            downloadElement.click();
        }
    };

    const onClose = async () => {
        setOpen(false);

        Post(
            BaseURL('communication/call/hangup'),
            {
                to: number[number.length - 1]
            },
            accessToken
        );        
        
        if(participant.length > 0) {
            Post(
                BaseURL('communication/call/conference/hangup'),
                { participants: participant }
            );
        }        
        if(device)
            device.disconnectAll();
    };

    const switchMute = () => {
        setMuted((prev) => !prev);
    };

    const showDialPad = () => {
        setParam({});
        setShowDialpad(true);
    };

    useEffect(() => {
        if(device) {
            device.on('accept', device => {
                setActive(true);
            });

            device.on('connect', device => {
                setActive(true);
            });

            device.on('ringing', device => {
                setActive(true);
            });

            device.on('reject', async connection => {
                setOpen(false);
                if(record)
                  {  await downloadLink(); }
                device.destroy();
            });

           
            device.on('incoming', call => {
                const from = call.parameters.From;
                call?.accept();
                participant.push(from);
                console.log('>>>>call', call);
            });

            device.on('offline', param => {
                Get(BaseURL(`communication/token?identity=${user?.email}`))
                .then((res) => {
                    device.setup(res.data);
                })
                .catch((err) => {
                    console.log('>>>>>>>>>> get token of twilio');
                });
            });
        }

        return () => {
            setShowDialpad(false);
        };
    }, []);

    const setVolumeUpDown = () => {

    };

    const setAddCall = () => {
        setParam({ participant: true });
        setShowDialpad(true);
    };

    const doHoldCall = (to) => {
        Post(
            BaseURL('communication/call/hold'),
            {
                to: to
            },
            accessToken
        );
    };

    const doUnholdCall = (to) => {
        Post(
            BaseURL('communication/call/unhold'),
            {
                to: to
            },
            accessToken
        );
    };

    const setHoldCall = () => {
        if(HA) {
            doHoldCall(number[number.length - 1]);
        } else {
            doUnholdCall(number[number.length - 1]);
        }
        setHA(!HA);        
    };

    const setTransferCall = () => {
        Post(
            BaseURL('communication/call/transfer'),
            {
                first: number[number.length - 2],
                second: number[number.length - 1]
            },
            accessToken
        );
    };

    const setRecordCall = () => {
        setRecord(!record);
    };

    const setVideoCall = () => {
        Post(
            BaseURL('communication/call/video'),
            {
                sid: process.env.TWILIO_SID
            },
            accessToken
        );
    };

    const setMore = () => {
        setShowForward(true);
    };

    const setForwardOption = () => {
        setShowForwardDlg(true);
    };

    const setForwardNumber = (num) => {
        Post(
            BaseURL('communication/call/forward'),
            { 
                sid: process.env.TWILIO_SID, num: num 
            },
            accessToken
        );
    };

    useEffect(() => {
        if(participant.length > 0){
            Post(
                BaseURL('communication/call/conference'),
                {
                    participants: participant[participant.length - 1],
                    initiate: number.length <= 1 ? number[number.length - 1] : "-1"
                },
                accessToken
            );
        }
    }, [participant]);

    useEffect(() => {
        if(number.length > 0 && number[number.length - 1] != contact?._doc?.contact && device) {
            device.connect({
                number: number[number.length - 1]
            });
        }
    }, [number]);

    return (
        <>
        <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
            <DialogTitle sx={{ marginTop: '10px' }}></DialogTitle>
            <DialogContent>
                <Stack>
                    <Stack container direction="row" spacing={2}>
                        <Avatar
                            alt="Username"
                            sx={{ bgcolor: stringToColor(firstLetter), width: 50, height: 50}}
                        >
                            {getFirstLetters(firstLetter || 'unknown')}
                        </Avatar>
                        <Grid container spacing={2}>
                            <Typography variant="h6" fontWeight={700}>{!firstLetter ? '' : firstLetter}</Typography>
                            <Typography variant="h6" marginBottom="10px">{!contact?.contact ? to : contact?.contact}</Typography>
                        </Grid>
                    </Stack>
                    <Stack justifyContent="center" alignItems="center" spacing={2}>
                        <Stack direction="row" justifyContent="cener" spacing={2}>
                            <Stack alignItems="center" spacing={2}>
                                <Fab color={grey[100]} onClick={setMuted}>
                                    <Mic sx={{fontSize: '30px'}}/>
                                </Fab>
                                <Typography sx={{textTransform: 'capitalize', fontSize: '14px'}}
                                    component="div">Mute
                                </Typography>
                            </Stack>
                            <Stack alignItems="center" spacing={2}>
                                <Fab color={grey[100]} onClick={showDialPad}>
                                    <Dialpad sx={{fontSize: '30px'}}/>
                                </Fab>
                                <Typography sx={{textTransform: 'capitalize', fontSize: '14px'}}
                                    component="div">Dialpad
                                </Typography>
                            </Stack>
                            <Stack alignItems="center" spacing={2}>
                                <Fab color={grey[100]} onClick={setVolumeUpDown}>
                                    <VolumeUp sx={{fontSize: '30px'}}/>
                                </Fab>
                                <Typography sx={{textTransform: 'capitalize', fontSize: '14px'}}
                                    component="div">Volume
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack direction="row" justifyContent="cener" spacing={2}>
                            <Stack alignItems="center" spacing={2}>
                                <Fab color={grey[100]} onClick={setAddCall}>
                                    <Add sx={{fontSize: '30px'}}/>
                                </Fab>
                                <Typography sx={{textTransform: 'capitalize', fontSize: '14px'}}
                                    component="div">Add
                                </Typography>
                            </Stack>
                            <Stack alignItems="center" spacing={2}>
                                <Fab color={grey[100]} onClick={setHoldCall}>
                                    <Pause sx={{fontSize: '30px'}}/>
                                </Fab>
                                <Typography sx={{textTransform: 'capitalize', fontSize: '14px'}}
                                    component="div">{HA ? "Hold" : "Unhold"}
                                </Typography>
                            </Stack>
                            <Stack alignItems="center" spacing={2}>
                                <Fab color={grey[100]} onClick={setTransferCall}>
                                    <SwapHoriz sx={{fontSize: '30px'}}/>
                                </Fab>
                                <Typography sx={{textTransform: 'capitalize', fontSize: '14px'}}
                                    component="div">Transfer
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack direction="row" justifyContent="cener" spacing={2}>
                           <Stack alignItems="center" spacing={2}>
                                <Fab color={grey[100]} onClick={setRecordCall}>
                                    <RadioButtonChecked sx={{fontSize: '30px'}}/>
                                </Fab>
                                <Typography sx={{textTransform: 'capitalize', fontSize: '14px'}}
                                    component="div">{ record ? "Recording" : "Record" }
                                </Typography>
                            </Stack>

                            <Stack alignItems="center" spacing={2}>
                                <Fab color={grey[100]} onClick={setVideoCall}>
                                    <Videocam sx={{fontSize: '30px'}}/>
                                </Fab>
                                <Typography sx={{textTransform: 'capitalize', fontSize: '14px'}}
                                    component="div">Video
                                </Typography>
                            </Stack>

                            { !showForward ? 
                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={grey[100]} onClick={setMore}>
                                        <MoreHoriz sx={{fontSize: '30px'}}/>
                                    </Fab>
                                    <Typography sx={{textTransform: 'capitalize', fontSize: '14px'}}
                                        component="div">More
                                    </Typography>
                                </Stack> :
                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={grey[100]} onClick={setForwardOption}>
                                        <PhoneForwarded sx={{fontSize: '30px'}}/>
                                    </Fab>
                                    <Typography sx={{textTransform: 'capitalize', fontSize: '14px'}}
                                        component="div">Forward
                                    </Typography>
                                </Stack> } 
                        </Stack>
                    </Stack>
                    <Stack alignItems="center" spacing={3}>
                        <Fab color="error" onClick={onClose}>
                            <PhoneMissed />
                        </Fab>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
        {showDialpad && <DialpadDialog open={true} device={device} {...param}/>}
        {showForwardDlg && <ForwardDialog open={true} setForwardNumber={(num) => setForwardNumber(num)}/>}
        </>
    )
}