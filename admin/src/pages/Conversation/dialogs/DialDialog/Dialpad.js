import { Dialog, DialogContent, DialogTitle, Fab, Stack, TextField, Typography, Avatar, Box } from "@mui/material";
import { Close, PhoneMissed } from "@mui/icons-material";
import { CallEnd } from "@mui/icons-material";
import { useState, useEffect } from "react";

export default function DialpadDialog({ device }) {

    const [number, setNumber] = useState("");
    const [open, setOpen] = useState(true);

    const onClose = () => {
        if(!device)
            device.disconnect();
        setOpen(false);
    };

    const onKeyUp = (code) => {
        if(code.keycode == 8) 
            setNumber(number.slice(0,-1));
    };

    const makeDial = () => {

    };

    useEffect(() => {
        setOpen(true);
    }, []);

    return (
            <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
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
                <DialogContent>
                    <Stack spacing={2}>
                        <Stack>
                            <Typography variant="h6">
                                My Caller ID: (303) 268-0007
                            </Typography>
                            <TextField
                                variant="standard"
                                placeholder="Enter a name or number"
                                value={number}
                                onKeyUp={onKeyUp}
                                InputProps={{
                                    disableUnderline: true
                                }}
                            />
                        </Stack>
                        <Stack justifyContent="center" alignItems="center" spacing={2}>
                            <Stack direction="row" justifyContent="cener" spacing={2}>
                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={'white'} onClick={() => setNumber(number.concat("1"))}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">1
                                        </Typography>
                                    </Fab>
                                </Stack>
                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={'white'} onClick={() => setNumber(number.concat("2"))} sx={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">2
                                        </Typography>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '15px'}}
                                            component="div">ABC
                                        </Typography>
                                    </Fab>
                                </Stack>
                                <Stack alignItems="center" spacing={2}>
                                <Fab color={'white'} onClick={() => setNumber(number.concat("3"))} sx={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">3
                                        </Typography>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '15px'}}
                                            component="div">DEF
                                        </Typography>
                                    </Fab>
                                </Stack>
                            </Stack>
                            <Stack direction="row" justifyContent="cener" spacing={2}>
                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={'white'} onClick={() => setNumber(number.concat("4"))} sx={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">4
                                        </Typography>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '15px'}}
                                            component="div">GHI
                                        </Typography>
                                    </Fab>
                                </Stack>
                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={'white'} onClick={() => setNumber(number.concat("5"))} sx={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">5
                                        </Typography>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '15px'}}
                                            component="div">JKL
                                        </Typography>
                                    </Fab>
                                </Stack>
                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={'white'} onClick={() => setNumber(number.concat("6"))} sx={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">6
                                        </Typography>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '15px'}}
                                            component="div">NMO
                                        </Typography>
                                    </Fab>
                                </Stack>
                            </Stack>
                            <Stack direction="row" justifyContent="cener" spacing={2}>
                            <Stack alignItems="center" spacing={2}>
                                <Fab color={'white'} onClick={() => setNumber(number.concat("7"))} sx={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">7
                                        </Typography>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '15px'}}
                                            component="div">PQRS
                                        </Typography>
                                    </Fab>
                                </Stack>

                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={'white'} onClick={() => setNumber(number.concat("8"))} sx={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">8
                                        </Typography>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '15px'}}
                                            component="div">TUV
                                        </Typography>
                                    </Fab>
                                </Stack>

                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={'white'} onClick={() => setNumber(number.concat("9"))} sx={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">9
                                        </Typography>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '15px'}}
                                            component="div">WXYZ
                                        </Typography>
                                    </Fab>
                                </Stack>
                            </Stack>
                            <Stack direction="row" justifyContent="cener" spacing={2}>
                            <Stack alignItems="center" spacing={2}>
                                <Fab color={'white'} onClick={setNumber} sx={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">*
                                        </Typography>
                                    </Fab>
                                </Stack>

                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={'white'} onClick={setNumber} sx={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">0
                                        </Typography>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '15px'}}
                                            component="div">+
                                        </Typography>
                                    </Fab>
                                </Stack>

                                <Stack alignItems="center" spacing={2}>
                                    <Fab color={'white'} onClick={setNumber}>
                                        <Typography sx={{textTransform: 'capitalize', fontSize: '18px'}}
                                            component="div">#
                                        </Typography>
                                    </Fab>
                                </Stack>
                            </Stack>

                        </Stack>
                        <Stack alignItems="center" spacing={3}>
                            <Fab color="success" onClick={makeDial}>
                                <CallEnd />
                            </Fab>
                            <Fab color="error" onClick={onClose}>
                                <PhoneMissed />
                            </Fab>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
    )
}