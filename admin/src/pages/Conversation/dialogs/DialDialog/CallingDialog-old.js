import { PhoneForwarded, PhoneMissed, VolumeOff, VolumeUp } from "@mui/icons-material";
import { Avatar, Dialog, DialogContent, DialogTitle, Fab, Stack } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useState } from "react";

export default function CallingDialog({ open, setOpen }) {
    const [muted, setMuted] = useState(false);

    const onClose = () => {
        setOpen(false);
    };

    const switchMute = () => {
        setMuted((prev) => !prev);
    };

    return (
        <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
            <DialogTitle>Calling...</DialogTitle>
            <DialogContent>
                <Stack alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: blue[500], width: 100, height: 100 }}>
                        <PhoneForwarded sx={{ fontSize: 56 }} />
                    </Avatar>
                    <Stack direction="row" alignItems="center" spacing={3}>
                        <Fab onClick={switchMute}>
                            {muted ? <VolumeOff /> : <VolumeUp />}
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