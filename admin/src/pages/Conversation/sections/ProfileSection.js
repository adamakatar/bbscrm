import React, { useState } from "react";
import { Modal, ListItem, List, ListItemIcon, Button, Box } from "@mui/material";
import { CalendarToday, AccountCircle, Hub, Settings } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

export default function ProfileSection({ currentContact }) {

    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);
    const handleShow = () => setOpen(true);

    return (
        <React.Fragment>
            <Button 
                variant="contained"  
                onClick={handleShow}
                sx={{
                    textTransform: 'capitalize',
                    bgcolor: 'rgba(20,20,20,0.5)',
                    height: '60px',
                    '&:hover': {
                        bgcolor: 'rgba(20,20,20,0.7)'
                    }
                }}
            >
                <Settings sx={{ fontSize: '40px'}}/>                
            </Button>
            <Modal 
                open={open}
                onClose={handleClose}
                sx={{ 
                    height: '100%' 
                }}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"                
            >
                <Box sx={{ width: '50px', height: '200px'}}>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CalendarToday sx={{ 
                                    '&:hover': {
                                        color: blue[500]
                                    }
                                }}/>
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <AccountCircle 
                                    sx={{ 
                                        '&:hover': {
                                            color: blue[500]
                                        }
                                    }}
                                />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Hub sx={{ 
                                    '&:hover': {
                                        color: blue[500]
                                    }
                                }}/>
                            </ListItemIcon>
                        </ListItem>
                    </List>

                </Box>
            </Modal>
        </React.Fragment>
    )
} 