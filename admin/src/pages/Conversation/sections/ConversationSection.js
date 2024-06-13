import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Stack, TextField, Paper, Typography, Avatar, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import { blue, green, orange } from "@mui/material/colors";
import { Mail, Message, Phone, ContentCopyOutlined, SpeakerNotes } from "@mui/icons-material";
import { MdOutlineReply } from 'react-icons/md';
import { getFirstLetters, stringToColor } from "../../../utils/functions";
import { filterConversationOptions } from "../../../constant/commonData";
import Loader from "../../../Component/Loader";
import { toast } from "react-toastify";

const getFullName = (c, user, currentContact) => {
    if (!c || !user || !currentContact) {
        return '';
    }
    if (c.type === 'email') {
        return c?.from === user?.email ?
            `${user?.firstName} ${user?.lastName}` :
            `${currentContact?._doc?.firstName} ${currentContact?._doc?.lastName}`;
    }
    return c?.from === user?.contact ?
        `${user?.firstName} ${user?.lastName}` :
        `${currentContact?._doc?.firstName} ${currentContact?._doc?.lastName}`;
}

export default function ConversationSection({ conversations, currentContact, loading, forwardMsg, ...props }) {
    const { user } = useSelector((state) => state?.authReducer || {});
    const [conversationOption, setConversationOption] = useState(filterConversationOptions[0].value);
    const [contextMenu, setContextMenu] = useState(null);
    const [idx, setIdx] = useState();

    const filteredConversations = useMemo(() => {
        if (conversationOption === 'sent-to-me' && Array.isArray(conversations)) {
            return conversations.filter((c) => (
                 c?.to === user?.contact || c?.to === user?.email
            ));
        }
        return conversations.filter(c => {
            if(c?.to?.includes(user?.contact) || c?.to?.includes(user?.email))
              return c;
            if(c?.from?.includes(user?.contact) || c?.from?.includes(user?.email))
              return c;
        });
    }, [conversations, conversationOption]);

    const handleContextMenu = useCallback((event, idx) => {
        event.preventDefault();
        setContextMenu(contextMenu == null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6} : null);
        setIdx(idx);
    });
    
    const handleClose = () => {
        setContextMenu(null);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(filteredConversations[idx]?.text);
        toast.success("Successfully copied", { position: toast.POSITION.TOP_RIGHT});
        handleClose();
    };

    const handleForward = () => {
        forwardMsg(filteredConversations[idx]);
        handleClose();
    };

    return (
        <Stack component={Paper} spacing={2} p={2} {...props} minHeight={600}>
            <TextField
                value={conversationOption}
                onChange={(e) => setConversationOption(e.target.value)}
                select
            >
                {filterConversationOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
            </TextField>

            { filteredConversations?.length > 0 ? 
                <Stack width="100%" direction="column" alignItems="center" marginTop={20} marginBottom={5}>
                    <Stack direction="row" sx={{ gap: '5px' }}>
                        <SpeakerNotes color="success" sx={{ fontSize: '25px' }}></SpeakerNotes>
                        <Typography sx={{ fontWeight: '700', fontSize: '20px' }}>Conversation has started</Typography>
                    </Stack>
                    <Typography>
                    {filteredConversations[filteredConversations.length - 1]?.sentAt ? new Intl.DateTimeFormat("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }).format(new Date(filteredConversations[filteredConversations.length - 1]?.sentAt)) : ''}
                    </Typography>
                </Stack> : <></>
            }

            <Stack flexGrow={1} height={100} overflow="auto" flexDirection={(filteredConversations.length > 1 && conversationOption !== 'sent-to-me') ? "column-reverse" : "column"}>

                {loading ? (
                    <Loader />
                ) : filteredConversations.map((c, idx) => (
                    <React.Fragment>
                        <Stack
                            key={uuidv4()}
                            direction="row"
                            width="100%"
                            sx={{
                                cursor: 'context-menu',
                                marginTop: '16px',
                                justifyContent: (conversationOption !== 'sent-to-me' && (c?.to.includes(user?.contact) || c?.to.includes(user?.email))) ? 'flex-end' : 'flex-start'
                            }}
                            onContextMenu={(event) => handleContextMenu(event, idx)}

                        >
                            <Stack
                                component={Paper}
                                p={1}
                                spacing={1}
                                bgcolor={c?.type === 'call' ? blue[100] : c?.type === 'sms' ? orange[100] : green[100]}
                                minWidth="45%"
                                maxWidth="70%"
                            >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {c?.type === 'call' ? <Phone /> : c?.type === 'sms' ? <Message /> : <Mail />}
                                    <Typography component="span">From: {c?.from}</Typography>
                                </Stack>

                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Avatar
                                        sx={{
                                            bgcolor: stringToColor(getFullName(c, user, currentContact))
                                        }}
                                    >
                                        {getFirstLetters(getFullName(c, user, currentContact))}
                                    </Avatar>
                                    <Typography component="span" fontWeight={700} fontSize={20}>
                                        {getFullName(c, user, currentContact)}
                                    </Typography>
                                </Stack>

                                {c?.type === 'sms' || c?.type === 'email' ? (
                                    <>
                                        <Typography fontWeight={700}>{c?.body || c?.subject}</Typography>
                                        <div dangerouslySetInnerHTML={{ __html: (c?.text?.length >= 50 ? ( c?.text?.slice(0,40).concat('...')) : c?.text) }} sx={{ bgcolor: 'transparent'}}></div>
                                    </>                                    
                                ) : (
                                    <></>
                                )}

                                <Typography component="span" fontSize={12}>
                                    {c?.sentAt ? new Intl.DateTimeFormat("en-US", {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }).format(new Date(c?.sentAt)) : ''}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Menu
                            open={contextMenu !== null}
                            onClose={handleClose}
                            anchorReference="anchorPosition"
                            anchorPosition={
                                contextMenu !== null
                                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                                : undefined
                            }
                            sx={{
                                '& .MuiPaper-root': {
                                    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <MenuItem onClick={handleCopy}>
                                <ListItemIcon>
                                    <ContentCopyOutlined />
                                </ListItemIcon>
                                <ListItemText>
                                    Copy
                                </ListItemText>
                            </MenuItem>

                            <MenuItem onClick={handleForward}>
                                <ListItemIcon>
                                    <MdOutlineReply style={{ transform: 'rotate(180deg)'}}/>
                                </ListItemIcon>
                                <ListItemText>
                                    Forward
                                </ListItemText>
                            </MenuItem>
                        </Menu>      
                    </React.Fragment>
                ))}
            </Stack>
        </Stack>
    )
}