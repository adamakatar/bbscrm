import { Dialog, DialogContent, DialogTitle, Fab, Stack, ClickAwayListener, TextField, Typography} from "@mui/material";
import { CallEnd } from "@mui/icons-material";
import { useState, useEffect } from "react";


export default function ForwardDialog({ setForwardNumber }) {

    const [number, setNumber] = useState("");
    const [open, setOpen] = useState(true);

    const onClose = () => {
        setOpen(false);
    };

    const setPhoneNumber = () => {
        onClose();
        setForwardNumber(number);
    };

    useEffect(() => {
        setOpen(true);
    }, []);
    
    return (
            <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Stack>
                            <TextField
                                variant="standard"
                                placeholder="Enter a number"
                                value={number}
                                onChange={num => setNumber(num?.target?.value)}
                                InputProps={{
                                    disableUnderline: true
                                }}
                            />
                        </Stack>
                        <Stack alignItems="center" spacing={3}>
                            <Fab color="success" onClick={setPhoneNumber}>
                                <Typography variant="h5">OK</Typography>
                            </Fab>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
    )
}